import { DataTypes, Model, Sequelize } from "sequelize";

export interface DanceModelInstance extends Model {
  id: number;
  name: string;
  TeacherId: number;
}

export function DanceModel(sequelize: Sequelize) {
  const Dance = sequelize.define<DanceModelInstance>(
    "Dance",
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
      tableName: "Dances",
    }
  );

  return Dance;
}
