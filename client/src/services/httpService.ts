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
  | TAddTeachersDto;

const resourceTypeUrlMap = {
  dancers: "/dancers",
  dances: "/dances",
  teachers: "/teachers",
  schedules: "/schedules",
  studios: "/studios",
  scheduledDances: "/scheduledDances",
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
    : TScheduledDance[];

export class HttpService {
  authorizationToken: AccessToken;
  defaultRequestParams = {
    mode: "cors" as const,
    cache: "no-cache" as const,
    credentials: "same-origin" as const,
    headers: {
      "Content-Type": "application/json" as const,
      Authorization: "Bearer",
    },
    redirect: "follow" as const,
    referrerPolicy: "no-referrer" as const,
  };

  constructor(authorizationToken: AccessToken) {
    this.authorizationToken = authorizationToken;
    this.defaultRequestParams.headers.Authorization = `Bearer ${this.authorizationToken.accessToken}`;
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
}
