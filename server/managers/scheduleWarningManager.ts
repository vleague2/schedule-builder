import { ModelStatic, ValidationError } from "sequelize/types";
import { ScheduleWarningModelInstance } from "../models/scheduleWarningModel";
import { TReturnDto } from "../types";
import { DanceWithConflictModelInstance } from "../models/danceWithConflictModel";

export type TScheduleWarningWithDances = {
  scheduleWarning: ScheduleWarningModelInstance;
  dancesWithConflict: DanceWithConflictModelInstance["DanceId"][];
};

export async function getWarningsForSchedule(
  scheduleWarningModel: ModelStatic<ScheduleWarningModelInstance>,
  danceWithConflictModel: ModelStatic<DanceWithConflictModelInstance>,
  scheduleId: string
): Promise<TReturnDto<TScheduleWarningWithDances[]>> {
  if (!scheduleId) {
    return { data: [], error: ["Must provide schedule ID"] };
  }

  const parsedScheduleId = parseInt(scheduleId);

  if (Number.isNaN(parsedScheduleId)) {
    return {
      data: [],
      error: ["Must provide a number as the schedule ID"],
    };
  }

  const res: TReturnDto<TScheduleWarningWithDances[]> = {
    data: [],
    error: [],
  };

  try {
    const scheduleWarningRes = await scheduleWarningModel.findAll({
      where: { ScheduleId: scheduleId },
    });

    const promiseResult: TScheduleWarningWithDances[] = await Promise.all(
      scheduleWarningRes.map(async (scheduleWarning) => {
        const danceWithConflictRes = await danceWithConflictModel.findAll({
          where: { ScheduleWarningId: scheduleWarning.id },
        });

        return {
          scheduleWarning,
          dancesWithConflict: danceWithConflictRes.map(
            (danceWithConflict) => danceWithConflict.DanceId
          ),
        };
      })
    );

    res.data = promiseResult;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function addScheduleWarning(
  scheduleWarningModel: ModelStatic<ScheduleWarningModelInstance>,
  danceWithConflictModel: ModelStatic<DanceWithConflictModelInstance>,
  {
    scheduleId,
    conflictObjectId,
    warningType,
    errorMessage,
    conflictDanceIds,
  }: {
    conflictObjectId: string | number;
    warningType: string;
    errorMessage: string;
    scheduleId: string | number;
    conflictDanceIds: string[] | number[];
  }
): Promise<TScheduleWarningWithDances> {
  if (
    !conflictObjectId ||
    !warningType ||
    !errorMessage ||
    !scheduleId ||
    conflictDanceIds.length < 1
  ) {
    throw "You must send a conflictObjectId, warningType, errorMessage, conflict dances, and scheduleId";
  }

  if (typeof conflictObjectId === "string") {
    const parsedId = parseInt(conflictObjectId);

    if (Number.isNaN(parsedId)) {
      throw "The conflict object ID must be a number";
    }
  }

  if (typeof scheduleId === "string") {
    const parsedId = parseInt(scheduleId);

    if (Number.isNaN(parsedId)) {
      throw "The schedule ID must be a number";
    }
  }

  conflictDanceIds.forEach((dance: string | number) => {
    if (typeof dance === "string") {
      const parsedId = parseInt(dance);

      if (Number.isNaN(parsedId)) {
        throw "The IDs of the conflict dances must be a number";
      }
    }
  });

  const scheduleWarningRes = await scheduleWarningModel.create({
    ScheduleId: scheduleId,
    conflictObjectId,
    warningType,
    errorMessage,
  });

  const errors = [];

  const danceWithConflictIds = await Promise.all(
    conflictDanceIds.map(async (danceId) => {
      try {
        const danceWithConflictRes = await danceWithConflictModel.create({
          DanceId: danceId,
          ScheduleWarningId: scheduleWarningRes.id,
        });

        return danceWithConflictRes.DanceId;
      } catch (error) {
        const errorMessage = (error as ValidationError).errors[0].message;
        const errorValue = (error as ValidationError).errors[0].value;
        errors.push(`${errorMessage}: ${errorValue}`);
      }
    })
  );

  if (errors.length > 0) {
    throw errors;
  }

  return {
    scheduleWarning: scheduleWarningRes,
    dancesWithConflict: danceWithConflictIds,
  };
}

export async function addScheduleWarnings(
  scheduleWarningModel: ModelStatic<ScheduleWarningModelInstance>,
  danceWithConflictModel: ModelStatic<DanceWithConflictModelInstance>,
  scheduleWarnings: {
    conflictObjectId: string | number;
    warningType: string;
    errorMessage: string;
    scheduleId: string | number;
    conflictDanceIds: string[] | number[];
  }[]
): Promise<TReturnDto<TScheduleWarningWithDances[]>> {
  if (scheduleWarnings.length < 0) {
    return { data: [], error: ["No warnings provided"] };
  }

  const res: TReturnDto<TScheduleWarningWithDances[]> = {
    data: [],
    error: [],
  };

  await Promise.all(
    scheduleWarnings.map(async (scheduleWarning) => {
      try {
        const addScheduleWarningRes = await addScheduleWarning(
          scheduleWarningModel,
          danceWithConflictModel,
          scheduleWarning
        );
        if (addScheduleWarningRes) {
          res.data.push(addScheduleWarningRes);
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

export async function deleteScheduleWarning(
  scheduleWarningModel: ModelStatic<ScheduleWarningModelInstance>,
  scheduleWarningId: string
): Promise<TReturnDto<number>> {
  if (!scheduleWarningId) {
    return { data: 0, error: ["Must provide schedule warning ID"] };
  }

  const parsedScheduleWarningId = parseInt(scheduleWarningId);

  if (Number.isNaN(parsedScheduleWarningId)) {
    return {
      data: 0,
      error: ["Must provide a number as the schedule warning ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const scheduleWarningRes = await scheduleWarningModel.destroy({
      where: {
        id: scheduleWarningId,
      },
    });

    res.data = scheduleWarningRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}
