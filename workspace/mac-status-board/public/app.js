const socket = io();

// UI Elements
const els = {
    loading: document.getElementById('loading'),
    app: document.getElementById('app'),
    osDistro: document.getElementById('os-distro'),
    osRelease: document.getElementById('os-release'),
    osUptime: document.getElementById('os-uptime'),
    cpuLoadMini: document.getElementById('cpu-load-mini'),
    memPercentMini: document.getElementById('mem-percent-mini'),
    memTotal: document.getElementById('mem-total'),
    memUsed: document.getElementById('mem-used'),
    memFree: document.getElementById('mem-free'),
    cpuTemp: document.getElementById('cpu-temp'),
    cpuCores: document.getElementById('cpu-cores'),
    cpuSpeed: document.getElementById('cpu-speed'),
    diskContainer: document.getElementById('disk-container'),
    networkContainer: document.getElementById('network-container'),
    memProgressBar: document.getElementById('mem-progress'),
    // New
    storageMainPercent: document.getElementById('storage-main-percent'),
    storageMainBar: document.getElementById('storage-main-bar'),
    netDownMini: document.getElementById('net-down-mini'),
    netUpMini: document.getElementById('net-up-mini'),
    netPing: document.getElementById('net-ping'),
    netPrimaryIpMini: document.getElementById('net-primary-ip-mini'),
    netPrimaryIp: document.getElementById('net-primary-ip'),
    netPrimaryIface: document.getElementById('net-primary-iface')
};

// Charts Configuration
Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.font.family = 'Inter';

let cpuMiniChart, memMiniChart, cpuMainChart, memHistoryChart;

function initCharts() {
    // 1. CPU Mini (Overview)
    cpuMiniChart = new Chart(document.getElementById('cpu-mini-chart'), {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'CPU Load',
                data: Array(20).fill(0),
                borderColor: '#007aff',
                backgroundColor: 'rgba(0, 122, 255, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { min: 0, max: 100, display: false }
            },
            animation: false
        }
    });

    // 2. Memory Mini (Overview)
    memMiniChart = new Chart(document.getElementById('mem-mini-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#ff2d55', 'rgba(255, 255, 255, 0.1)'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            animation: false
        }
    });

    // 3. CPU Main (Detailed)
    cpuMainChart = new Chart(document.getElementById('cpu-main-chart'), {
        type: 'line',
        data: {
            labels: Array(60).fill(''),
            datasets: [{
                label: 'Load %',
                data: Array(60).fill(0),
                borderColor: '#34c759',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { min: 0, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            },
            animation: false
        }
    });

    // 4. Memory History (Detailed)
    memHistoryChart = new Chart(document.getElementById('mem-history-chart'), {
        type: 'line',
        data: {
            labels: Array(60).fill(''),
            datasets: [{
                label: 'RAM Usage (GB)',
                data: Array(60).fill(0),
                borderColor: '#af52de',
                backgroundColor: 'rgba(175, 82, 222, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { min: 0, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            },
            animation: false
        }
    });
}

// Data Handling
socket.on('stats', (data) => {
    // Hide loading screen on first data
    if (els.loading.style.display !== 'none') {
        els.loading.style.display = 'none';
        els.app.style.display = 'flex';
        initCharts();
    }

    updateUI(data);
});

function updateUI(data) {
    // 1. Overview
    els.osDistro.innerText = `${data.os.distro} (${data.os.platform})`;
    els.osRelease.innerText = `Kernel ${data.os.release}`;
    els.osUptime.innerText = data.os.uptime;
    els.cpuLoadMini.innerText = `${data.cpu.load}%`;
    els.memPercentMini.innerText = `${data.mem.percent}%`;

    // Overview: Storage
    if (data.disk.length > 0) {
        const mainDisk = data.disk[0];
        els.storageMainPercent.innerText = `${mainDisk.percent}% Used`;
        els.storageMainBar.style.width = `${mainDisk.percent}%`;
        els.storageMainBar.style.background = mainDisk.percent > 90 ? '#ff3b30' : '#007aff';
    }

    // Overview: Network Summary
    // Use PrimaryNet from backend
    const pNet = data.primaryNet || {};
    els.netDownMini.innerText = `↓ ${pNet.rx_sec || 0} KB/s`;
    els.netUpMini.innerText = `↑ ${pNet.tx_sec || 0} KB/s`;
    els.netPrimaryIpMini.innerText = pNet.ip4 || 'No Connection';
    els.netPing.innerText = `${data.ping || 0} ms`;

    // 2. CPU
    els.cpuTemp.innerText = data.cpu.temp !== "N/A" ? `${data.cpu.temp}°C` : 'N/A';
    els.cpuCores.innerText = data.cpu.cores.length;
    els.cpuSpeed.innerText = data.cpu.info.split('@')[1] || 'Unknown';

    // 3. Memory
    els.memTotal.innerText = `${data.mem.total} GB`;
    els.memUsed.innerText = `${data.mem.used} GB`;
    els.memFree.innerText = `${data.mem.free} GB`;
    els.memProgressBar.style.width = `${data.mem.percent}%`;

    // 4. Update Charts
    updateChart(cpuMiniChart, data.cpu.load);
    updateChart(cpuMainChart, data.cpu.load);
    updateChart(memHistoryChart, data.mem.used);
    
    memMiniChart.data.datasets[0].data = [data.mem.used, data.mem.free];
    memMiniChart.update();

    // 5. Storage
    els.diskContainer.innerHTML = '';
    data.disk.forEach(disk => {
        const div = document.createElement('div');
        div.className = 'glass-card';
        div.innerHTML = `
            <h3>${disk.mount} (${disk.fs})</h3>
            <div class="stat-row"><span class="label">Used</span><span class="value">${disk.used} GB</span></div>
            <div class="stat-row"><span class="label">Total</span><span class="value">${disk.size} GB</span></div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${disk.percent}%; background: ${disk.percent > 90 ? '#ff3b30' : '#34c759'}"></div>
            </div>
            <div class="big-number" style="font-size: 1.5rem; margin-top: 10px;">${disk.percent}%</div>
        `;
        els.diskContainer.appendChild(div);
    });

    // 6. Network (Detailed Tab)
    els.netPrimaryIface.innerText = pNet.iface || 'N/A';
    els.netPrimaryIp.innerText = pNet.ip4 || 'N/A';
    
    els.networkContainer.innerHTML = '';
    data.network.forEach(net => {
        // Show interfaces that are active OR have an IP (excluding localhost loopback unless it's the only one)
        if (net.iface !== 'lo0' || data.network.length === 1) {
            const div = document.createElement('div');
            div.className = 'glass-card';
            div.innerHTML = `
                <h3>${net.iface} <span style="font-size:0.7em; opacity:0.6">${net.type}</span></h3>
                <div class="stat-row"><span class="label">IP Address</span><span class="value">${net.ip4 || 'N/A'}</span></div>
                <div class="stat-row"><span class="label">MAC</span><span class="value" style="font-size:0.8em">${net.mac || 'N/A'}</span></div>
                <div class="stat-row"><span class="label">State</span><span class="value" style="color: ${net.operstate === 'up' ? '#34c759' : '#ff3b30'}">${net.operstate}</span></div>
                
                <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <div class="label">Download</div>
                        <div style="font-size: 1.2rem; font-weight: 600;">↓ ${net.rx_sec} KB/s</div>
                    </div>
                    <div>
                        <div class="label">Upload</div>
                        <div style="font-size: 1.2rem; font-weight: 600;">↑ ${net.tx_sec} KB/s</div>
                    </div>
                </div>
            `;
            els.networkContainer.appendChild(div);
        }
    });
}

function updateChart(chart, newValue) {
    if (!chart) return;
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(newValue);
    chart.update();
}

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // Icon-based nav
    const tabs = ['overview', 'cpu', 'memory', 'storage', 'network'];
    const idx = tabs.indexOf(tabId);
    if(idx !== -1) document.querySelectorAll('.nav-links li')[idx].classList.add('active');
}
