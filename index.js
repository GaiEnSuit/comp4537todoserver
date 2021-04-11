require("dotenv").config();
const http = require("http");
const https = require("https");
const app = require("express")();
const redirectApp = require("./modules/redirectapp.js");
const credentials = require("./modules/ssl");

/**
 * Server Configuration
 */
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;

app.use(express.static(path.join(__dirname, "web-build")));

app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "/web-build/index.html"));
});

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
    }
} else {
    try {
        const httpServer = http.createServer(app);
        httpServer.listen(httpPort);
    } catch (error) {
        console.log(error.message);
    }
}
