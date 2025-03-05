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

// Paths to JSON files
const DATA_FILE = path.join(__dirname, 'data.json');
const REVIEW_FILE = path.join(__dirname, 'reviews.json');

// Function to read JSON file safely
function readJSONFile(filePath, defaultValue) {
    try {
        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
            return defaultValue;
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return defaultValue;
    }
}

// Initialize data
let data = readJSONFile(DATA_FILE, { users: {} });
let reviews = readJSONFile(REVIEW_FILE, []);

// Function to save JSON data safely
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function saveReviews() {
    fs.writeFileSync(REVIEW_FILE, JSON.stringify(reviews, null, 2));
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

    if (data.users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    data.users[email] = { name, email, password };
    saveData();

    res.json({ message: 'Signup successful', user: data.users[email] });
});

// Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!data.users[email] || data.users[email].password !== password) {
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

// Review API
app.post('/api/review', (req, res) => {
    const { firstName, lastName, phone, email, review } = req.body;

    if (!firstName || !lastName || !phone || !email || !review) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newReview = {
        id: reviews.length + 1,
        firstName,
        lastName,
        phone,
        email,
        review,
        date: new Date().toISOString(),
    };

    reviews.push(newReview);
    saveReviews();

    res.json({ message: 'Review submitted successfully', review: newReview });
});

// Fetch all reviews API
app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

// Delete a Review API
app.delete('/api/review/:id', (req, res) => {
    const reviewId = parseInt(req.params.id, 10);

    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    if (reviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found' });
    }

    // Remove the review from the array
    reviews.splice(reviewIndex, 1);
    saveReviews();

    res.json({ message: 'Review deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});