const fs = require("fs");

/**
 * SSL Credentials
 */
const privateKey = fs.readFileSync(process.env.SSL_PRIV_KEY, "utf-8");
const certificate = fs.readFileSync(process.env.SSL_CERT, "utf-8");
const credentials = {
    key: privateKey,
    cert: certificate,
};

module.exports = credentials;
