const fs = require('fs');

const data = JSON.parse(fs.readFileSync('sessions_7days.json', 'utf8'));
const sessions = Array.isArray(data) ? data : (data.result || data.sessions || []);
const now = Date.now();
const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

let totalInput = 0;
let totalOutput = 0;
const processedSids = new Set();

sessions.forEach(s => {
    if (s.updatedAt >= sevenDaysAgo && s.sessionId && !processedSids.has(s.sessionId)) {
        totalInput += (s.inputTokens || 0);
        totalOutput += (s.outputTokens || 0);
        processedSids.add(s.sessionId);
    }
});

console.log(`Total Input Tokens: ${totalInput}`);
console.log(`Total Output Tokens: ${totalOutput}`);
console.log(`Total Tokens: ${totalInput + totalOutput}`);
