import { TApiResponseDto } from "../models/TApiResponseDto";
import { TScheduledDance } from "../models/TScheduledDance";
import {
  deleteScheduledDance,
  getScheduledDances,
  patchScheduledDance,
  postScheduledDance,
} from "../resources/scheduledDancesResource";
import {
  mapToAddScheduledDanceDto,
  mapToUpdateScheduledDanceDto,
} from "./mapToDtoService";

export async function getAllScheduledDances(): Promise<
  TApiResponseDto<TScheduledDance[]>
> {
  return await getScheduledDances();
}

export async function addScheduledDance(
  startAt: Date,
  endAt: Date,
  danceId: number,
  studioId: number
): Promise<TApiResponseDto<TScheduledDance[]>> {
  const mappedDto = mapToAddScheduledDanceDto(
    startAt,
    endAt,
    danceId,
    studioId
  );

  return await postScheduledDance(mappedDto);
}

export async function editScheduledDance(
  scheduledDanceId: number,
  startAt: Date,
  endAt: Date,
  studioId: number
): Promise<TApiResponseDto<number>> {
  const mappedDto = mapToUpdateScheduledDanceDto(startAt, endAt, studioId);

  return await patchScheduledDance(scheduledDanceId, mappedDto);
}

export async function removeScheduledDance(
  scheduledDanceId: number
): Promise<TApiResponseDto<number>> {
  return await deleteScheduledDance(scheduledDanceId);
}
