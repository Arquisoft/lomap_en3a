var fs = require('fs');
var http = require('http');
var https = require('https');
const express = require('express');
var expressStaticGzip = require('express-static-gzip');
const path = require('path');

//Load certificates
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/lomapen3a.cloudns.ph/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/lomapen3a.cloudns.ph/fullchain.pem');
var credentials = {key: privateKey, cert: certificate};

var app = express();

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

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);