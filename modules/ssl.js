const fs = require("fs");

const credentials = null;

/**
 * SSL Credentials
 */
if (process.env.NODE_ENV == "production") {
    const privateKey = fs.readFileSync(process.env.SSL_PRIV_KEY, "utf-8");
    const certificate = fs.readFileSync(process.env.SSL_CERT, "utf-8");
    credentials = {
        key: privateKey,
        cert: certificate,
    };
}

module.exports = credentials;
