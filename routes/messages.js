const express = require("express")
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser }
    = require("../middleware/auth")
const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next) => {
    try {
        let id = req.params.id;
        let message = await Message.get(id);

        try {
            if (req.user.username === message.to_user.username || req.user.username === message.from_user.username) {
                return res.json({
                    message: {
                        id,
                        body: message.body,
                        sent_at: message.sent_at,
                        read_at: message.read_at,
                        from_user: message.from_user,
                        to_user: message.to_user
                    }
                });
            } else {
                return next({ status: 401, message: "Unauthorized" });
            }
        } catch (err) {
            // errors would happen here if we made a request and req.user is undefined
            return next({ status: 401, message: "Unauthorized" });
        }
    }
    catch (e) {
        return next(e)
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        let from_username = req.user.username;
        let to_username = req.body.to_username;
        let body = req.body.body;
        let message = await Message.create({ from_username, to_username, body });

        return res.json({ message });
    }
    catch (e) {
        return next(e)
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async (req, res, next) => {
    try {
        let { id } = req.params
        let checkAuth = await Message.get(id)

        if (req.user.username === checkAuth.to_user.username) {
            if (checkAuth.read_at === null) {
                let message = await Message.markRead(id)

                return res.json({
                    message: {
                        id: message.id,
                        read_at: message.read_at
                    }
                })
            } else {
                return next({ status: 400, message: "Message has already been read" });
            }


        } else {
            return next({ status: 401, message: "Unauthorized 2" });
        }
    }
    catch (e) {
        return next(e)
    }
})

module.exports = router;

	// "username": "colts18seth",
	// "password": "123",
	// "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvbHRzMThzZXRoIiwiaWF0IjoxNTkzOTgwMjcxfQ.gWLMv1TmOloN3beNFUfDiZ2h9tm1Gl6f5FX6Yu0bunE"