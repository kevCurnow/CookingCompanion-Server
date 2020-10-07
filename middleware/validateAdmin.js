const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const { Op } = require("sequelize");

const validateAdmin = (req, res, next) => {
    const sessionToken = req.headers.authorization;
    if(!sessionToken) {
        return res.status(403).send({auth: false, message: "No token provided."})
    } else {
        jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
            if(!err && decoded) {
                User.findOne({where: {
                    [Op.and]: [
                        {id: decoded.id},
                        {isAdmin: true}
                    ]}
                })
                .then(user => {
                    if (!user) {
                        return res.status(401).json({message: "Unauthorized. You are not an admin"})
                    };
                    req.user = {id: user.id};
                    return next();
                })
                .catch(err => next(err))
            } else {
                req.errors = err;
                return res.status(401).json({message: "Unauthorized. Admin only."})
            };
        });
    };
}

module.exports = validateAdmin;