import { TApiResponseDto } from "../models/TApiResponseDto";
import { TScheduledDance } from "../models/TScheduledDance";
import {
  getScheduledDances,
  postScheduledDance,
} from "../resources/scheduledDancesResource";
import { mapToAddScheduledDanceDto } from "./mapToDtoService";

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
