import { TAddDancesDto } from "../models/TAddDancesDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";

export async function postDances(
  dances: TAddDancesDto
): Promise<TApiResponseDto<TDance[]>> {
  const url = "/dances";

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
    body: JSON.stringify(dances),
  });

  return response.json();
}
