const controller = require("../controllers/dates.controller.js")

module.exports = app => {
    app.get("/holidays", controller.showAllHolidays);
    
    app.post('/holidays/update', controller.updateHolidays);
}