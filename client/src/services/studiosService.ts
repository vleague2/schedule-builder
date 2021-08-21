import { TApiResponseDto } from "../models/TApiResponseDto";
import { TStudio } from "../models/TStudio";
import {
  getStudios,
  patchStudio,
  postStudios,
  deleteStudio as deleteStudioApi,
} from "../resources/studiosResource";
import { mapToAddStudiosDto, mapToUpdateStudioDto } from "./mapToDtoService";

export async function getAllStudios(): Promise<TApiResponseDto<TStudio[]>> {
  return await getStudios();
}

export async function updateStudio(
  value: string,
  studioId: number
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateStudioDto(value);

  return await patchStudio(studioId, mappedData);
}

export async function addStudios(
  value: string
): Promise<TApiResponseDto<TStudio[]>> {
  const mappedData = mapToAddStudiosDto(value);

  return await postStudios(mappedData);
}

export async function deleteStudio(
  studioId: number
): Promise<TApiResponseDto<number>> {
  return await deleteStudioApi(studioId);
}
