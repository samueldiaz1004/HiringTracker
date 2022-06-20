const {verifySignup} = require('../middleware');
const {authJwt} = require('../middleware');
const controller = require('../controllers/auth.controller.js');

module.exports = (app) => {
    // app.use((req, res, next) => {
    //     res.header("Access-Control-Allow-Headers",
    //     "x-access-token, Origin, Content-Type, Accept");
    //     next();
    // });

    app.post("/auth/signup", 
    [
        authJwt.verifyToken,
        authJwt.isAdmin,
        verifySignup.checkDuplicateEmail
    ], controller.signup);

    app.post("/api/auth/signin", controller.signin);

    app.get("/api/auth/isAuthenticated",
        authJwt.verifyToken,
        controller.isAuthenticated);

    app.post("/logout", controller.logout);
};