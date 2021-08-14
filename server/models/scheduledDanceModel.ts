import { Sequelize, Model, DataTypes } from "sequelize";

export interface ScheduledDanceModelInstance extends Model {
  startAt: Date;
  endAt: Date;
  DancerId: number;
  DanceId: number;
}

export function ScheduledDanceModel(sequelize: Sequelize) {
  const ScheduledDance = sequelize.define<ScheduledDanceModelInstance>(
    "ScheduledDance",
    {
      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "ScheduledDances",
    }
  );

  return ScheduledDance;
}
