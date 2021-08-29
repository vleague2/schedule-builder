import { AccessToken } from "@okta/okta-auth-js";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";
import {
  deleteDancer as deleteDancerApi,
  getDancers,
  patchDancer,
  postDancers,
} from "../resources/dancersResource";
import { mapToAddDancersDto, mapToUpdateDancerDto } from "./mapToDtoService";

export async function getAllDancers(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
  return await getDancers(accessToken);
}

export async function updateDancer(
  value: string,
  dancerId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateDancerDto(value);

  return await patchDancer(dancerId, mappedData, accessToken);
}

export async function addDancers(
  value: string,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
  const mappedData = mapToAddDancersDto(value);

  return await postDancers(mappedData, accessToken);
}

export async function deleteDancer(
  dancerId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteDancerApi(dancerId, accessToken);
}
