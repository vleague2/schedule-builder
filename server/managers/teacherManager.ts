import { ModelStatic, ValidationError } from "sequelize/types";
import { TeacherModelInstance } from "../models/teacherModel";
import { TReturnDto } from "../types";

export async function getTeachers(
  teacherModel: ModelStatic<TeacherModelInstance>
): Promise<TReturnDto<TeacherModelInstance[]>> {
  const res: TReturnDto<TeacherModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const teacherRes = await teacherModel.findAll();

    if (teacherRes) {
      res.data = teacherRes;
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getTeacher(
  teacherModel: ModelStatic<TeacherModelInstance>,
  teacherId: string
): Promise<TReturnDto<TeacherModelInstance[]>> {
  if (!teacherId) {
    return { data: [], error: ["No teacher provided"] };
  }

  const parsedId = parseInt(teacherId);

  if (Number.isNaN(parsedId)) {
    return { data: [], error: ["ID must be a number"] };
  }

  const res: TReturnDto<TeacherModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const teacherRes = await teacherModel.findOne({
      where: {
        id: teacherId,
      },
    });

    if (teacherRes) {
      res.data.push(teacherRes);
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function addTeachers(
  teacherModel: ModelStatic<TeacherModelInstance>,
  teachers: string[]
): Promise<TReturnDto<TeacherModelInstance[]>> {
  if (teachers.length < 1) {
    return { data: [], error: ["No teachers provided"] };
  }

  const res: TReturnDto<TeacherModelInstance[]> = {
    data: [],
    error: [],
  };

  await Promise.all(
    teachers.map(async (teacherName) => {
      try {
        const teacherRes = await addTeacher(teacherModel, teacherName);
        if (teacherRes) {
          res.data.push(teacherRes);
        }
      } catch (error) {
        const errorMessage = (error as ValidationError).errors[0].message;
        const errorValue = (error as ValidationError).errors[0].value;
        res.error.push(`${errorMessage}: ${errorValue}`);
      }
    })
  );

  return res;
}

export async function addTeacher(
  teacherModel: ModelStatic<TeacherModelInstance>,
  teacherName: string
): Promise<TeacherModelInstance> {
  if (!teacherName) {
    throw "No teacher provided";
  }

  try {
    const teacherRes = await teacherModel.create({
      name: teacherName,
    });

    if (teacherRes) {
      return teacherRes;
    }
  } catch (error) {
    throw error;
  }
}

export async function updateTeacher(
  teacherModel: ModelStatic<TeacherModelInstance>,
  teacherId: string,
  options: {
    newTeacherName: string;
  }
): Promise<TReturnDto<number>> {
  const { newTeacherName } = options;

  if (!teacherId || !newTeacherName) {
    return { data: 0, error: ["Must provide the teacher ID and the new name"] };
  }

  const parsedTeacherId = parseInt(teacherId);

  if (Number.isNaN(parsedTeacherId)) {
    return {
      data: 0,
      error: ["Must provide a number as the teacher ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const teacherRes = await teacherModel.update(
      {
        name: newTeacherName,
      },
      {
        where: {
          id: teacherId,
        },
      }
    );

    res.data = teacherRes[0];
  } catch (error) {
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteTeacher(
  teacherModel: ModelStatic<TeacherModelInstance>,
  teacherId: string
): Promise<TReturnDto<number>> {
  if (!teacherId) {
    return { data: 0, error: ["Must provide teacher ID"] };
  }

  const parsedTeacherId = parseInt(teacherId);

  if (Number.isNaN(parsedTeacherId)) {
    return {
      data: 0,
      error: ["Must provide a number as the teacher ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const teacherRes = await teacherModel.destroy({
      where: {
        id: teacherId,
      },
    });

    res.data = teacherRes;
  } catch (error) {
    console.log(error);
    res.error.push(error);
  }

  return res;
}
