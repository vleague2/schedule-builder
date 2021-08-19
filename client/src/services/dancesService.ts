import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { postDances } from "../resources/dancesResource";
import { mapToAddDancesDto } from "./mapToDtoService";

export async function addDances(
  value: string,
  teacherId: number
): Promise<TApiResponseDto<TDance[]>> {
  const mappedData = mapToAddDancesDto(value, teacherId);

  return await postDances(mappedData);
}
