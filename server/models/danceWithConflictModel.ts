import { Sequelize, Model, DataTypes } from "sequelize";

export interface DanceWithConflictModelInstance extends Model {
  id: number;
  DanceId: number;
  ScheduleWarningId: number;
}

export function DanceWithConflictModel(sequelize: Sequelize) {
  const DanceWithConflict = sequelize.define< DanceWithConflictModelInstance>(
    "DanceWithConflict",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      tableName: "DanceWithConflict",
    }
  );

  return DanceWithConflict;
}