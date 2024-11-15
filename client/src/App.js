import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting URL:', originalUrl);
            console.log('API_URL :', API_URL);

            const response = await axios.post(`${API_URL}/shorten`, { originalUrl });
            console.log('Response from server:', response.data);

            setShortUrl(`${API_URL}/${response.data.shortUrl}`);
            setError(null);
        } catch (err) {
            console.error('Error shortening the URL:', err);
            setError('Failed to shorten the URL. Please try again.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter the original URL"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    style={{ width: '300px', padding: '10px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>
                    Shorten
                </button>
            </form>
            {error && (
                <p style={{ color: 'red', marginTop: '20px' }}>
                    {error}
                </p>
            )}
            {shortUrl && (
                <div style={{ marginTop: '20px' }}>
                    <p>Short URL:</p>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;
