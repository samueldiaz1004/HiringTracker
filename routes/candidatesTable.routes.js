
const controller = require("../controllers/candidatesTable.controller.js")

module.exports = app => {
    
    app.get("/status/current/:page/:limit", controller.showAllStatusCurrent);
    
    app.get("/status/current/:page/:limit/:order", controller.showAllStatusCurrent);
    
    app.post("/candidate/add", controller.addCandidate);

    app.post("/candidate/modify", controller.updateCandidate);

    app.post("/candidate/delete", controller.deleteCandidate);

    app.post('/candidate/all-info', controller.sendAllInfo);

    app.post('/complete/status', controller.completeStatus);

    app.get('/notifications', controller.getNotifications);

    app.get('/status/current/:page/:limit/:filter/:search', controller.getCurrentStatusFilter)

    
}
