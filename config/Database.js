import { Sequelize } from "sequelize";

const db = new Sequelize('p3m-app', 'root', '', {
    host: "localhost",
    dialect: "mysql",
})

export default db