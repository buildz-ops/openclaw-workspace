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
    cpuTempLabel: document.getElementById('cpu-temp-label'),
    cpuCores: document.getElementById('cpu-cores'),
    cpuSpeed: document.getElementById('cpu-speed'),
    diskContainer: document.getElementById('disk-container'),
    networkContainer: document.getElementById('network-container'),
    memProgressBar: document.getElementById('mem-progress'),
    // Overview
    storageMainPercent: document.getElementById('storage-main-percent'),
    storageMainBar: document.getElementById('storage-main-bar'),
    netDownMini: document.getElementById('net-down-mini'),
    netUpMini: document.getElementById('net-up-mini'),
    netPrimaryIpMini: document.getElementById('net-primary-ip-mini'),
    // Network Main
    netPing: document.getElementById('net-ping'),
    netPrimaryIp: document.getElementById('net-primary-ip'),
    netPrimaryIface: document.getElementById('net-primary-iface'),
    netPrimaryType: document.getElementById('net-primary-type'),
    netPrimaryMac: document.getElementById('net-primary-mac'),
    netPrimaryState: document.getElementById('net-primary-state'),
    netPrimaryRx: document.getElementById('net-primary-rx'),
    netPrimaryTx: document.getElementById('net-primary-tx')
};

// Charts Configuration
Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.font.family = 'Inter';

let cpuMiniChart, memMiniChart, cpuMainChart, memHistoryChart, netPingChart;

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
            scales: { x: { display: false }, y: { min: 0, max: 100, display: false } },
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
            scales: { x: { display: false }, y: { min: 0, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' } } },
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
            scales: { x: { display: false }, y: { min: 0, grid: { color: 'rgba(255, 255, 255, 0.05)' } } },
            animation: false
        }
    });

    // 5. Network Ping (Detailed)
    if (document.getElementById('net-ping-chart')) {
        netPingChart = new Chart(document.getElementById('net-ping-chart'), {
            type: 'line',
            data: {
                labels: Array(30).fill(''),
                datasets: [{
                    label: 'Ping (ms)',
                    data: Array(30).fill(0),
                    borderColor: '#ff9500',
                    backgroundColor: 'rgba(255, 149, 0, 0.1)',
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
                scales: { x: { display: false }, y: { min: 0, grid: { color: 'rgba(255, 255, 255, 0.05)' } } },
                animation: false
            }
        });
    }
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
    const pNet = data.primaryNet || {};
    els.netDownMini.innerText = `↓ ${pNet.rx_sec || 0} KB/s`;
    els.netUpMini.innerText = `↑ ${pNet.tx_sec || 0} KB/s`;
    els.netPrimaryIpMini.innerText = pNet.ip4 || 'No Connection';
    
    // 2. CPU
    // If temp is available, show it. If not, show Thermal Pressure.
    if (data.cpu.temp && data.cpu.temp !== "N/A") {
        els.cpuTemp.innerText = `${data.cpu.temp}°C`;
        els.cpuTempLabel.innerText = "Core Package";
    } else {
        // Fallback to thermal pressure
        els.cpuTemp.innerText = data.cpu.thermal || "Unknown";
        els.cpuTempLabel.innerText = "Thermal Pressure (Root Req for Temp)";
        // Color code thermal pressure
        if (data.cpu.thermal === 'Normal') els.cpuTemp.style.color = '#34c759';
        else if (data.cpu.thermal === 'Fair') els.cpuTemp.style.color = '#ff9500';
        else if (data.cpu.thermal === 'Serious') els.cpuTemp.style.color = '#ff3b30';
    }

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
    if(netPingChart) updateChart(netPingChart, data.ping || 0);
    
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

    // 6. Network (Main Tab)
    els.netPing.innerText = `${data.ping || 0} ms`;
    els.netPrimaryIp.innerText = pNet.ip4 || 'N/A';
    els.netPrimaryIface.innerText = pNet.iface || 'N/A';
    els.netPrimaryType.innerText = pNet.type || 'Unknown';
    els.netPrimaryMac.innerText = pNet.mac || 'N/A';
    els.netPrimaryState.innerText = pNet.operstate || 'unknown';
    
    els.netPrimaryRx.innerText = `↓ ${pNet.rx_sec || 0} KB/s`;
    els.netPrimaryTx.innerText = `↑ ${pNet.tx_sec || 0} KB/s`;

    // Other interfaces list
    els.networkContainer.innerHTML = '';
    data.network.forEach(net => {
        // Skip primary if already shown above? No, maybe show all but primary highlighted?
        // Actually, let's just show others here.
        if (net.iface !== pNet.iface && (net.ip4 || net.rx_sec > 0)) {
            const div = document.createElement('div');
            div.className = 'glass-card';
            div.innerHTML = `
                <h3>${net.iface} <span style="font-size:0.7em; opacity:0.6">${net.type}</span></h3>
                <div class="stat-row"><span class="label">IP</span><span class="value">${net.ip4 || 'N/A'}</span></div>
                <div class="stat-row"><span class="label">State</span><span class="value">${net.operstate}</span></div>
                <div class="stat-row"><span class="label">↓</span><span class="value">${net.rx_sec} KB/s</span></div>
                <div class="stat-row"><span class="label">↑</span><span class="value">${net.tx_sec} KB/s</span></div>
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
