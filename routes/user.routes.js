const {authJwt} = require('../middleware');
const {verifySignup} = require('../middleware');
const controller = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/authJwt');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    // app.get("/api/test/all", controller.allAccess);

    // app.get("/api/test/user", 
    //     [
    //         authJwt.verifyToken,
    //         authJwt.isUser
    //     ], controller.userAccess);

    app.get("/api/test/admin",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.adminAccess);

    app.get("/api/test/moderator", 
        [
            authJwt.verifyToken,
            authJwt.isConsultant
        ],
        controller.consultantAccess);
        

    app.post('/user/update', controller.updateUser);

    app.post('/user/delete', controller.deleteUser);

    app.get('/user/get-all', controller.getAllUsers);

    app.post('/user/logout', controller.setAbsent);
    
    app.get('/user/get/:filter/:search', controller.getUsersFilter)

};