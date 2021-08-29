import { AccessToken } from "@okta/okta-auth-js";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TStudio } from "../models/TStudio";
import {
  getStudios,
  patchStudio,
  postStudios,
  deleteStudio as deleteStudioApi,
} from "../resources/studiosResource";
import { mapToAddStudiosDto, mapToUpdateStudioDto } from "./mapToDtoService";

export async function getAllStudios(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TStudio[]>> {
  return await getStudios(accessToken);
}

export async function updateStudio(
  value: string,
  studioId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateStudioDto(value);

  return await patchStudio(studioId, mappedData, accessToken);
}

export async function addStudios(
  value: string,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TStudio[]>> {
  const mappedData = mapToAddStudiosDto(value);

  return await postStudios(mappedData, accessToken);
}

export async function deleteStudio(
  studioId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteStudioApi(studioId, accessToken);
}
