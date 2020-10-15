const router = require("express").Router();
const User = require("../db").import("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middleware/validateAdmin");
const validateSession = require("../middleware/validateSession");

//User Signup
router.post("/signup", (req, res) => {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin
    })
    .then((user) => {
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    
    res.json({
        user: user,
        message: "User Created!",
        sessionToken: token
    });
    })
    .catch((err) => res.status(500).json({ error: err}));
});

//User Login
router.post("/login", (req, res) => {
    User.findOne({ where: {userName: req.body.userName} }).then(
        (user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                        res.status(200).json({
                            user: user,
                            message: "Successfully logged in!",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "Bad Gateway"});
                    }
                });
            } else {
                res.status(500).send({ error: "User does not exist"});
            }
        },
        (err) => res.status(501).send({ error: "Failed to Process"})
    );
});

//Allow admin to get all users
router.get("/admin", validateAdmin, (req, res) => {
    const query = {order: [["id", "ASC"]]};

    User.findAll(query)
        .then((users) => {
            if (users.length > 0) {
                res.status(200).json({message: "successfully retrieved users.", users: users});
            } else {
                res.status(200).json({message: "No users were found"})
            };
        })
        .catch(err => {
            res.status(500).json({message: "No users were found.", error: err});
        });
});

//Allow admin to update a user's role
router.put("/:id", validateAdmin, (req, res) => {
    User.update(
        req.body, {where: {
            id: req.params.id
        }}
    )
    .then((user) => res.status(200).json({message: "User role was updated!"}))
    .catch(err => res.status(500).json({error: err}))
})

//Allow admin to delete a user
router.delete("/:id", validateAdmin, (req, res) => {
    const query = {where: {
        id: req.params.id
    }};

    User.destroy(query)
    .then((user) => res.status(200).json({message: `A user was deleted successfully.`}))
    .catch(err => {
        res.status(500).json({message: `User was unable to be deleted.`, error: err});
    });
});



module.exports = router;