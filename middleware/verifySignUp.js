const db = require('../models');

const User = db.user;

const checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            return res.status(400).send({
                message: "Failed: Email is already in use."
            });
        }
        next();
    });
};

// const checkRolesExisted = (req, res, next) => {
//     if (req.body.roles) {
//         for (let i = 0; i < req.body.roles.length; i++) {
//             if (!ROLES.includes(req.body.roles[i])) {
//                 return res.status(400).send({
//                     message: `Failed: Is not a valid role (${req.body.roles[i]})`
//                 });
//             }
//         }
//     }
//     next();
// };

const verifySignup = {
    checkDuplicateEmail: checkDuplicateEmail,
    // checkRolesExisted: checkRolesExisted
};

module.exports = verifySignup;