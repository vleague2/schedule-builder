import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";
import { postDancers } from "../resources/dancersResource";
import { mapToAddDancersDto } from "./mapToDtoService";

export async function addDancers(
  value: string
): Promise<TApiResponseDto<TDancer[]>> {
  const mappedData = mapToAddDancersDto(value);

  return await postDancers(mappedData);
}
