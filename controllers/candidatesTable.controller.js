const {Sequelize} = require('sequelize');
const {Op} = require('sequelize');
const db = require("../models");
const Candidate = db.candidate;
const Status = db.status;
const Stage = db.stage;
const Holidays = db.holidays;
const {timeZone} = require("../config/timeZone.config");
const candidateModel = require('../models/candidate.model');
const { candidate } = require('../models');

const checkCloseToDelayed = async () => {
        [curCloseToDeadline, notImportant] = await adjustTime(0);
        curCloseToDeadline.toString();
        console.log(curCloseToDeadline);
    let statusDeadline;
    Status.findAll({
        where: {
            completionStatus: {
                [Op.or]: ['On Time', 'Close To Deadline']
            } 
        }
    }).then(statuses => {
        statuses.forEach(status => {
            statusDeadline = status.deadline;
            if(statusDeadline.substring(0,4) === curCloseToDeadline.substring(0, 4)){ //Check Year
                if(statusDeadline.substring(5,7) === curCloseToDeadline.substring(5, 7)){ //Check Month
                    if(statusDeadline.substring(8, 10) === curCloseToDeadline.substring(8, 10)){ //Check Day
                        if(parseInt(statusDeadline.substring(11,13)) < parseInt(curCloseToDeadline.substring(11,13))){ //Check if deadline - 2 hours is smaller than current time
                            Status.update(
                            {
                                completionStatus: 'Delayed'
                            },{
                                where: {
                                    statusID: status.statusID
                                }
                            })
                            
                        } else if(statusDeadline.substring(11,13) == curCloseToDeadline.substring(11,13)) {
                            if(parseInt(statusDeadline.substring(14,16)) < parseInt(curCloseToDeadline.substring(14,16))){
                                Status.update(
                                    {
                                        completionStatus: 'Delayed'
                                    },{
                                        where: {
                                            statusID: status.statusID
                                            }
                                    }
                                )
                            }
                        }   
                    }
                }
            }
        })
    })
}

const checkCurrentToClose = async () => {
    [curCloseToDeadline, notImportant] = await adjustTime(0);
    curCloseToDeadline.toString();
    let statusDeadline;
    Status.findAll({
        where: {
            completionStatus: 'On Time'
        }
    }).then(statuses => {
        statuses.forEach(status => {
            statusDeadline = status.deadline;
            if(statusDeadline.substring(0,4) === curCloseToDeadline.substring(0, 4)){ //Check Year
                if(statusDeadline.substring(5,7) === curCloseToDeadline.substring(5, 7)){ //Check Month
                    if(statusDeadline.substring(8, 10) === curCloseToDeadline.substring(8, 10)){ //Check Day
                        if(parseInt(statusDeadline.substring(11, 13))-2 < parseInt(curCloseToDeadline.substring(11, 13))){ //Check if deadline - 2 hours is smaller than current time
                            Status.update(
                            {
                                completionStatus: 'Close To Deadline'
                            },{
                                where: {
                                    statusID: status.statusID
                                }
                            })
                        } else if (parseInt(statusDeadline.substring(11, 13))-2 === parseInt(curCloseToDeadline.substring(11, 13))){
                            if(parseInt(statusDeadline.substring(14,16)) < parseInt(curCloseToDeadline.substring(14,16))){
                                Status.update(
                                    {
                                        completionStatus: 'Close To Deadline'
                                    },{
                                        where: {
                                            statusID: status.statusID
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        })
    })
}

const getNotifications = async (req, res) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    Status.findAndCountAll({
        where: {
            completionStatus: {
                [Op.or]: ['Delayed', 'Close To Deadline']
            }
        }
    }).then(notifications => res.send({notificationsNumber: notifications.count}));
}

const getCurrentStatusFilter = async (req, res) => {
    //Deadline (Default)
    
    let value = req.params.search;
    if(req.params.filter === 'Deadline') await filterByDeadline(req, res, value);
    if(req.params.filter === "Started")  await filterByStarted(req, res, value);
    if(req.params.filter === "Req") await filterByReq(req, res, parseInt(value));
    if(req.params.filter === "Name") await filterByName(req, res, value);
    if(req.params.filter === "CurrentStage") await filterByCurrent(req, res, value);
    
}

const filterByDeadline = async (req, res, value) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;
    
    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']},
            deadline: {[Op.like]: '%'+value+'%'}
        },
         include: [
            {
                model: Candidate,
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [['deadline', 'DESC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const filterByStarted = async (req, res, value) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;
    
    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']},
            dateStart: {[Op.like]: '%'+value+'%'}
        },
         include: [
            {
                model: Candidate,
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [['deadline', 'DESC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const filterByReq = async (req, res, value) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;

    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']},
            candidateReq: value
        },
         include: [
            {
                model: Candidate,
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [['deadline', 'DESC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const filterByName = async (req, res, value) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;
    
    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']}
        },
         include: [
            {
                model: Candidate,
                attributes: ['firstName', 'lastName'],
                where: {
                    [Op.or]: [
                        {firstName: {[Op.like]: '%'+value+'%'}},
                        {lastName: {[Op.like]: '%'+value+'%'}}
                    ]
                }
            },
            {
                model: Stage,
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [['deadline', 'DESC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const filterByCurrent = async (req, res, value) => {
    value = await value.replace(/-/g, ' ');
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;

    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']}
        },
         include: [
            {
                model: Candidate,
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                attributes: ['stageName'],
                where: {
                    stageName: '%'+value+'%'
                }
            }],
            limit: limit,
            offset: pageOffset,
            order: [['deadline', 'DESC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

// This functions retrieves all current status
// Returns the amount of registers indicated 
const showAllStatusCurrent = async (req, res) => {
        await checkCurrentToClose();
        await checkCloseToDelayed();
        let limit = 1*req.params.limit;
        let pageOffset= limit*req.params.page;
        let orderBy = 'deadline'

        if(req.params.order){
            if(req.params.order === 'Req') orderBy = 'candidateReq';
            if(req.params.order === 'Started') orderBy = 'dateStart';
            if(req.params.order === 'Deadline') orderBy = 'deadline';
            if(req.params.order === 'CurrentStage') {await orderByStage(req, res); return};
            if(req.params.order === 'Name') {await orderByName(req, res); return};
        }

        await Status.findAll({
            attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
            where: {
                completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']}
            },
                include: [
                {
                    model: Candidate,
                    as: 'candidate',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Stage,
                    as: 'stage',
                    attributes: ['stageName']
                }],
                limit: limit,
                offset: pageOffset,
                order: [[orderBy, 'ASC']]
            }).then(statuses => res.send({candidatesTable: statuses}));
             
}

const orderByStage =  async (req, res) => {

    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;
    let orderStage = 'stageName';

    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']}
        },
            include: [
            {
                model: Candidate,
                as: 'candidate',
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                as: 'stage',
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [[Stage, orderStage, 'ASC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const orderByName = async(req, res) => {
    await checkCurrentToClose();
    await checkCloseToDelayed();
    let limit = 1*req.params.limit;
    let pageOffset= limit*req.params.page;
    let orderName = 'firstName';

    await Status.findAll({
        attributes: ['stageId', 'candidateReq', 'dateStart', 'deadline', 'completionStatus'],
        where: {
            completionStatus: {[Op.or]: ['On Time', 'Close To Deadline', 'Delayed']}
        },
            include: [
            {
                model: Candidate,
                as: 'candidate',
                attributes: ['firstName', 'lastName']
            },
            {
                model: Stage,
                as: 'stage',
                attributes: ['stageName']
            }],
            limit: limit,
            offset: pageOffset,
            order: [[Candidate, orderName, 'ASC']]
        }).then(statuses => res.send({candidatesTable: statuses}));
}

const addCandidate = async (req, res) => {
    Candidate.create({
        req: req.body.req,
        type: req.body.type,
        PI: req.body.PI,
        OL3: req.body.OL3,
        Pcenter: req.body.Pcenter,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        roleName: req.body.roleName,
        site: req.body.site,
        partner: req.body.partner,
        Mgr: req.body.Mgr,
        wcmBd: req.body.wcmBd,
        ID: req.body.ID,
        fwd: req.body.fwd,
        tentative: req.body.tentative,
        inv: req.body.inv
    });
    startStatus(req, res);
}

const adjustTime = async (hoursToAdd) => {
    let [results, metadata] = await db.sequelize.query(`SELECT (DATE_FORMAT(CURRENT_TIMESTAMP(), '%Y-%m-%d %T%w')) AS CurDate`);
    let curDate = results[0]['CurDate'];

    let curHour = parseInt(curDate.substring(11, 13)); //00
    let curDay = parseInt(curDate.substring(8, 10)); //01
    let curMonth = parseInt(curDate.substring(5,7)); //01
    let curYear = parseInt(curDate.substring(0, 4)); //2020
    let dayOfWeek = parseInt(curDate.substring(19));
    let curLastDayOfMonth = getLastDayOfMonth(curMonth, curYear);

    if(curHour - 5 < 0){
        curHour = 24 + (curHour - 5); // 19
        if(curDay - 1 == 0){
            if(curMonth - 1 == 0) {
                curMonth = 12;
                curYear --; //2019
            }else {
                curMonth -= 1;
            }
            curLastDayOfMonth = getLastDayOfMonth(curMonth, curYear) //31
            curDay = curLastDayOfMonth; // 31
        }else{
            curDay -= 1;
        }
        if(dayOfWeek - 1 < 0){
            dayOfWeek = 6;
        } else {
            dayOfWeek --;
        }
    }else {
        curHour -= 5;
    }

    if(curHour.toString().length < 2) curHour = '0' + curHour;
    if(curMonth.toString().length < 2) curMonth = '0' + curMonth;
    if(curDay.toString().length < 2) curDay = '0' + curDay;
    curDate = `${curYear}-${curMonth}-${curDay} ${curHour}${curDate.substring(13,19)}`;

    let deadline;
    deadline = await newDeadline(curDate, dayOfWeek, hoursToAdd);
    return [curDate, await newDeadline(curDate, dayOfWeek, hoursToAdd)];
}

const newDeadline = async (deadline, dayOfWeek, hoursToAdd) => {
    let month = parseInt(deadline.substring(5,7));
    let day = parseInt(deadline.substring(8,10));
    let hours = parseInt(deadline.substring(11,13));
    let year = parseInt(deadline.substring(0,4));
    hoursToAdd = parseInt(hoursToAdd);

    //Add hours depending on its deadline
    if(hoursToAdd === 4){
        if(hours > 13) hoursToAdd += 16;
        
    } else {
        let workDays = Math.floor(hoursToAdd/8);
        hoursToAdd += workDays*16;
        hoursToAdd += Math.floor(workDays/5)*48; //This gives us the amount of weekends
    }

    //Check if deadline would be 
    if(dayOfWeek == 6){
        hoursToAdd += 48;
    }
    else if(dayOfWeek == 0){
        hoursToAdd += 24;
    }
    let newHours = hours + hoursToAdd;
    let remainingHours = (newHours) % 24; 

    if(newHours >= 24){
        let numDays = Math.floor((newHours) / 24);
        
        let lastDay = getLastDayOfMonth(month, year);

        if((day + numDays) > lastDay){
            if(month + 1 > 12){
                year += 1;
                month = 0;
            }
            month++;
            day = day-lastDay;
        }
        day += numDays;
        hours = 0;
        if(dayOfWeek == 6 || dayOfWeek == 0){
            dayOfWeek = 1;
        } else {
            dayOfWeek = (dayOfWeek+numDays)%7;
        }
    }
    hours = remainingHours;

    if(hours.toString().length < 2) hours =  '0' + hours;
    if(month.toString().length < 2) month = '0' + month;
    if(day.toString().length < 2) day = '0' + day;

    deadline = `${year}-${month}-${day} ${hours}${deadline.substring(13)}`;
    
    if(dayOfWeek == 6 || dayOfWeek == 0){
        return newDeadline(deadline, dayOfWeek, 0);
    }
    
    let deadlineDate = deadline.toString().substring(0,10);
    deadline = await Holidays.findOne({
        where: {
            date: deadlineDate
        }
    }).then(holiday => {
        if(holiday){
            deadline = newDeadline(deadline, dayOfWeek, 8);
        }
    }).then(promise => {return deadline});

    return deadline;
}

const getLastDayOfMonth = (month, year) => {
    let lastDayOfMonth;
    switch(month) {
        case 1:
            lastDayOfMonth = 31;
            break;
        case 2:
            if(year % 4 == 0){
                lastDayOfMonth = 29;
            } else {
                lastDayOfMonth = 28;
            }
            break;
        case 3:
            lastDayOfMonth = 31;
            break;
        case 4:
            lastDayOfMonth = 30;
            break;
        case 5:
            lastDayOfMonth = 31;
            break;
        case 6:
            lastDayOfMonth = 30;
            break;
        case 7:
            lastDayOfMonth = 31;
            break;
        case 8:  
            lastDayOfMonth = 31;
            break;
        case 9:
            lastDayOfMonth = 30;
            break;
        case 10:
            lastDayOfMonth = 31;
            break;
        case 11:
            lastDayOfMonth = 30;
            break;
        case 12:
            lastDayOfMonth = 31;
            break;
    }
    return lastDayOfMonth;
}

const addToHours = async (hoursToAdd) => {
    [curDate, deadline] = await adjustTime(hoursToAdd);
    return [curDate, deadline];
}

const startStatus = async (req, res) => {
    addToHours(8).then(([curDate, deadline]) => {
        
        Status.create({
            deadline: deadline,
            dateStart: curDate,
            completionStatus: req.body.completionStatus,
            stageId: req.body.stageId,
            candidateReq: req.body.req
        
        }).then(response => res.status(200).send({message: "Candidate Added"}))
    });
}

const updateCandidate = async (req, res) => {
    Candidate.update(
        {
            type: req.body.type,
            PI: req.body.PI,
            OL3: req.body.OL3,
            Pcenter: req.body.Pcenter,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roleName: req.body.roleName,
            site: req.body.site,
            partner: req.body.partner,
            Mgr: req.body.Mgr,
            wcmBd: req.body.wcmBd,
            ID: req.body.ID,
            fwd: req.body.fwd,
            tentative: req.body.tentative,
            inv: req.body.inv
        },
        {
            where: {
                req: req.body.req
            }
        }
    ).then(res.status(200).send({message: `Candidate ${req.body.req} updated`}))
}

const deleteCandidate = (req, res) => {
    Status.findAll({
        where: {
            candidateReq: req.body.req
        }
    }).then(statuses => statuses.forEach(status => {
        Status.destroy({
            where: {
                statusID: status.statusID
            }
        })
    }))

    Candidate.destroy({
        where: {
            req: req.body.req
        }
    }).then(res.status(200).send({message: `Candidate ${req.body.req} deleted succesfully`}));
}

const sendAllInfo = (req, res) => {
    let candidateFound;
    Candidate.findByPk(req.body.req).then(candidate => {
        candidateFound = candidate;
        Status.findAll({
            where: {
                candidateReq: candidate.req
            },
            order: ['stageId']
        }).then(statuses => {
            res.send({
                candidateInfo: candidateFound,
                allStatuses: statuses
            })
        });
    })
}

const completeStatus = (req, res) => {
    //Completar Etapa
    //Registrar nombre de la persona que completa la etapa
    //Crear nuevo status con la info de la prox etapa, iniciarlizar el día y calcular deadline
    let currentStage;
    let candidate;
    let hoursForDeadline;
    Status.findByPk(req.body.statusId).then(status => {
        currentStage = status.stageId;
        candidate = status.candidateReq;
        if(status.completionStatus === 'Completed') {
            res.send({message: "Status " + currentStage + " is already completed"});
            return;
        } else {
            adjustTime(0).then(([current, deadline]) => current
            ).then(current => {
                Status.update({
                    completionStatus: 'Completed',
                    userCompletion: req.body.userCompletion,
                    dateCompletion: current
                },
                {
                    where: {
                        statusID: status.statusID
                    }
                }).then(response => {
                    if(currentStage < 21){
                        Stage.findByPk(currentStage+1).then(stage => {
                            hoursForDeadline = stage.completionTime;
                        }).then(() => {
                            adjustTime(hoursForDeadline).then(
                                ([curDate, deadlineDate]) => {
                                    Status.create({
                                        stageId: currentStage+1,
                                        candidateReq: candidate,
                                        dateStart: curDate,
                                        deadline: deadlineDate,
                                        completionStatus: "On time"
                                }).then(promise => {
                                    Status.findOne({
                                        attribute: ['statusID', 'deadline', 'dateStart'],
                                        where: {
                                            candidateReq: candidate,
                                            stageId: currentStage+1
                                        }
                                    }).then(newStatus => {
                                        res.status(200).send({
                                            statusId: newStatus.statusID,
                                            dateStart: newStatus.dateStart,
                                            deadline: newStatus.deadline
                                        })
                                    })
                                });
                            })
                        })
                    } else {
                        res.status(200).send({message: 'Process Completed'})
                    }
                })
            });
        }
    })
}

module.exports = {
    showAllStatusCurrent,
    getNotifications,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    sendAllInfo,
    completeStatus,
    getCurrentStatusFilter
};