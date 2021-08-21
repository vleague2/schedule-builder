import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import {
  getDances,
  patchDance,
  postDances,
  deleteDance as deleteDanceApi,
} from "../resources/dancesResource";
import { mapToAddDancesDto, mapToUpdateDanceDto } from "./mapToDtoService";

export async function getAllDances(): Promise<TApiResponseDto<TDance[]>> {
  return await getDances();
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

export async function deleteDance(
  danceId: number
): Promise<TApiResponseDto<number>> {
  return await deleteDanceApi(danceId);
}
