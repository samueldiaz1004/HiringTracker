const controller = require("../controllers/candidateInfo.controller.js");

module.exports = (app) => {
    app.get("/current/deadline/:statusID", controller.getCurrentDeadline)
}