const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
    const sessionToken = req.headers.authorization;
    console.log('token', sessionToken);
    if(!sessionToken) {
        return res.status(403).send({auth: false, message: "No token provided."})
    } else {
        jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
            if(!err && decoded) {
                User.findOne({where: {id: decoded.id}})
                .then(user => {
                    if(!user) throw "err";
                    req.user = user;
                    next();
                })
                .catch(err => next(err))
            } else {
                req.errors = err
                return res.status(500).send("Not Authorized.")
            }
        })
    }
} 
module.exports = validateSession;