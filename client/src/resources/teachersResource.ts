import { AccessToken } from "@okta/okta-auth-js";
import { TAddTeachersDto } from "../models/TAddTeachersDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TTeacher } from "../models/TTeacher";
import { TUpdateTeacherDto } from "../models/TUpdateTeacherDto";

const url = "/teachers";

export async function getTeachers(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TTeacher[]>> {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken?.accessToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  return response.json();
}

export async function patchTeacher(
  teacherId: number,
  options: TUpdateTeacherDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${teacherId}`;

  const response = await fetch(requestUrl, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken?.accessToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(options),
  });

  return response.json();
}

export async function postTeachers(
  teachers: TAddTeachersDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TTeacher[]>> {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken?.accessToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(teachers),
  });

  return response.json();
}

export async function deleteTeacher(
  teacherId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${teacherId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken?.accessToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  return response.json();
}
