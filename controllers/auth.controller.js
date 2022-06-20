const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config.js');

const User = db.user;
const Op = db.Sequelize.Op;

module.exports.isAuthenticated = (req, res) => {
    res.send({message: 'Is Authenticated'});
}

module.exports.signup = (req, res) => {
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: req.body.userType,
        department: req.body.department,
        onlineStatus: null,
        lastLogin: null
    // }).then(user => {
    //     if (req.body.roles) {
    //         Role.findAll({
    //             where: {
    //                 name: {
    //                     [Op.or]: req.body.roles
    //                 }
    //             }
    //         }).then(roles => {
    //             user.setRoles(roles).then(() => {
    //                 res.send({message: "User was registered successfully"});
    //             });
    //         });
    //     }
    }).catch(err => {
        if(!err) {
            res.send({message: err.message});
        }
    });
    res.send({message: "User Added"});
};

module.exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password"
            });
        }

        var token = jwt.sign({email: user.email}, config.secret, {expiresIn: 86400}); //24 horas
       
        User.update({
            onlineStatus: 'Active'},
            {where: {
                email: user.email
            }
        }).then(res.status(200).send({
            fullName: user.firstName + " " + user.lastName,
            userType: user.userType,
            email: user.email,
            accessToken: token
        }));
        
    }).catch(err => {
        res.status(405).send({message: err.message});
    });
};

module.exports.logout = async (req, res) => {
    User.update({
        onlineStatus: 'Absent'},
        {where: { 
            email: req.body.email
        }
    }).then(res.status(200).send({
        message: 'Logout Successful'
    }));
}