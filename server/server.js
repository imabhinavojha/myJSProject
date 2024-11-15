const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.model('Url', urlSchema);

// Create a short URL
app.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            console.error('Original URL not provided');
            return res.status(400).json({ error: 'Original URL required' });
        }

        const shortUrl = shortid.generate();
        const newUrl = new Url({ originalUrl, shortUrl });

        await newUrl.save();
        console.log(`Shortened URL created: ${shortUrl}`);
        res.json({ originalUrl, shortUrl });
    } catch (error) {
        console.error('Error in /shorten endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;

        const urlData = await Url.findOne({ shortUrl });

        if (!urlData) {
            console.error(`No URL found for short URL: ${shortUrl}`);
            return res.status(404).json({ error: 'URL not found' });
        }

        console.log(`Redirecting to original URL: ${urlData.originalUrl}`);
        res.redirect(urlData.originalUrl);
    } catch (error) {
        console.error('Error in redirect endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
