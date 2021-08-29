import { AccessToken } from "@okta/okta-auth-js";
import { TAddDancersDto } from "../models/TAddDancersDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";
import { TUpdateDancerDto } from "../models/TUpdateDancerDto";

const url = "/dancers";

export async function getDancers(
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
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

export async function patchDancer(
  dancerId: number,
  options: TUpdateDancerDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const requestUrl = `${url}/${dancerId}`;

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

export async function postDancers(
  dancers: TAddDancersDto,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
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
    body: JSON.stringify(dancers),
  });

  return response.json();
}

export async function deleteDancer(
  dancerId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  const response = await fetch(`${url}/${dancerId}`, {
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
