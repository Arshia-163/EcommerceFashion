const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const DATA_FILE = path.join(__dirname, 'data.json');
const REVIEW_FILE = path.join(__dirname, 'reviews.json');
const CART_FILE = path.join(__dirname, 'cart.json');
const CHAT_FILE = path.join(__dirname, 'chats.json');


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


let data = readJSONFile(DATA_FILE, { users: {} });
let reviews = readJSONFile(REVIEW_FILE, []);
let cart = readJSONFile(CART_FILE, []);
let chats = readJSONFile(CHAT_FILE, []);

// Function to save JSON data safely
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function saveReviews() {
    fs.writeFileSync(REVIEW_FILE, JSON.stringify(reviews, null, 2));
}

function saveCart() {
    fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
}
function saveChats() {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(chats, null, 2));
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

    reviews.splice(reviewIndex, 1);
    saveReviews();

    res.json({ message: 'Review deleted successfully' });
});

app.post('/api/cart', (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }
    saveCart();
    res.json({ message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.delete('/api/cart/:name', (req, res) => {
    const itemName = req.params.name;
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }
    cart.splice(itemIndex, 1);
    saveCart();
    res.json({ message: 'Item removed from cart', cart });
});



const WISH_FILE = path.join(__dirname, 'wish.json');
let wishlist = readJSONFile(WISH_FILE, []);

function saveWishlist() {
    fs.writeFileSync(WISH_FILE, JSON.stringify(wishlist, null, 2));
}

// Add item to wishlist
app.post('/api/wishlist', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const existingItem = wishlist.find(item => item.name === name);
    if (existingItem) {
        return res.status(400).json({ error: 'Item already in wishlist' });
    }
    wishlist.push({ name, price, quantity: 1 });
    saveWishlist();
    res.json({ message: 'Item added to wishlist', wishlist });
});


app.get('/api/wishlist', (req, res) => {
    res.json(wishlist);
});


app.delete('/api/wishlist/:name', (req, res) => {
    const itemName = req.params.name;
    const itemIndex = wishlist.findIndex(item => item.name === itemName);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in wishlist' });
    }
    wishlist.splice(itemIndex, 1);
    saveWishlist();
    res.json({ message: 'Item removed from wishlist', wishlist });
});

// Chatbot API
app.post('/api/chat', async (req, res) => {
    const { message, userId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.SITE_URL || "http://localhost:5000",
                "X-Title": process.env.SITE_NAME || "Express Chat App",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            })
        });

        const rawResponse = await response.text();
        console.log('Raw API Response:', rawResponse);

        const data = JSON.parse(rawResponse);
        console.log('Parsed API Response:', data);

        if (!data.choices || !data.choices[0]) {
            console.error('Invalid API response:', data);
            return res.status(500).json({ error: 'Chatbot is currently unavailable. Please try again later.' });
        }

        const botResponse = data.choices[0].message.content;

        const chatRecord = {
            id: chats.length + 1,
            userId: userId || 'anonymous',
            userMessage: message,
            botResponse: botResponse,
            timestamp: new Date().toISOString()
        };

        chats.push(chatRecord);
        saveChats();

        res.json({
            message: 'Chat processed successfully',
            response: botResponse,
            chatId: chatRecord.id
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            error: 'Failed to process chat message',
            details: error.message
        });
    }
});

// Get chat history for a user
app.get('/api/chat/history/:userId', (req, res) => {
    const userId = req.params.userId;
    const userChats = chats.filter(chat => chat.userId === userId);
    res.json(userChats);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


