import { TAddTeachersDto } from "../models/TAddTeachersDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TTeacher } from "../models/TTeacher";

export async function postTeachers(
  teachers: TAddTeachersDto
): Promise<TApiResponseDto<TTeacher[]>> {
  const url = "/teachers";

  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(teachers),
  });

  return response.json();
}
