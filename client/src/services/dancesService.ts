import { AccessToken } from "@okta/okta-auth-js";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import {
  getDances,
  patchDance,
  postDances,
  deleteDance as deleteDanceApi,
  addDancersToDance as addDancersToDanceApi,
  deleteDancersFromDance,
  getDancersInDance as getDancersInDanceApi,
} from "../resources/dancesResource";
import { mapToAddDancesDto, mapToUpdateDanceDto } from "./mapToDtoService";

export async function getAllDances(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDance[]>> {
  return await getDances(accessToken);
}

export async function getDancersInDance(
  danceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
  return await getDancersInDanceApi(danceId, accessToken);
}

export async function updateDance(
  danceId: number,
  accessToken: AccessToken | undefined,
  newDanceName?: string,
  newTeacherId?: number
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateDanceDto(newDanceName, newTeacherId);

  return await patchDance(danceId, mappedData, accessToken);
}

export async function addDances(
  value: string,
  teacherId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDance[]>> {
  const mappedData = mapToAddDancesDto(value, teacherId);

  return await postDances(mappedData, accessToken);
}

export async function addDancersToDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await addDancersToDanceApi(danceId, dancerIds, accessToken);
}

export async function deleteDance(
  danceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteDanceApi(danceId, accessToken);
}

export async function removeDancersFromDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteDancersFromDance(danceId, dancerIds, accessToken);
}
