import express from 'express';
import session from 'express-session'
var router = express.Router();

router.get('/myIdentity', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        try {
            const username = req.session.account.username;
            const existingUser = await req.models.Users.findOne({ username })
            if (!existingUser) {
                const newUser = new req.models.Users({
                    username: username,
                    biography: "",
                    accountCreation: new Date(),
                    crimesReported: 0
                })
                
                await newUser.save();
                console.log("New user created")
            }
            res.json({
                status: "loggedin",
                userInfo: {
                    name: req.session.account.name,
                    username: req.session.account.username
                }
            })
        } catch(error) {
            console.log("Error checking or creating user:", error);
            res.status(500).json({
                status: "error",
                error: error.message
            })
        }
    } else {
        res.json({
            status: "loggedout"
        })
    }
})

export default router;