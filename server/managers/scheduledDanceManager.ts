import { ModelCtor } from "sequelize/types";
import { ScheduledDanceModelInstance } from "../models/scheduledDanceModel";
import { TReturnDto } from "../types";

export async function addScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  danceData: {
    startsAt: string;
    endsAt: string;
    danceId: string;
    studioId: string;
  }
): Promise<TReturnDto<ScheduledDanceModelInstance>> {
  const { startsAt, endsAt, danceId, studioId } = danceData;

  if (!startsAt || !endsAt || !danceId || !studioId) {
    return {
      error: ["You need a start time, end time, dance id, and studio id"],
    };
  }

  const parsedDanceId = parseInt(danceId);

  if (parsedDanceId === NaN) {
    return { error: ["Dance ID must be a number"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return { error: ["Studio ID must be a number"] };
  }

  const res: TReturnDto<ScheduledDanceModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const scheduleRes = await scheduledDanceModel.create({
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      StudioId: studioId,
      DanceId: danceId,
    });

    if (scheduleRes) {
      res.data = scheduleRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function deleteScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  scheduledDanceId: string
): Promise<TReturnDto<number>> {
  if (!scheduledDanceId) {
    return { error: ["Must provide the id of the scheduled dance"] };
  }

  const parsedScheduledDanceId = parseInt(scheduledDanceId);

  if (parsedScheduledDanceId === NaN) {
    return { error: ["ID must be a number"] };
  }

  const res = {
    data: undefined,
    error: undefined,
  };

  try {
    const deleteRes = scheduledDanceModel.destroy({
      where: { id: scheduledDanceId },
    });

    res.data = deleteRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function updateScheduledDance(
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>,
  scheduledDanceId: string,
  options: {
    startsAt?: string;
    endsAt?: string;
    studioId?: string;
  }
): Promise<TReturnDto<number>> {
  if (!scheduledDanceId) {
    return { error: ["Must provide the id of the scheduled dance"] };
  }

  const parsedScheduledDanceId = parseInt(scheduledDanceId);

  if (parsedScheduledDanceId === NaN) {
    return { error: ["ID must be a number"] };
  }

  const { startsAt, endsAt, studioId } = options;

  const res = {
    data: undefined,
    error: undefined,
  };

  const values: { [key: string]: any } = {};

  if (startsAt) {
    values.startsAt = new Date(startsAt);
  }

  if (endsAt) {
    values.endsAt = new Date(endsAt);
  }

  if (studioId) {
    values.StudioId = studioId;
  }

  try {
    const updateRes = scheduledDanceModel.update(values, {
      where: { id: scheduledDanceId },
    });

    res.data = updateRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}
