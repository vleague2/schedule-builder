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

export async function getAllDances(): Promise<TApiResponseDto<TDance[]>> {
  return await getDances();
}

export async function getDancersInDance(
  danceId: number
): Promise<TApiResponseDto<TDancer[]>> {
  return await getDancersInDanceApi(danceId);
}

export async function updateDance(
  danceId: number,
  newDanceName?: string,
  newTeacherId?: number
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateDanceDto(newDanceName, newTeacherId);

  return await patchDance(danceId, mappedData);
}

export async function addDances(
  value: string,
  teacherId: number
): Promise<TApiResponseDto<TDance[]>> {
  const mappedData = mapToAddDancesDto(value, teacherId);

  return await postDances(mappedData);
}

export async function addDancersToDance(
  danceId: number,
  dancerIds: number[]
): Promise<TApiResponseDto<number>> {
  return await addDancersToDanceApi(danceId, dancerIds);
}

export async function deleteDance(
  danceId: number
): Promise<TApiResponseDto<number>> {
  return await deleteDanceApi(danceId);
}

export async function removeDancersFromDance(
  danceId: number,
  dancerIds: number[]
): Promise<TApiResponseDto<number>> {
  return await deleteDancersFromDance(danceId, dancerIds);
}
