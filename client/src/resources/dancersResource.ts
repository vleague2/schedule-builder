import { TAddDancersDto } from "../models/TAddDancersDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";

export async function postDancers(
  dancers: TAddDancersDto
): Promise<TApiResponseDto<TDancer[]>> {
  const url = "/dancers";

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
    body: JSON.stringify(dancers),
  });

  return response.json();
}
