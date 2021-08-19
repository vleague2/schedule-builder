import { TApiResponseDto } from "../models/TApiResponseDto";
import { TStudio } from "../models/TStudio";
import { postStudios } from "../resources/studiosResource";
import { mapToAddStudiosDto } from "./mapToDtoService";

export async function addStudios(
  value: string
): Promise<TApiResponseDto<TStudio[]>> {
  const mappedData = mapToAddStudiosDto(value);

  return await postStudios(mappedData);
}
