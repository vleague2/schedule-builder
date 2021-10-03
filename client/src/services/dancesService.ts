import { AccessToken } from "@okta/okta-auth-js";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDancer } from "../models/TDancer";
import {
  addDancersToDance as addDancersToDanceApi,
  deleteDancersFromDance,
  getDancersInDance as getDancersInDanceApi,
} from "../resources/dancesResource";

export async function getDancersInDance(
  danceId: number,
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<TDancer[]>> {
  return await getDancersInDanceApi(danceId, accessToken);
}

export async function addDancersToDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await addDancersToDanceApi(danceId, dancerIds, accessToken);
}

export async function removeDancersFromDance(
  danceId: number,
  dancerIds: number[],
  accessToken: AccessToken | undefined
): Promise<TApiResponseDto<number>> {
  return await deleteDancersFromDance(danceId, dancerIds, accessToken);
}
