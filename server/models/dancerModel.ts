import { DataTypes, Model, Sequelize } from "sequelize";

export interface DancerModelInstance extends Model {
  id: number;
  name: string;
}

export function DancerModel(sequelize: Sequelize) {
  const Dancer = sequelize.define<DancerModelInstance>(
    "Dancer",
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
      tableName: "Dancers",
    }
  );

  return Dancer;
}
