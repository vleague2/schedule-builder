import { Sequelize, Model, DataTypes } from "sequelize";

export interface ScheduleWarningModelInstance extends Model {
  id: number;
  conflictObjectId: number;
  warningType: string;
  errorMessage: string;
  ScheduleId: number;
}

export function ScheduleWarningModel(sequelize: Sequelize) {
  const ScheduleWarning = sequelize.define<ScheduleWarningModelInstance>(
    "ScheduleWarning",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conflictObjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      warningType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      errorMessage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "ScheduleWarnings",
    }
  );

  return ScheduleWarning;
}