import { Sequelize, Model, DataTypes } from "sequelize";

export interface StudioModelInstance extends Model {
  id: number;
  name: string;
}

export function StudioModel(sequelize: Sequelize) {
  const Studio = sequelize.define(
    "Studio",
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
      tableName: "Studios",
    }
  );

  return Studio;
}
