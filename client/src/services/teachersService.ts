import { TApiResponseDto } from "../models/TApiResponseDto";
import { TTeacher } from "../models/TTeacher";
import {
  postTeachers,
  getTeachers,
  patchTeacher,
  deleteTeacher as deleteTeacherApi,
} from "../resources/teachersResource";
import { mapToAddTeachersDto, mapToUpdateTeacherDto } from "./mapToDtoService";

export async function getAllTeachers(): Promise<TApiResponseDto<TTeacher[]>> {
  return await getTeachers();
}

export async function updateTeacher(
  value: string,
  teacherId: number
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateTeacherDto(value);

  return await patchTeacher(teacherId, mappedData);
}

export async function addTeachers(
  value: string
): Promise<TApiResponseDto<TTeacher[]>> {
  const mappedData = mapToAddTeachersDto(value);

  return await postTeachers(mappedData);
}

export async function deleteTeacher(
  teacherId: number
): Promise<TApiResponseDto<number>> {
  return await deleteTeacherApi(teacherId);
}
