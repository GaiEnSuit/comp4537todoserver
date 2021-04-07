require("dotenv").config();
const http = require("http");
const https = require("https");
const app = require("./modules/app.js");
const redirectApp = require("./modules/redirectapp.js");
const credentials = require("./modules/ssl");
const dbconnection = require("./modules/database.js");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportConfig = require("./modules/passportConfig.js");

/**
 * Server Configuration
 */
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;

/**
 * Middleware Configuration
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

/**
 * Server Initialization
 */
if (process.env.NODE_ENV == "production") {
    try {
        const httpServer = http.createServer(redirectApp);
        const httpsServer = https.createServer(credentials, app);
        httpServer.listen(httpPort);
        httpsServer.listen(httpsPort);
    } catch (error) {
        console.log(error.message);
        dbconnection.end();
    }
} else {
    try {
        const httpServer = http.createServer(app);
        httpServer.listen(httpPort);
    } catch (error) {
        console.log(error.message);
        dbconnection.end();
    }
}
