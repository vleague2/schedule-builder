import { AccessToken } from "@okta/okta-auth-js";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TTeacher } from "../models/TTeacher";
import {
  postTeachers,
  getTeachers,
  patchTeacher,
  deleteTeacher as deleteTeacherApi,
} from "../resources/teachersResource";
import { mapToAddTeachersDto, mapToUpdateTeacherDto } from "./mapToDtoService";

export async function getAllTeachers(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TTeacher[]>> {
  return await getTeachers(accessToken);
}

export async function updateTeacher(
  value: string,
  teacherId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const mappedData = mapToUpdateTeacherDto(value);

  return await patchTeacher(teacherId, mappedData, accessToken);
}

export async function addTeachers(
  value: string,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TTeacher[]>> {
  const mappedData = mapToAddTeachersDto(value);

  return await postTeachers(mappedData, accessToken);
}

export async function deleteTeacher(
  teacherId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteTeacherApi(teacherId, accessToken);
}
