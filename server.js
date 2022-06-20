const express = require('express');
const cors = require('cors');
const { Sequelize } = require("sequelize");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

//parse requests of content-type application/json
app.use(express.json());

//parse requests of content-type application/x-www-form-urlenconded
app.use(express.urlencoded({extended: true}));

//Sync the DB
const db = require('./models');

const Stage = db.stage;
const Status = db.status;
const User = db.user;
const Candidate = db.candidate;
const Holidays = db.holidays;
const USERTYPES = db.USERS;
const Op = db.sequelize.Op;
const bcrypt = require('bcryptjs');
const { sequelize, holidays } = require('./models');

db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//     console.log("Drop and Resync DB");
//     initial();
//     // testing();
// });

app.use(express.static("client"));

app.get("/", (req, res) => {
    res.json({message: "Welcome to Amdocs Hiring Tracker Application"});
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/candidatesTable.routes')(app);
require('./routes/dates.routes')(app);
require('./routes/candidateInfo.routes')(app);

const port = 8080;
app.listen(port, () => {
    console.log("Server is running on port 8080");
});

function testing() {

    db.sequelize.query(`SELECT (DATE_FORMAT(CURRENT_TIMESTAMP(), '%Y-%m-%d %T')) AS CurDate`).then(
      ([results, metadata ]) => {
        //Owen
      Status.create({
        candidateReq: 301948,
        statuses_ibfk_3: 301948,
        stageId: 1,
        userCompletion: 'Owen Jáuregui',
        dateCompletion:  "2021-04-27 07:10:23",
        dateStart: results[0]['CurDate'],
        deadline: "2021-04-27 07:10:23",
        completionStatus: 'Completed',
        comment: null  
      });
      Status.create({
        candidateReq: 301948,
        statuses_ibfk_3: 301948,
        stageId: 2,
        userCompletion: 'Owen Jáuregui',
        dateStart: results[0]['CurDate'],
        dateCompletion:  "2021-04-27 07:10:23",
        deadline: "2021-04-27 07:10:23",
        completionStatus: 'Completed',
        comment: null  
      });
      Status.create({
        candidateReq: 301948,
        statuses_ibfk_3: 301948,
        stageId: 3,
        userCompletion: null,
        dateStart: results[0]['CurDate'],
        dateCompletion:  null,
        deadline: "2021-04-29 16:10:23",
        completionStatus: 'On Time',
        comment: null  
      });

      //José
      Status.create({
        candidateReq: 123456,
        statuses_ibfk_3: 123456,
        stageId: 1,
        userCompletion: null,
        dateStart: results[0]['CurDate'],
        dateCompletion:  null,
        deadline: "2021-04-28 16:11:00",
        completionStatus: 'Delayed',
        comment: null  
      });

      Holidays.create({
        date: "2021-05-05",
        name: 'Batalla de Puebla'
      });
    });
}

function initial() {
    Stage.create({
      idStage: 1,
      stageName: "Offer Requested",
      minPrevoiusStage: 0,
      completionTime: 4,
      reminderTime: 4,
      description: null
    });
  
    Stage.create({
      idStage: 2,
      stageName: "Offer created",
      minPrevoiusStage: 1,
      completionTime: 4,
      reminderTime: null,
      description: null
    });
    
    Stage.create({
      idStage: 3,
      stageName: "Offer sent to TAP",
      minPrevoiusStage: 2,
      completionTime: 0,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 4,
      stageName: "Offer sent to candidate",
      minPrevoiusStage: 3,
      completionTime: 8,
      reminderTime: 4,
      description: null
    });

    Stage.create({
      idStage: 5,
      stageName: "Offer sent back",
      minPrevoiusStage: 4,
      completionTime: 24,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 6,
      stageName: "Final Test Start",
      minPrevoiusStage: 5,
      completionTime: 8,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 7,
      stageName: "Final Test Follow Up",
      minPrevoiusStage: 6,
      completionTime: 56,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 8,
      stageName: "Final Test Send to TAP",
      minPrevoiusStage: 7,
      completionTime: 4,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 9,
      stageName: "Request EA",
      minPrevoiusStage: 8,
      completionTime: 8,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 10,
      stageName: "Create EA",
      minPrevoiusStage: 9,
      completionTime: 16,
      reminderTime: 16,
      description: null
    });

    Stage.create({
      idStage: 11,
      stageName: "Send EA",
      minPrevoiusStage: 10,
      completionTime: 8,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 12,
      stageName: "Send OnB",
      minPrevoiusStage: 11,
      completionTime: 4,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 13,
      stageName: "Signature FU",
      minPrevoiusStage: 11,
      completionTime: 16,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 14,
      stageName: "OnB FU",
      minPrevoiusStage: 11,
      completionTime: 16,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 15,
      stageName: "Review Documents",
      minPrevoiusStage: 14,
      completionTime: 8,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 16,
      stageName: "Doc FU",
      minPrevoiusStage: 15,
      completionTime: 8,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 17,
      stageName: "Load File",
      minPrevoiusStage: 16,
      completionTime: 0,
      reminderTime: null,
      description: null
    });

    Stage.create({
      idStage: 18,
      stageName: "Hire",
      minPrevoiusStage: 17,
      completionTime: 8,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 19,
      stageName: "Assets",
      minPrevoiusStage: 18,
      completionTime: 8,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 20,
      stageName: "Assets FU",
      minPrevoiusStage: 19,
      completionTime: 24,
      reminderTime: 8,
      description: null
    });

    Stage.create({
      idStage: 21,
      stageName: "Confirm Joining",
      minPrevoiusStage: 20,
      completionTime: 0,
      reminderTime: null,
      description: null
    });

    User.create({
      email: "admin@mail.com",
      password: bcrypt.hashSync("password", 8),
      firstName: "Test",
      lastName: "User",
      userType: USERTYPES[2],
      department: "Talent Acquisition",
      onlineStatus: null
    });

    User.create({
      email: "newadmin@mail.com",
      password: bcrypt.hashSync("password", 8),
      firstName: "Test",
      lastName: "User 2",
      userType: USERTYPES[2],
      department: "Talent Acquisition",
      onlineStatus: null
    });
}
