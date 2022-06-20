module.exports = (sequelize, Sequelize) => {
    const Dates = sequelize.define("dates", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
        }
    });
    return Dates;
};