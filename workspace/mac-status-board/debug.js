const si = require('systeminformation');
const { exec } = require('child_process');

async function debug() {
    console.log("=== CPU TEMP ===");
    try {
        const temp = await si.cpuTemperature();
        console.log("si.cpuTemperature():", temp);
    } catch (e) { console.error(e); }

    console.log("\n=== OSX-CPU-TEMP CLI ===");
    exec('osx-cpu-temp', (err, stdout, stderr) => {
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
    });

    console.log("\n=== NETWORK ===");
    try {
        const netStats = await si.networkStats();
        const netIfaces = await si.networkInterfaces();
        console.log("Net Stats (first 1):", netStats[0]);
        console.log("Net Ifaces (first 1):", netIfaces[0]);
    } catch (e) { console.error(e); }

    console.log("\n=== PING ===");
    try {
        const ping = await si.inetChecksite('google.com');
        console.log("Ping:", ping);
    } catch (e) { console.error(e); }
}

debug();
