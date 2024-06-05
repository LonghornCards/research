const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Changed port to 3001

const clientId = 'Longhorn-Longhorn-SBX-3e544631a-59740c41';
const clientSecret = 'SBX-e544631ae708-dd25-4356-8515-6cca';
const redirectUri = 'http://localhost:3001/callback'; // Updated redirect URI port

app.get('/login', (req, res) => {
    console.log('Received request to /login');
    const authUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=https://api.ebay.com/oauth/api_scope/buy.item.summary`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    console.log('Received request to /callback');
    const authCode = req.query.code;
    console.log(`Authorization code: ${authCode}`);

    try {
        const response = await axios.post('https://api.sandbox.ebay.com/identity/v1/oauth2/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: redirectUri
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            }
        });
        const accessToken = response.data.access_token;
        console.log(`Access Token: ${accessToken}`);
        res.send(`Access Token: ${accessToken}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
