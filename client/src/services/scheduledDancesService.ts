import { AccessToken } from "@okta/okta-auth-js";
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

export async function getAllScheduledDances(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TScheduledDance[]>> {
  return await getScheduledDances(accessToken);
}

export async function addScheduledDance(
  startAt: Date,
  endAt: Date,
  danceId: number,
  studioId: number,
  scheduleId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TScheduledDance[]>> {
  const mappedDto = mapToAddScheduledDanceDto(
    startAt,
    endAt,
    danceId,
    studioId,
    scheduleId
  );

  return await postScheduledDance(mappedDto, accessToken);
}

export async function editScheduledDance(
  scheduledDanceId: number,
  startAt: Date,
  endAt: Date,
  studioId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const mappedDto = mapToUpdateScheduledDanceDto(startAt, endAt, studioId);

  return await patchScheduledDance(scheduledDanceId, mappedDto, accessToken);
}

export async function removeScheduledDance(
  scheduledDanceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteScheduledDance(scheduledDanceId, accessToken);
}
