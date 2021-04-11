/**
 * Application Logic
 */
const express = require("express");
const path = require("path");
const fs = require("fs");
const dbconnection = require("./database.js");
const app = express();
const APIEndpoint = "/API/v1";
const auth = require("./auth.js");
const cors = require("cors");

/**
 * Middleware Configuration
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(APIEndpoint + "/auth", (req, res, next) => {
    try {
        const token = auth.generateAccessToken(
            req.body.username,
            req.body.password
        );
        res.json(token);
    } catch (error) {
        res.sendStatus(401);
    }
});

app.get(APIEndpoint + "/docs", (req, res, next) => {
    let filePath = path.join(__dirname, "../openapi.json");
    let file = fs.readFileSync(filePath);
    let parsedFile = JSON.parse(file);
    res.send(parsedFile);
    res.end();
});

app.post(APIEndpoint + "/lists", auth.authenticateToken, (req, res, next) => {
    dbconnection.query(`SELECT * FROM lists`, (error, result) => {
        if (error) {
            next(error.message);
        } else {
            res.json(JSON.stringify(result));
            res.end();
        }
    });
});

app.post(APIEndpoint + "/list", auth.authenticateToken, (req, res, next) => {
    let name = req.body.name;

    dbconnection.query(
        `INSERT INTO lists (name) VALUES("${name}")`,
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

app.put(APIEndpoint + "/list/:id", auth.authenticateToken, (req, res, next) => {
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

app.delete(
    APIEndpoint + "/list/:id",
    auth.authenticateToken,
    (req, res, next) => {
        let id = req.params.id;
        dbconnection.query(
            `DELETE FROM lists WHERE id=${id}`,
            (error, result) => {
                if (error) {
                    next(error.message);
                } else {
                    res.send(JSON.stringify(result));
                    res.end();
                }
            }
        );
    }
);

app.post(
    APIEndpoint + "/tasks/:list_id",
    auth.authenticateToken,
    (req, res, next) => {
        let listID = req.params.list_id;

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
    }
);

app.post(
    APIEndpoint + "/task/:list_id",
    auth.authenticateToken,
    (req, res, next) => {
        let listID = req.params.list_id;
        console.log(listID);

        dbconnection.query(
            `INSERT INTO tasks(list_id) VALUES(${listID})`,
            (error, result) => {
                if (error) {
                    next(error.message);
                } else {
                    res.send(JSON.stringify(result));
                    res.end();
                }
            }
        );
    }
);

app.put(APIEndpoint + "/task/:id", auth.authenticateToken, (req, res, next) => {
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

app.delete(
    APIEndpoint + "/task/:id",
    auth.authenticateToken,
    (req, res, next) => {
        let id = req.params.id;

        dbconnection.query(
            `DELETE FROM tasks WHERE id=${id}`,
            (error, result) => {
                if (error) {
                    next(error.message);
                } else {
                    res.send(JSON.stringify(result));
                    res.end();
                }
            }
        );
    }
);

module.exports = app;
