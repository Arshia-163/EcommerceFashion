const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '..')));

// Path to the data.json file inside the backend folder
const DATA_FILE = path.join(__dirname, 'data.json');

let data = {};
if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save data to JSON file
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});


app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Signup API
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (data.users && data.users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    if (!data.users) {
        data.users = {};
    }

    data.users[email] = { name, email, password };
    saveData();

    res.json({ message: 'Signup successful', user: data.users[email] });
});


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!data.users || !data.users[email] || data.users[email].password !== password) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user: data.users[email] });
});

// Logout API
app.post('/api/logout', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    res.json({ message: 'Logout successful' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});