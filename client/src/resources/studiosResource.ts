import { TAddStudiosDto } from "../models/TAddStudiosDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TStudio } from "../models/TStudio";

export async function postStudios(
  studios: TAddStudiosDto
): Promise<TApiResponseDto<TStudio[]>> {
  const url = "/studios";

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
