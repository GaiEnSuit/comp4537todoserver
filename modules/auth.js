const jwt = require("jsonwebtoken");

module.exports = class {
    static generateAccessToken(username, password) {

        if (
            username == process.env.CLIENT_USERNAME &&
            password == process.env.CLIENT_PASSWORD
        ) {
            return jwt.sign("username", process.env.TOKEN_SECRET);
        } else throw new Error();
    }

    /**
     * Authenticates a token.
     */
    static authenticateToken(req, res, next) {
        const token = req.body.token;
        if (token == null) res.sendStatus(401);
        try {
            jwt.verify(token, process.env.TOKEN_SECRET);
            next();
        } catch (error) {
            res.sendStatus(403);
        }
    }
};
