const db = require("../models");
const Holidays = db.holidays;

const showAllHolidays = (req, res) => {
    Holidays.findAll().then(holidaysArray => {
        res.send({holidays: holidaysArray});
    })
}

const updateHolidays = async (req, res) => {
    let holidaysArray = req.body.holidays;
    let newDate;
    let newHolidayName;
    await holidaysArray.forEach(holiday => {
        // console.log(holiday);
        console.log(holiday);
        newDate = holiday[0];
        newHolidayName = holiday[1];

        Holidays.findOrCreate({
            where: {
                date: newDate
            },
            defaults: {
                date: newDate,
                name: newHolidayName
            }
        }).catch(err => {res.status(408)})
    })
    res.send({message: "Holidays Added"});
}

module.exports = {
    showAllHolidays,
    updateHolidays
}
