module.exports = (sequelize, Sequelize) => {
    const Candidate = sequelize.define("candidate", {
        req: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING(3),
            allowNull: false
        },
        PI: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        OL3: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Pcenter: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roleName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        site: {
            type: Sequelize.STRING,
            allowNull: false
        },
        partner: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Mgr: {
            type: Sequelize.STRING,
            allowNull: false
        },
        wcmBd: {
            type: Sequelize.STRING
        },
        ID: {
            type: Sequelize.INTEGER
        },
        fwd: {
            type: Sequelize.DATEONLY
        },
        tentative: {
            type: Sequelize.DATEONLY
        },
        inv: {
            type: Sequelize.STRING(1),
            allowNull: false
        }
    });

    return Candidate;
};
