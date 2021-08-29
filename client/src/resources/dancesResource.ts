import { AccessToken } from "@okta/okta-auth-js";
import { TAddDancesDto } from "../models/TAddDancesDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TUpdateDanceDto } from "../models/TUpdateDanceDto";

const url = "/dances";

export async function getDances(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDance[]>> {
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

export async function getDancersInDance(
  danceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
  const response = await fetch(`${url}/${danceId}/dancers`, {
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

export async function patchDance(
  danceId: number,
  options: TUpdateDanceDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${danceId}`;

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

export async function postDances(
  dances: TAddDancesDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDance[]>> {
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
    body: JSON.stringify(dances),
  });

  return response.json();
}

export async function addDancersToDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${danceId}/dancers`, {
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
    body: JSON.stringify({ dancerIds }),
  });

  return response.json();
}

export async function deleteDance(
  danceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${danceId}`, {
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

export async function deleteDancersFromDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${danceId}/dancers`, {
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
    body: JSON.stringify({ dancerIds }),
  });

  return response.json();
}
