const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const PROJECT_DIR = path.resolve(__dirname);
const DATA_FILE = path.join(PROJECT_DIR, 'data', 'dreams.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(PROJECT_DIR, 'public')));

// Load dreams from file
function loadDreams() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { dreams: [] };
    }
}

// Save dreams to file
function saveDreams(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Keep-alive endpoint (prevents Render free tier from sleeping)
app.get('/api/ping', (req, res) => {
    res.json({ status: 'alive', timestamp: Date.now() });
});

// API: Get all dreams
app.get('/api/dreams', (req, res) => {
    const data = loadDreams();
    res.json(data.dreams);
});

// API: Submit a new dream
app.post('/api/dreams', (req, res) => {
    const { name, dream } = req.body;

    // Validation
    if (!name || !dream) {
        return res.status(400).json({ error: 'Name and dream are required' });
    }

    if (name.length > 50) {
        return res.status(400).json({ error: 'Name must be 50 characters or less' });
    }

    if (dream.length > 150) {
        return res.status(400).json({ error: 'Dream must be 150 characters or less' });
    }

    const data = loadDreams();

    const newDream = {
        id: Date.now().toString(),
        name: name.trim(),
        dream: dream.trim(),
        timestamp: new Date().toISOString(),
        // Random position for the star
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.8
    };

    data.dreams.push(newDream);
    saveDreams(data);

    // Broadcast to all connected displays
    const message = JSON.stringify({
        type: 'new_dream',
        dream: newDream
    });

    wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(message);
        }
    });

    res.json({ success: true, dream: newDream });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Display connected');

    // Send all existing dreams on connection
    const data = loadDreams();
    ws.send(JSON.stringify({
        type: 'init',
        dreams: data.dreams
    }));

    ws.on('close', () => {
        console.log('Display disconnected');
    });
});

// Get local IP addresses for QR code
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }

    return ips;
}

server.listen(PORT, () => {
    console.log('\n✨ TEDx Ad Astra Constellation Server ✨\n');
    console.log(`Server running on port ${PORT}`);
    console.log('\n📺 Display URL (for projector):');
    console.log(`   http://localhost:${PORT}/display.html`);
    console.log('\n📱 Submission URLs (for QR code):');

    const ips = getLocalIPs();
    if (ips.length > 0) {
        ips.forEach(ip => {
            console.log(`   http://${ip}:${PORT}/submit.html`);
        });
    } else {
        console.log(`   http://localhost:${PORT}/submit.html`);
    }

    console.log('\n💡 Tip: Use the IP address URLs for mobile devices on the same network\n');
});
