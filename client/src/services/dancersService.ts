import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";
import {
  deleteDancer as deleteDancerApi,
  getDancers,
  patchDancer,
  postDancers,
} from "../resources/dancersResource";
import { mapToAddDancersDto, mapToUpdateDancerDto } from "./mapToDtoService";

export async function getAllDancers(): Promise<TApiResponseDto<TDancer[]>> {
  return await getDancers();
}

export async function updateDancer(
  value: string,
  dancerId: number
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateDancerDto(value);

  return await patchDancer(dancerId, mappedData);
}

export async function addDancers(
  value: string
): Promise<TApiResponseDto<TDancer[]>> {
  const mappedData = mapToAddDancersDto(value);

  return await postDancers(mappedData);
}

export async function deleteDancer(
  dancerId: number
): Promise<TApiResponseDto<number>> {
  return await deleteDancerApi(dancerId);
}
