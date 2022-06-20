const db = require("../models");
const {Op} = require('sequelize');
const Candidate = db.candidate;
const Status = db.status;

const getCurrentDeadline = async (req, res) => {
    await Status.findByPk(req.params.statusID,{
        attributes: ['deadline']
    }).then(status => res.send({currentStatus: status}));
}

module.exports = {
    getCurrentDeadline
}