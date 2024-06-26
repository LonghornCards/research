const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');
const AWS = require('aws-sdk');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3002; // Changed port to 3002

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
console.log("OpenAI API Key:", apiKey);

if (!apiKey) {
    throw new Error("The REACT_APP_OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({ apiKey });

app.use(cors());  // Enable CORS
app.use(express.json());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'websiteapp-storage-fdb68492737c0-dev'
});

app.post('/api/upload', async (req, res) => {
    const { filename, fileContent } = req.body;

    const params = {
        Bucket: 'websiteapp-storage-fdb68492737c0-dev',
        Key: filename,
        Body: fileContent,
        ACL: 'private'
    };

    try {
        const data = await s3.upload(params).promise();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/download/:filename', async (req, res) => {
    const { filename } = req.params;

    const params = {
        Bucket: 'websiteapp-storage-fdb68492737c0-dev',
        Key: filename
    };

    try {
        const data = await s3.getObject(params).promise();
        res.send(data.Body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/delete/:filename', async (req, res) => {
    const { filename } = req.params;

    const params = {
        Bucket: 'websiteapp-storage-fdb68492737c0-dev',
        Key: filename
    };

    try {
        await s3.deleteObject(params).promise();
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/openai', async (req, res) => {
    try {
        const { messages } = req.body;
        console.log("Received request with messages:", messages); // Log received messages
        const completion = await openai.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo-16k',
        });
        console.log("OpenAI response:", completion.choices[0].message.content); // Log the response
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error processing request:", error); // Log the error
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
