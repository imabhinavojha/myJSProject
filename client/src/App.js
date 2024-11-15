import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/shorten', { originalUrl });
            setShortUrl(`http://localhost:5001/${response.data.shortUrl}`);
        } catch (error) {
            console.error('Error shortening the URL:', error);
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
