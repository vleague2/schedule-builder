import { TApiResponseDto } from "../models/TApiResponseDto";
import { TScheduledDance } from "../models/TScheduledDance";
import { getScheduledDances } from "../resources/scheduledDancesResource";

export async function getAllScheduledDances(): Promise<
  TApiResponseDto<TScheduledDance[]>
> {
  return await getScheduledDances();
}
