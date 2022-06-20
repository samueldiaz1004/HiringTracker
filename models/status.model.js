module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
        statusID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userCompletion: {
            type: Sequelize.STRING
        },
        dateStart: {
            type: Sequelize.STRING
        },
        dateCompletion: {
            type: Sequelize.STRING
        },
        deadline: {
            type: Sequelize.STRING
        },
        completionStatus: {
            type: Sequelize.STRING
        },
        comment: {
            type: Sequelize.STRING(350)
        }  
    });

    return Status;
};