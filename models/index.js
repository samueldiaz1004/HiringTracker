const config = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool : {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.query(`SET GLOBAL time_zone = '-05:00'`)
db.user = require('./user.model.js')(sequelize, Sequelize);
db.candidate = require('./candidate.model.js')(sequelize, Sequelize);
db.stage = require('./stage.model.js')(sequelize, Sequelize);
db.status = require('./status.model.js')(sequelize, Sequelize);
db.holidays = require('./dates.model.js')(sequelize, Sequelize)

db.stage.hasMany(db.status, {foreignKey: 'stageId'});
db.status.belongsTo(db.stage, {foreignKey: 'stageId'});

db.candidate.hasMany(db.status, {foreignKey: 'candidateReq'});
db.status.belongsTo(db.candidate);

db.USERS = ['Consultant', 'General User', 'Admin'];

module.exports = db;
