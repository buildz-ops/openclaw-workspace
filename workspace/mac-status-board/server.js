const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const si = require('systeminformation');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Helper: Ping (fix URL)
function getPing() {
    return new Promise((resolve) => {
        si.inetChecksite('https://google.com').then(data => {
            resolve(data.ms);
        }).catch(() => resolve(0));
    });
}

// Helper: CPU Temp (Try CLI)
function getCpuTemp() {
    return new Promise((resolve) => {
        // Try osx-cpu-temp
        exec('osx-cpu-temp', (error, stdout) => {
            if (!error && stdout) {
                const temp = parseFloat(stdout.replace('°C', '').trim());
                if (temp > 0) {
                    resolve(temp);
                    return;
                }
            }
            resolve(null);
        });
    });
}

// Helper: Thermal Pressure (Robust)
function getThermalPressure() {
    return new Promise((resolve) => {
        // 1. Try sysctl (Full Path)
        exec('/usr/sbin/sysctl -n machdep.xcpm.cpu_thermal_level', (error, stdout) => {
            if (!error && stdout) {
                const level = stdout.trim();
                if (level === '0') { resolve("Normal"); return; }
                if (level === '1') { resolve("Fair"); return; }
                if (level === '2') { resolve("Serious"); return; }
                if (level === '3') { resolve("Critical"); return; }
            }

            // 2. Fallback: pmset (Power Management)
            exec('/usr/bin/pmset -g therm', (err, out) => {
                if (!err && out.includes("No thermal warning level has been recorded")) {
                    resolve("Normal");
                } else {
                    resolve("Unknown");
                }
            });
        });
    });
}

async function getStats() {
    try {
        const [cpu, mem, disk, netStats, netIfaces, osInfo, cpuInfo, ping, thermal] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.networkInterfaces(),
            si.osInfo(),
            si.cpu(),
            getPing(),
            getThermalPressure()
        ]);

        let tempMain = await getCpuTemp();
        if (!tempMain) {
             const cpuTemp = await si.cpuTemperature();
             tempMain = cpuTemp.main;
        }

        // Merge network data
        const detailedNetwork = netStats.map(stat => {
            const iface = netIfaces.find(i => i.iface === stat.iface);
            return {
                iface: stat.iface,
                rx_sec: (stat.rx_sec / 1024).toFixed(1),
                tx_sec: (stat.tx_sec / 1024).toFixed(1),
                ip4: iface ? iface.ip4 : 'N/A',
                mac: iface ? iface.mac : 'N/A',
                type: iface ? iface.type : 'Unknown',
                operstate: stat.operstate
            };
        });

        // Identify primary interface
        const primaryNet = detailedNetwork.find(n => n.ip4 !== 'N/A' && n.ip4 !== '127.0.0.1' && !n.iface.startsWith('lo')) || detailedNetwork[0];

        return {
            cpu: {
                load: cpu.currentLoad.toFixed(1),
                cores: cpu.cpus.map(c => c.load.toFixed(1)),
                temp: tempMain, 
                thermal: thermal,
                info: `${cpuInfo.manufacturer} ${cpuInfo.brand} @ ${cpuInfo.speed}GHz`
            },
            mem: {
                total: (mem.total / 1024 / 1024 / 1024).toFixed(1),
                used: (mem.active / 1024 / 1024 / 1024).toFixed(1),
                free: (mem.available / 1024 / 1024 / 1024).toFixed(1),
                percent: ((mem.active / mem.total) * 100).toFixed(1)
            },
            disk: disk.map(d => ({
                fs: d.fs,
                mount: d.mount,
                size: (d.size / 1024 / 1024 / 1024).toFixed(1),
                used: (d.used / 1024 / 1024 / 1024).toFixed(1),
                percent: d.use.toFixed(1)
            })),
            network: detailedNetwork,
            primaryNet: primaryNet,
            ping: ping,
            os: {
                hostname: os.hostname(),
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release,
                uptime: new Date(os.uptime() * 1000).toISOString().substr(11, 8)
            }
        };
    } catch (e) {
        console.error("Error fetching stats:", e);
        return null;
    }
}

io.on('connection', (socket) => {
    getStats().then(data => socket.emit('stats', data));
    const interval = setInterval(async () => {
        const data = await getStats();
        if (data) socket.emit('stats', data);
    }, 1000);
    socket.on('disconnect', () => clearInterval(interval));
});

const PORT = 3333;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
