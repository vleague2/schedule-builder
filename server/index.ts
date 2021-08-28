import { Sequelize } from "sequelize";
import * as express from "express";
import * as path from "path";

import { StudioModel } from "./models/studioModel";
import { TeacherModel } from "./models/teacherModel";
import { DancerModel } from "./models/dancerModel";
import { DanceModel } from "./models/danceModel";
import { ScheduledDanceModel } from "./models/scheduledDanceModel";

import Api from "./api";
import { danceRouter } from "./routes/danceRoutes";
import { teacherRouter } from "./routes/teacherRoutes";
import { dancerRouter } from "./routes/dancerRoutes";
import { studioRouter } from "./routes/studioRoutes";
import { scheduledDanceRouter } from "./routes/scheduledDanceRoutes";
import { ScheduleModel } from "./models/scheduleModel";
import { scheduleRouter } from "./routes/scheduleRoutes";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = process.env.PORT || 3001;

async function start() {
  const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    ssl: true,
  });

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

  await sequelize.sync({ alter: true });

  const api = new Api(sequelize);

  app.use(express.json());
  app.use("/dances", danceRouter(api));
  app.use("/teachers", teacherRouter(api));
  app.use("/dancers", dancerRouter(api));
  app.use("/studios", studioRouter(api));
  app.use("/scheduledDances", scheduledDanceRouter(api));
  app.use("/schedules", scheduleRouter(api));

  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

start();
