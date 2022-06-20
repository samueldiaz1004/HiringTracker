module.exports = {
    HOST: "localhost",
    USER: "Admin",
    PASSWORD: "2Admin-Password2",
    DB: "hiringtracker",
    dialect: "mysql",
    pool : {
        max: 5, //number of active connections
        min: 0, //number of active connections
        acquire: 30000, //time to connect before sending an error
        idle: 10000 //time a db can de idle before closing the connection
    }
};