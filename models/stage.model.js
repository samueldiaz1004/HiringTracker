module.exports = (sequelize, Sequelize) => {
    const Stage = sequelize.define("stage", {
        idStage: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        stageName: {
            type: Sequelize.STRING
        },
        minPreviousStage: {
            type: Sequelize.INTEGER
        },
        completionTime: {
            type: Sequelize.INTEGER
        },
        reminderTime: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING(350)
        } 
    });

    return Stage;
};