import express from 'express';
import * as https from 'https';
import * as fs from 'fs';

const app = express();

app.get('/', (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: 9977,
        path: '/',
        method: 'GET',
        rejectUnauthorized: false, // accept self-signed SSL/TLS certificates
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            res.send(data);
        });
    });

    request.on('error', (error) => {
        console.error(error);
        res.status(500).send(error.message);
    });

    request.end();
});

const server = https.createServer({
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem'),
}, app);

server.listen(5001, () => {
    console.log('TypeScript microservice is listening on port 5001.');
});