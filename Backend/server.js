const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

function loadData() {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData);
}

app.get('/api/events', (req, res) => {
    try {
        const data = loadData();
        res.json(data.events);
    } catch (error) {
        console.error('Error loading events:', error);
        res.status(500).json({ error: 'Failed to load events' });
    }
});

app.get('/api/news', (req, res) => {
    try {
        const data = loadData();
        res.json(data.news);
    } catch (error) {
        console.error('Error loading news:', error);
        res.status(500).json({ error: 'Failed to load news' });
    }
});

app.get('/api/papers', (req, res) => {
    try {
        const data = loadData();
        res.json(data.papers);
    } catch (error) {
        console.error('Error loading papers:', error);
        res.status(500).json({ error: 'Failed to load papers' });
    }
});

app.get('/api/council', (req, res) => {
    try {
        const data = loadData();
        res.json(data.council);
    } catch (error) {
        console.error('Error loading council:', error);
        res.status(500).json({ error: 'Failed to load council data' });
    }
});

app.get('/api/hiring', (req, res) => {
    try {
        const data = loadData();
        res.json(data.hiring); // Note: Using "Hiring" as per your data.json
    } catch (error) {
        console.error('Error loading hiring:', error);
        res.status(500).json({ error: 'Failed to load hiring data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});