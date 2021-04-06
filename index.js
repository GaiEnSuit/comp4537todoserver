require("dotenv").config();
const http = require("http");
const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");

/**
 * Server Configuration
 */
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;
const APIEndpoint = "/API/v1";

/**
 * SSL Credentials
 */
const privateKey = fs.readFileSync(process.env.SSL_PRIV_KEY, "utf-8");
const certificate = fs.readFileSync(process.env.SSL_CERT, "utf-8");
const credentials = {
    key: privateKey,
    cert: certificate,
};

/**
 * Database Connection.
 */
const dbconnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
});

try {
    dbconnection.connect();
    console.log("Connection to database successfull");
} catch (error) {
    console.log(error.message);
}

/**
 * Redirects to HTTPS
 */
const redirectApp = express();

redirectApp.get("*", (req, res) => {
    res.redirect("https://" + req.headers.host + req.url);
});

/**
 * API
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handling
app.get("/", (req, res, next) => {
    let filePath = path.join(__dirname, "openapi.json");
    let file = fs.readFileSync(filePath);
    let parsedFile = JSON.parse(file);
    res.send(parsedFile);
    res.end();
});

app.get("/lists", (req, res, next) => {
    dbconnection.query(`SELECT * FROM lists`, (error, result) => {
        if (error) {
            next(error.message);
        } else {
            res.json(JSON.stringify(result));
            res.end();
        }
    });
});

app.post(APIEndpoint + "/lists", (req, res, next) => {
    let name = req.body.name;

    dbconnection.query(
        `INSERT INTO lists (name) VALUES(${name})`,
        (error, result) => {
            if (error) {
                next(error.message);
            } else {
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    );
});

app.put(APIEndpoint + "/lists/:id", (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;

    dbconnection.query(
        `UPDATE lists SET name="${name}" WHERE id=${id}`,
        (error, result) => {
            if (error) {
                next(error.message);
            } else {
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    );
});

app.delete(APIEndpoint + "/lists/:id", (req, res, next) => {
    let id = req.params.id;
    dbconnection.query(`DELETE FROM lists WHERE id=${id}`, (error, result) => {
        if (error) {
            next(error.message);
        } else {
            res.send(JSON.stringify(result));
            res.end();
        }
    });
});

app.get(APIEndpoint + "/tasks/:id", (req, res, next) => {
    let listID = req.params.id;

    dbconnection.query(
        `SELECT * FROM tasks WHERE list_id=${listID}`,
        (error, result) => {
            if (error) {
                next(error.message);
            } else {
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    );
});

app.post(APIEndpoint + "/tasks/:id", (req, res, next) => {
    let listID = req.params.listID;

    dbconnection.query(
        `INSERT INTO tasks (list_id) VALUES(${listID})`,
        (error, result) => {
            if (error) {
                next(error.message);
            } else {
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    );
});

app.put(APIEndpoint + "/tasks/:id", (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description;

    dbconnection.query(
        `UPDATE tasks SET name="${name}", description="${description}" WHERE id=${id}`,
        (error, result) => {
            if (error) {
                next(error.message);
            } else {
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    );
});

app.delete(APIEndpoint + "/tasks/:id", (req, res, next) => {
    let id = req.params.id;

    dbconnection.query(`DELETE FROM tasks WHERE id=${id}`, (error, result) => {
        if (error) {
            next(error.message);
        } else {
            res.send(JSON.stringify(result));
            res.end();
        }
    });
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
