import { AccessToken } from "@okta/okta-auth-js";
import { TAddScheduledDanceDto } from "../models/TAddScheduledDanceDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TScheduledDance } from "../models/TScheduledDance";
import { TUpdateScheduledDanceDto } from "../models/TUpdateScheduledDanceDto";

const url = "/scheduledDances";

export async function getScheduledDances(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TScheduledDance[]>> {
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

export async function postScheduledDance(
  scheduledDance: TAddScheduledDanceDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TScheduledDance[]>> {
  console.log(scheduledDance);
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
    body: JSON.stringify(scheduledDance),
  });

  return response.json();
}

export async function patchScheduledDance(
  scheduledDanceId: number,
  options: TUpdateScheduledDanceDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${scheduledDanceId}`;

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

export async function deleteScheduledDance(
  scheduledDanceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${scheduledDanceId}`, {
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
