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
        exec('osx-cpu-temp', (error, stdout, stderr) => {
            if (error || !stdout) {
                resolve(null);
                return;
            }
            // "50.5 °C"
            const temp = parseFloat(stdout.replace('°C', '').trim());
            resolve(temp === 0 ? null : temp); // 0.0 usually means failure on Silicon
        });
    });
}

async function getStats() {
    try {
        const [cpu, mem, disk, netStats, netIfaces, osInfo, cpuInfo, ping] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.networkInterfaces(),
            si.osInfo(),
            si.cpu(),
            getPing()
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

        // Identify primary interface (not internal, has IP)
        const primaryNet = detailedNetwork.find(n => n.ip4 !== 'N/A' && n.ip4 !== '127.0.0.1' && !n.iface.startsWith('lo')) || detailedNetwork[0];

        return {
            cpu: {
                load: cpu.currentLoad.toFixed(1),
                cores: cpu.cpus.map(c => c.load.toFixed(1)),
                temp: tempMain || "N/A", // Show string if null
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
            primaryNet: primaryNet, // Send identified primary for Overview
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
