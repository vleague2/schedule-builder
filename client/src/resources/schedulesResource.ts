import { TAddSchedulesDto } from "../models/TAddScheduleDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TSchedule } from "../models/TSchedule";
import { TUpdateScheduleDto } from "../models/TUpdateScheduleDto";

const url = "/schedules";

export async function getSchedules(): Promise<TApiResponseDto<TSchedule[]>> {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  return response.json();
}

export async function patchSchedule(
  scheduleId: number,
  options: TUpdateScheduleDto
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${scheduleId}`;

  const response = await fetch(requestUrl, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(options),
  });

  return response.json();
}

export async function postSchedules(
  schedules: TAddSchedulesDto
): Promise<TApiResponseDto<TSchedule[]>> {
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
    body: JSON.stringify(schedules),
  });

  return response.json();
}

export async function deleteSchedule(
  scheduleId: number
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${scheduleId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  return response.json();
}
