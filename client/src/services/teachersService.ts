import { TApiResponseDto } from "../models/TApiResponseDto";
import { TTeacher } from "../models/TTeacher";
import { postTeachers } from "../resources/teachersResource";
import { mapToAddTeachersDto } from "./mapToDtoService";

export async function addTeachers(
  value: string
): Promise<TApiResponseDto<TTeacher[]>> {
  const mappedData = mapToAddTeachersDto(value);

  return await postTeachers(mappedData);
}
