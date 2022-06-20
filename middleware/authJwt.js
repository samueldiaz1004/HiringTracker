const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const USERS = db.USERS;
// [userRole, adminRole, moderatorRole] = db.ROLES;

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.body.adminEmail = decoded.email;
        next();
    });
};

const isAdmin = (req, res, next) => {

    User.findByPk(req.body.adminEmail).then(user => {
        if (user.userType === USERS[2]) {
            next();

        } else {
            return res.status(403).send({
                message: "Require Admin Role!"
            });
        }
        
    });
};

const isConsultant = (req, res, next) => {
    let consFound = false;
    User.findByPk(req.userId).then(user => {
        if (user.userType === USERS[2]) {
            next();

        } else {
            return res.status(403).send({
                message: "Require Admin Role!"
            });
        }
    });
};

// const isUser = (req, res, next) => {
//     let userFound = false;
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             roles.forEach(role => {
//                 if (role.name === userRole) {
//                     userFound = true;
//                     next();
//                 }
//             });
//             if (!userFound) {
//                 return res.status(403).send({
//                     message: "Require User Role!"
//                 });
//             }
//         });
//     });
// };

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isConsultant: isConsultant
    // isUser: isUser
};
module.exports = authJwt;