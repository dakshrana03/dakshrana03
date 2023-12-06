const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("mysql://root:1412@localhost:3306", {
    dialect: "mysql",
});
// const sequelize = new Sequelize("mysql://root:admin@mysql:3306", {
//     dialect: "mysql",
// });

sequelize.query("CREATE DATABASE IF NOT EXISTS chatForumDB;")
    .then(() => {
        const db = require("./models/databaseInitializer");

        // Routers
        const channelsRouter = require("./routes/Channel");
        app.use("/channels", channelsRouter);
        const postRouter = require("./routes/Question");
        app.use("/questions", postRouter);
        const commentsRouter = require("./routes/Reply");
        app.use("/replies", commentsRouter);
        const usersRouter = require("./routes/User");
        app.use("/user-auth", usersRouter);

        db.sequelize.sync().then(() => {
            app.listen(8081, () => {
                console.log("Server running on port 8081");
            });
        });
    })
    .catch((error) => {
        console.error("Error creating database: ", error);
    });
