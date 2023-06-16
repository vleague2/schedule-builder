import { ModelStatic, ValidationError } from "sequelize/types";
import { ScheduleModelInstance } from "../models/scheduleModel";
import { TReturnDto } from "../types";

export async function getSchedules(
  scheduleModel: ModelStatic<ScheduleModelInstance>
): Promise<TReturnDto<ScheduleModelInstance[]>> {
  const res: TReturnDto<ScheduleModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const scheduleRes = await scheduleModel.findAll();

    res.data = scheduleRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getSchedule(
  scheduleModel: ModelStatic<ScheduleModelInstance>,
  scheduleId: string
): Promise<TReturnDto<ScheduleModelInstance[]>> {
  if (!scheduleId) {
    return { data: [], error: ["No schedule provided"] };
  }

  const parsedScheduleId = parseInt(scheduleId);

  if (Number.isNaN(parsedScheduleId)) {
    return {
      data: [],
      error: ["Must provide a number as the schedule ID"],
    };
  }

  const res: TReturnDto<ScheduleModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const scheduleRes = await scheduleModel.findOne({
      where: {
        id: parsedScheduleId,
      },
    });

    if (scheduleRes) {
      res.data.push(scheduleRes);
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function addSchedule(
  scheduleModel: ModelStatic<ScheduleModelInstance>,
  scheduleName: string
): Promise<ScheduleModelInstance> {
  if (!scheduleName) {
    throw "No schedule provided";
  }

  try {
    const scheduleRes = await scheduleModel.create({
      name: scheduleName,
    });

    if (scheduleRes) {
      return scheduleRes;
    }
  } catch (error) {
    throw error;
  }
}

export async function addSchedules(
  scheduleModel: ModelStatic<ScheduleModelInstance>,
  schedules: string[]
): Promise<TReturnDto<ScheduleModelInstance[]>> {
  if (schedules.length < 1) {
    return { data: [], error: ["No schedules provided"] };
  }

  const res: TReturnDto<ScheduleModelInstance[]> = {
    data: [],
    error: [],
  };

  await Promise.all(
    schedules.map(async (scheduleName) => {
      try {
        const scheduleRes = await addSchedule(scheduleModel, scheduleName);
        if (scheduleRes) {
          res.data.push(scheduleRes);
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

export async function updateSchedule(
  scheduleModel: ModelStatic<ScheduleModelInstance>,
  scheduleId: string,
  options: {
    newScheduleName: string;
  }
): Promise<TReturnDto<number>> {
  const { newScheduleName } = options;

  if (!scheduleId || !newScheduleName) {
    return {
      data: 0,
      error: ["Must provide the schedule ID and the new name"],
    };
  }

  const parsedScheduleId = parseInt(scheduleId);

  if (Number.isNaN(parsedScheduleId)) {
    return {
      data: 0,
      error: ["Must provide a number as the schedule ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const scheduleRes = await scheduleModel.update(
      {
        name: newScheduleName,
      },
      {
        where: {
          id: parsedScheduleId,
        },
      }
    );

    res.data = scheduleRes[0];
  } catch (error) {
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteSchedule(
  scheduleModel: ModelStatic<ScheduleModelInstance>,
  scheduleId: string
): Promise<TReturnDto<number>> {
  if (!scheduleId) {
    return { data: 0, error: ["Must provide schedule ID"] };
  }

  const parsedScheduleId = parseInt(scheduleId);

  if (Number.isNaN(parsedScheduleId)) {
    return {
      data: 0,
      error: ["Must provide a number as the schedule ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const scheduleRes = await scheduleModel.destroy({
      where: {
        id: parsedScheduleId,
      },
    });

    res.data = scheduleRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}
