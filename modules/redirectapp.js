const express = require("express");

/**
 * Redirects to HTTPS
 */
const redirectApp = express();

redirectApp.get("*", (req, res) => {
    res.redirect("https://" + req.headers.host + req.url);
});

module.exports = redirectApp;
