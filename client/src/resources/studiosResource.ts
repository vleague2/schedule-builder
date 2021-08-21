import { TAddStudiosDto } from "../models/TAddStudiosDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TStudio } from "../models/TStudio";
import { TUpdateStudioDto } from "../models/TUpdateStudioDto";

const url = "/studios";

export async function getStudios(): Promise<TApiResponseDto<TStudio[]>> {
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

export async function patchStudio(
  studioId: number,
  options: TUpdateStudioDto
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${studioId}`;

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

export async function postStudios(
  studios: TAddStudiosDto
): Promise<TApiResponseDto<TStudio[]>> {
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
    body: JSON.stringify(studios),
  });

  return response.json();
}

export async function deleteStudio(
  studioId: number
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${studioId}`, {
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
