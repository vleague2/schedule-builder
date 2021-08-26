import { ModelCtor, ValidationError } from "sequelize/types";
import { ScheduledDanceModelInstance } from "../models/scheduledDanceModel";
import { TReturnDto } from "../types";

export async function getScheduledDances(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>
): Promise<TReturnDto<ScheduledDanceModelInstance[]>> {
  const res: TReturnDto<ScheduledDanceModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const scheduledDanceResponse = await scheduledDanceModel.findAll();

    res.data = scheduledDanceResponse;
  } catch (error) {
    error.push(error);
  }

  return res;
}

export async function addScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  danceData: {
    startAt: string;
    endAt: string;
    danceId: string;
    studioId: string;
  }
): Promise<TReturnDto<ScheduledDanceModelInstance[]>> {
  const { startAt, endAt, danceId, studioId } = danceData;

  if (!startAt || !endAt || !danceId || !studioId) {
    return {
      data: [],
      error: ["You need a start time, end time, dance id, and studio id"],
    };
  }

  const parsedDanceId = parseInt(danceId);

  if (parsedDanceId === NaN) {
    return { data: [], error: ["Dance ID must be a number"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return { data: [], error: ["Studio ID must be a number"] };
  }

  const res: TReturnDto<ScheduledDanceModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const scheduleRes = await scheduledDanceModel.create({
      startAt,
      endAt,
      StudioId: studioId,
      DanceId: danceId,
    });

    if (scheduleRes) {
      res.data.push(scheduleRes);
    }
  } catch (error) {
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  scheduledDanceId: string
): Promise<TReturnDto<number>> {
  if (!scheduledDanceId) {
    return { data: 0, error: ["Must provide the id of the scheduled dance"] };
  }

  const parsedScheduledDanceId = parseInt(scheduledDanceId);

  if (parsedScheduledDanceId === NaN) {
    return { data: 0, error: ["ID must be a number"] };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const deleteRes = await scheduledDanceModel.destroy({
      where: { id: scheduledDanceId },
    });

    res.data = deleteRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function updateScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  scheduledDanceId: string,
  options: {
    startAt?: string;
    endAt?: string;
    studioId?: string;
  }
): Promise<TReturnDto<number>> {
  if (!scheduledDanceId) {
    return { data: 0, error: ["Must provide the id of the scheduled dance"] };
  }

  const parsedScheduledDanceId = parseInt(scheduledDanceId);

  if (parsedScheduledDanceId === NaN) {
    return { data: 0, error: ["ID must be a number"] };
  }

  const { startAt, endAt, studioId } = options;

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  const values: { [key: string]: any } = {};

  if (startAt) {
    values.startAt = new Date(startAt);
  }

  if (endAt) {
    values.endAt = new Date(endAt);
  }

  if (studioId) {
    values.StudioId = studioId;
  }

  try {
    const updateRes = await scheduledDanceModel.update(values, {
      where: { id: scheduledDanceId },
    });

    res.data = updateRes[0];
  } catch (error) {
    res.error.push(error);
  }

  return res;
}
