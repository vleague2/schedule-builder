import { TAddScheduledDanceDto } from "../models/TAddScheduledDanceDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TScheduledDance } from "../models/TScheduledDance";

const url = "/scheduledDances";

export async function getScheduledDances(): Promise<
  TApiResponseDto<TScheduledDance[]>
> {
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

export async function postScheduledDance(
  scheduledDance: TAddScheduledDanceDto
): Promise<TApiResponseDto<TScheduledDance[]>> {
  console.log(scheduledDance);
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
    body: JSON.stringify(scheduledDance),
  });

  return response.json();
}
