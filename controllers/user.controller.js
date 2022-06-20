const { resource } = require('../models');
const db = require('../models');
const USERS = db.USERS;
const User = db.user;
const Role = db.role;
const Resource = db.resource;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');

const allAccess = (req, res) => {
    res.status(200).send("Public Content");
};

const userAccess = (req, res) => {
    res.status(200).send("User Content");
};

const adminAccess = (req, res) => {
    res.status(200).send({message: "Admin Content"});
};

const consultantAccess = (req, res) => {
    res.status(200).send("Consultant Content");
};

const updateUser = async (req, res) => {
    let userToUpdate;
    let adminCount = await findAdminCount();
    User.findByPk(req.body.email).then(user => {
        userToUpdate = user;
    }).then(response => {
            //Check if corresponding user is found
            if (userToUpdate === null) return res.status(406).send({message: `User with email: ${req.body.email}, not found`})
            //Check if user is the last admin,
            //In that case, is not possible to change its user type
            if (userToUpdate.userType !== req.body.userType && userToUpdate.userType === USERS[2]){      
                if(adminCount === 1) {
                    return res.status(407).send(`Unable to delete last Admin`);
                } else {
                    User.update(
                        {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            userType: req.body.userType,
                            department: req.body.department,
                            password: bcrypt.hashSync(req.body.password, 8)
                        },
                        {
                            where: {
                                email: req.body.email
                            }
                        }
                    ).then(res.status(200).send(`User with email: ${req.body.email}, was updated successfully`));
                    return 
                }
                
            }else {
                User.update(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userType: req.body.userType,
                        department: req.body.department,
                        password: bcrypt.hashSync(req.body.password, 8)
                    },
                    {
                        where: {
                            email: req.body.email
                        }
                    }
                ).then(res.status(200).send(`User with email: ${req.body.email}, was updated successfully`));
            }
        }
    )
}

const deleteUser = async (req, res) => {
    let adminCount = await findAdminCount();
    User.findByPk(req.body.email).then(user => {
        if(user.userType === USERS[2] && adminCount == 1) {
            res.status(408).send({message: "Unable to delete last Admin"})
            return;
        } else {
            User.destroy({
                where: {
                    email: req.body.email
                }
            }).then(promise => res.send({message: `User with email: ${req.body.email} was deleted successfully`}))
        }
    })
}

const getAllUsers = async (req, res) => {
    return await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus']
    }).then(users => res.send({usersArray: users}))
}

const setAbsent = async (req, res) => {
    return await User.update({
            onlineStatus: 'Absent'
        },{
            where: {
                email: req.body.email
            }
        }).then(res.send({message: 'User Logged Out'}));
    
}

const getUsersFilter = async (req, res) => {
    if(req.params.search === '') await getAllUsers(req, res);
    if(req.params.filter === 'Email') await searchByEmail(req, res);
    if(req.params.filter === 'Name') await searchByName(req, res);
    if(req.params.filter === 'TypeOfUser') await searchByType(req, res);
    if(req.params.filter === 'Status') await searchByStatus(req, res);
    if(req.params.filter === 'Department') await searchByDepartment(req, res);
}

module.exports = {
    getUsersFilter,
    setAbsent,
    getAllUsers,
    deleteUser,
    updateUser,
    consultantAccess,
    adminAccess
}

const searchByEmail = async (req, res) => {
    await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus'],
            where: {
                email: '%'+req.params.search+"%"
            }
        }).then(users => res.send({usersArray: users}));
}

const searchByName = async (req, res) => {
    await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus'],
            where: {
                [Op.or]: [
                    {firstName: {[Op.like]: '%'+req.params.search+'%'}},
                    {lastName: {[Op.like]: '%'+req.params.search+'%'}}
                ]
            }
        }).then(users => res.send({usersArray: users}));
}

const searchByType = async (req, res) => {
    await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus'],
            where: {
                userType: '%'+req.params.search+"%"
            }
        }).then(users => res.send({usersArray: users}));
}

const searchByDepartment= async (req, res) => {
    await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus'],
            where: {
                department: '%'+req.params.search+"%"
            }
        }).then(users => res.send({usersArray: users}));
}

const searchByStatus = async (req, res) => {
    await User.findAll({
        attributes: ['email',
                    'password', 
                    'firstName', 
                    'lastName', 
                    'userType', 
                    'department', 
                    'onlineStatus'],
            where: {
                onlineStatus: '%'+req.params.search+"%"
            }
        }).then(users => res.send({usersArray: users}));
}

const findAdminCount = async () => {
    let adminCount = await User.findAndCountAll({
        where: {
            userType: USERS[2]
        }
    }).catch(err => res.status(409));

    return adminCount.count
}

