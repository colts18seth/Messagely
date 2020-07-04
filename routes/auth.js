const express = require("express")
const auth = require("../middleware/auth");
const User = require("../models/user");
const authRoutes = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
authRoutes.post("/login", async (req, res, next) => {
    try {
        console.log("login")
    }
    catch (e) {
        next(e)
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
authRoutes.post("/register", async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        const result = await new User(username, password, first_name, last_name, phone)
        const
        return res.json(result)
    }
    catch (e) {
        next(e)
    }
})

module.exports = authRoutes;