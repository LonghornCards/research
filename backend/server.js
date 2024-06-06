const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Changed port to 3001

const clientId = 'Longhorn-Longhorn-SBX-3e544631a-59740c41';
const clientSecret = 'SBX-e544631ae708-dd25-4356-8515-6cca';
const redirectUri = 'http://localhost:3001/callback'; // Updated redirect URI port

app.get('/', (req, res) => {
    res.send('Welcome to the eBay OAuth Example. Go to /login to start the OAuth flow.');
});

app.get('/login', (req, res) => {
    const authUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.marketplace.insights.readonly https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly https://api.ebay.com/oauth/api_scope/buy.shopping.cart https://api.ebay.com/oauth/api_scope/buy.offer.auction https://api.ebay.com/oauth/api_scope/commerce.identity.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.email.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.phone.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.address.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.name.readonly https://api.ebay.com/oauth/api_scope/commerce.identity.status.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/sell.item.draft https://api.ebay.com/oauth/api_scope/sell.item https://api.ebay.com/oauth/api_scope/sell.reputation https://api.ebay.com/oauth/api_scope/sell.reputation.readonly https://api.ebay.com/oauth/api_scope/commerce.notification.subscription https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly https://api.ebay.com/oauth/api_scope/sell.stores https://api.ebay.com/oauth/api_scope/sell.stores.readonly`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const authCode = req.query.code;

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
        res.send(`Access Token: ${accessToken}`);
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

app.get('/auth-accepted', (req, res) => {
    res.send('Thank you for authorizing our app! You can now access all features.');
});

app.get('/auth-declined', (req, res) => {
    res.send('You have declined to authorize our app. Some features may not be available.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
