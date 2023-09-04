import { Sequelize } from "sequelize";
import * as express from "express";
import * as path from "path";
import * as OktaJwtVerifier from "@okta/jwt-verifier";

import { StudioModel } from "./models/studioModel";
import { TeacherModel } from "./models/teacherModel";
import { DancerModel } from "./models/dancerModel";
import { DanceModel } from "./models/danceModel";
import { ScheduledDanceModel } from "./models/scheduledDanceModel";
import { ScheduleModel } from "./models/scheduleModel";

import Api from "./api";
import { danceRouter } from "./routes/danceRoutes";
import { teacherRouter } from "./routes/teacherRoutes";
import { dancerRouter } from "./routes/dancerRoutes";
import { studioRouter } from "./routes/studioRoutes";
import { scheduledDanceRouter } from "./routes/scheduledDanceRoutes";
import { scheduleRouter } from "./routes/scheduleRoutes";
import { authenticationRequired } from "./routes/authentication";
import { ScheduleWarningModel } from "./models/scheduleWarningModel";
import { DanceWithConflictModel } from "./models/danceWithConflictModel";
import { scheduleWarningRouter } from "./routes/scheduleWarningRoutes";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = process.env.PORT || 3001;

async function start() {
  let sequelizeOptions = {};

  if (process.env.NODE_ENV === "production") {
    sequelizeOptions = {
      dialect: "postgres",
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    };
  }

  const sequelize = new Sequelize(
    process.env.DATABASE_URL as string,
    sequelizeOptions
  );

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const studio = StudioModel(sequelize);
  const teacher = TeacherModel(sequelize);
  const dancer = DancerModel(sequelize);
  const dance = DanceModel(sequelize);
  const scheduledDance = ScheduledDanceModel(sequelize);
  const schedule = ScheduleModel(sequelize);
  const scheduleWarning = ScheduleWarningModel(sequelize);
  const danceWithConflict = DanceWithConflictModel(sequelize);

  teacher.hasMany(dance);
  dance.belongsTo(teacher);

  dancer.belongsToMany(dance, { through: "DancerDances" });
  dance.belongsToMany(dancer, { through: "DancerDances" });

  scheduledDance.belongsTo(studio);
  studio.hasMany(scheduledDance);

  scheduledDance.belongsTo(dance);
  dance.hasMany(scheduledDance);

  scheduledDance.belongsTo(schedule);
  schedule.hasMany(scheduledDance);

  scheduleWarning.belongsTo(schedule);
  schedule.hasMany(scheduleWarning);

  danceWithConflict.belongsTo(scheduleWarning);
  scheduleWarning.hasMany(danceWithConflict);

  danceWithConflict.belongsTo(dance);
  dance.hasMany(danceWithConflict);

  await sequelize.sync({ alter: true });

  const api = new Api(sequelize);

  app.use(express.json());

  const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  });

  const authenticationCheck = authenticationRequired(oktaJwtVerifier);

  app.use("/dances", danceRouter(api, authenticationCheck));
  app.use("/teachers", teacherRouter(api, authenticationCheck));
  app.use("/dancers", dancerRouter(api, authenticationCheck));
  app.use("/studios", studioRouter(api, authenticationCheck));
  app.use("/scheduledDances", scheduledDanceRouter(api, authenticationCheck));
  app.use("/schedules", scheduleRouter(api, authenticationCheck));
  app.use("/scheduleWarnings", scheduleWarningRouter(api, authenticationCheck));

  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

start();
