const fs = require('fs');
const https = require('https');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');

//Load certificates
const privateKey = fs.readFileSync('claves/privkey.pem');
const certificate = fs.readFileSync('claves/fullchain.pem');
const credentials = {key: privateKey, cert: certificate};

const app = express();

//This will make sure that we will serve everything through https
app.all('*', function(req, res, next){
    if (req.secure) {
        return next();
    }
    res.redirect('https://'+req.hostname + req.url);
});

//Base path of our application. We serve first the brotli version (compression).
app.use('/', expressStaticGzip('build', {
    enableBrotli: true,
    orderPreference: ['br']
}));

//For react routes to work, fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);