const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.model('Url', urlSchema);

// Create a short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) return res.status(400).json({ error: 'Original URL required' });

    const shortUrl = shortid.generate();
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.json({ originalUrl, shortUrl });
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) return res.status(404).json({ error: 'URL not found' });

    res.redirect(urlData.originalUrl);
});

app.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});
