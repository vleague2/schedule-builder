import { AccessToken } from "@okta/okta-auth-js";
import { TAddDancersDto } from "../models/TAddDancersDto";
import { TAddDancesDto } from "../models/TAddDancesDto";
import { TAddScheduledDanceDto } from "../models/TAddScheduledDanceDto";
import { TAddSchedulesDto } from "../models/TAddScheduleDto";
import { TAddStudiosDto } from "../models/TAddStudiosDto";
import { TAddTeachersDto } from "../models/TAddTeachersDto";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TSchedule } from "../models/TSchedule";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { TUpdateDanceDto } from "../models/TUpdateDanceDto";
import { TUpdateDancerDto } from "../models/TUpdateDancerDto";
import { TUpdateScheduledDanceDto } from "../models/TUpdateScheduledDanceDto";
import { TUpdateScheduleDto } from "../models/TUpdateScheduleDto";
import { TUpdateStudioDto } from "../models/TUpdateStudioDto";
import { TUpdateTeacherDto } from "../models/TUpdateTeacherDto";
import { TScheduleDanceWarning } from "../models/TScheduleDanceValidation";
import { TAddScheduleWarningDto } from "../models/TAddScheduleWarningDto";
import { TScheduleWarning } from "../models/TScheduleWarning";

type TPatchBody =
  | TUpdateScheduledDanceDto
  | TUpdateDanceDto
  | TUpdateScheduleDto
  | TUpdateDancerDto
  | TUpdateStudioDto
  | TUpdateTeacherDto;

type TPostBody =
  | TAddDancersDto
  | TAddDancesDto
  | TAddScheduledDanceDto
  | TAddSchedulesDto
  | TAddStudiosDto
  | TAddTeachersDto
  | TAddScheduleWarningDto;

type THttpDancersInDanceArgs<T> = T extends "GET"
  ? {
      danceId: number;
      dancerIds?: never;
    }
  : {
      danceId: number;
      dancerIds: number[];
    };

type THttpScheduleWarningsWithDancesArgs<T> = T extends "GET"
  ? { scheduleId: number; warnings?: never }
  : T extends "POST"
  ? { scheduleId: number; warnings: TAddScheduleWarningDto }
  : { scheduleWarningId: number };

const resourceTypeUrlMap = {
  dancers: "/dancers",
  dances: "/dances",
  teachers: "/teachers",
  schedules: "/schedules",
  studios: "/studios",
  scheduledDances: "/scheduledDances",
  scheduleWarnings: "/scheduleWarnings",
};

type TReturnType<T extends keyof typeof resourceTypeUrlMap> =
  T extends "dancers"
    ? TDancer[]
    : T extends "dances"
    ? TDance[]
    : T extends "teachers"
    ? TTeacher[]
    : T extends "schedules"
    ? TSchedule[]
    : T extends "studios"
    ? TStudio[]
    : T extends "scheduleWarnings"
    ? TScheduleDanceWarning[]
    : TScheduledDance[];

type TDancersInDanceReturnType<T extends "GET" | "POST" | "DELETE"> =
  T extends "GET" ? TDancer[] : number;

type TScheduleWarningsReturnType<T extends "GET" | "POST" | "DELETE"> =
  T extends "GET" ? TScheduleWarning[] : number;

export class HttpService {
  authorizationToken: AccessToken;
  defaultRequestParams: RequestInit;

  constructor(authorizationToken: AccessToken) {
    this.authorizationToken = authorizationToken;
    this.defaultRequestParams = {
      mode: "cors" as const,
      cache: "no-cache" as const,
      credentials: "same-origin" as const,
      headers: {
        "Content-Type": "application/json" as const,
        Authorization: `Bearer ${this.authorizationToken.accessToken}`,
      },
      redirect: "follow" as const,
      referrerPolicy: "no-referrer" as const,
    };
  }

  async httpGet<T extends keyof typeof resourceTypeUrlMap>(
    resourceType: T
  ): Promise<TApiResponseDto<TReturnType<T>>> {
    const url = resourceTypeUrlMap[resourceType];

    const requestParams = {
      ...this.defaultRequestParams,
      method: "GET",
    };

    return (await fetch(url, requestParams)).json();
  }

  async httpPatch(
    resourceType: keyof typeof resourceTypeUrlMap,
    resourceId: number,
    body: TPatchBody
  ): Promise<TApiResponseDto<number>> {
    const url = `${resourceTypeUrlMap[resourceType]}/${resourceId}`;

    const requestParams = {
      ...this.defaultRequestParams,
      method: "PATCH",
      body: JSON.stringify(body),
    };

    return (await fetch(url, requestParams)).json();
  }

  async httpPost<T extends keyof typeof resourceTypeUrlMap>(
    resourceType: T,
    body: TPostBody
  ): Promise<TApiResponseDto<TReturnType<T>>> {
    const url = resourceTypeUrlMap[resourceType];

    const requestParams = {
      ...this.defaultRequestParams,
      method: "POST",
      body: JSON.stringify(body),
    };

    return (await fetch(url, requestParams)).json();
  }

  async httpDelete(
    resourceType: keyof typeof resourceTypeUrlMap,
    resourceId: number
  ): Promise<TApiResponseDto<number>> {
    const url = `${resourceTypeUrlMap[resourceType]}/${resourceId}`;

    const requestParams = {
      ...this.defaultRequestParams,
      method: "DELETE",
    };

    return (await fetch(url, requestParams)).json();
  }

  async httpDancersInDance<T extends "GET" | "POST" | "DELETE">(
    requestType: T,
    args: THttpDancersInDanceArgs<T>
  ): Promise<TApiResponseDto<TDancersInDanceReturnType<T>>> {
    const url = `${resourceTypeUrlMap["dances"]}/${args.danceId}/dancers`;

    const requestParams: RequestInit = {
      ...this.defaultRequestParams,
      method: requestType,
    };

    if (requestType !== "GET") {
      requestParams.body = JSON.stringify({ dancerIds: args.dancerIds });
    }

    return (await fetch(url, requestParams)).json();
  }

  async httpScheduleWarningsGetOrPost<T extends "GET" | "POST">(
    requestType: T,
    args: THttpScheduleWarningsWithDancesArgs<T>
  ): Promise<TApiResponseDto<TScheduleWarningsReturnType<T>>> {
    const url = `${resourceTypeUrlMap["scheduleWarnings"]}/${args.scheduleId}`;

    const requestParams: RequestInit = {
      ...this.defaultRequestParams,
      method: requestType,
    };

    if (requestType !== "GET") {
      requestParams.body = JSON.stringify({ scheduleWarnings: args.warnings });
    }

    return (await fetch(url, requestParams)).json();
  }

  async httpScheduleWarningsDelete<T extends "DELETE">(
    requestType: T,
    args: THttpScheduleWarningsWithDancesArgs<T>
  ): Promise<TApiResponseDto<TScheduleWarning>> {
    const url = `${resourceTypeUrlMap["scheduleWarnings"]}/${args.scheduleWarningId}}}`;

    const requestParams: RequestInit = {
      ...this.defaultRequestParams,
      method: requestType,
    };

    return (await fetch(url, requestParams)).json();
  }
}
