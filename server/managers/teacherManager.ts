import { ModelCtor } from "sequelize/types";
import { TeacherModelInstance } from "../models/teacherModel";
import { TReturnDto } from "../types";

export async function getTeachers(
  teacherModel: ModelCtor<TeacherModelInstance>
): Promise<TReturnDto<TeacherModelInstance[]>> {
  const res: TReturnDto<TeacherModelInstance[]> = {
    data: undefined,
    error: undefined,
  };

  try {
    const teacherRes = await teacherModel.findAll();

    if (teacherRes) {
      res.data = teacherRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function getTeacher(
  teacherModel: ModelCtor<TeacherModelInstance>,
  teacherId: string
): Promise<TReturnDto<TeacherModelInstance>> {
  if (!teacherId) {
    return { error: ["No teacher provided"] };
  }

  const parsedId = parseInt(teacherId);

  if (parsedId === NaN) {
    return { error: ["ID must be a number"] };
  }

  const res: TReturnDto<TeacherModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const teacherRes = await teacherModel.findOne({
      where: {
        id: teacherId,
      },
    });

    if (teacherRes) {
      res.data = teacherRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function addTeachers(
  teacherModel: ModelCtor<TeacherModelInstance>,
  teachers: string[]
): Promise<TReturnDto<TeacherModelInstance[]>> {
  if (teachers.length < 1) {
    return { error: ["No teachers provided"] };
  }

  const res: TReturnDto<TeacherModelInstance[]> = {
    data: undefined,
    error: [],
  };

  const promiseResult = await Promise.all(
    teachers.map(async (teacherName) => {
      try {
        const teacherRes = await addTeacher(teacherModel, teacherName);
        return teacherRes?.data;
      } catch (error) {
        res.error.push(error);
      }
    })
  );

  res.data = promiseResult;

  return res;
}

export async function addTeacher(
  teacherModel: ModelCtor<TeacherModelInstance>,
  teacherName: string
): Promise<TReturnDto<TeacherModelInstance>> {
  if (!teacherName) {
    return { error: ["No teacher provided"] };
  }

  const res: TReturnDto<TeacherModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const teacherRes = await teacherModel.create({
      name: teacherName,
    });

    if (teacherRes) {
      res.data = teacherRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function updateTeacher(
  teacherModel: ModelCtor<TeacherModelInstance>,
  teacherId: string,
  options: {
    newTeacherName: string;
  }
): Promise<TReturnDto<number>> {
  const { newTeacherName } = options;

  if (!teacherId || !newTeacherName) {
    return { error: ["Must provide the teacher ID and the new name"] };
  }

  const parsedTeacherId = parseInt(teacherId);

  if (parsedTeacherId === NaN) {
    return {
      error: ["Must provide a number as the teacher ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
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
    res.error = error;
  }

  return res;
}

export async function deleteTeacher(
  teacherModel: ModelCtor<TeacherModelInstance>,
  teacherId: string
): Promise<TReturnDto<number>> {
  if (!teacherId) {
    return { error: ["Must provide teacher ID"] };
  }

  const parsedTeacherId = parseInt(teacherId);

  if (parsedTeacherId === NaN) {
    return {
      error: ["Must provide a number as the teacher ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const teacherRes = await this.teacherModel.destroy({
      where: {
        id: teacherId,
      },
    });

    res.data = teacherRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}
