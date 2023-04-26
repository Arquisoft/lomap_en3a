var fs = require('fs');
var https = require('https');
const express = require('express');
const path = require('path');

//Load certificates
var privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/lomapen3a.qatarcentral.cloudapp.azure.com/privkey.pem');
var certificate = fs.readFileSync(
    '/etc/letsencrypt/live/lomapen3a.qatarcentral.cloudapp.azure.com/fullchain.pem');
// var privateKey = fs.readFileSync(
//     'src/certificates/alice.key');
// var certificate = fs.readFileSync(
//     'src/certificates/alice.crt');
var credentials = {key: privateKey, cert: certificate};

var app = express();

//This will make sure that we will serve everything through https
app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.hostname + req.url);
});

app.use(express.static('./build'));

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);