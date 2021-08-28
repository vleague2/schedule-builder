import { Sequelize, Model, DataTypes } from "sequelize";

export interface ScheduleModelInstance extends Model {
  id: number;
  name: string;
}

export function ScheduleModel(sequelize: Sequelize) {
  const Schedule = sequelize.define(
    "Schedule",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      tableName: "Schedules",
    }
  );

  return Schedule;
}
