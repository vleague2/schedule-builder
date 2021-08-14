import { Sequelize, Model, DataTypes } from "sequelize";

export interface TeacherModelInstance extends Model {
  id: number;
  name: string;
}

export function TeacherModel(sequelize: Sequelize) {
  const Teacher = sequelize.define<TeacherModelInstance>(
    "Teacher",
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
      tableName: "Teachers",
    }
  );

  return Teacher;
}
