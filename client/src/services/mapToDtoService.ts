import { TAddDancersDto } from "../models/TAddDancersDto";
import { TAddDancesDto } from "../models/TAddDancesDto";
import { TAddScheduledDanceDto } from "../models/TAddScheduledDanceDto";
import { TAddSchedulesDto } from "../models/TAddScheduleDto";
import { TAddStudiosDto } from "../models/TAddStudiosDto";
import { TAddTeachersDto } from "../models/TAddTeachersDto";
import { TUpdateDanceDto } from "../models/TUpdateDanceDto";
import { TUpdateDancerDto } from "../models/TUpdateDancerDto";
import { TUpdateScheduledDanceDto } from "../models/TUpdateScheduledDanceDto";
import { TUpdateScheduleDto } from "../models/TUpdateScheduleDto";
import { TUpdateStudioDto } from "../models/TUpdateStudioDto";
import { TUpdateTeacherDto } from "../models/TUpdateTeacherDto";

export function mapToAddDancersDto(value: string): TAddDancersDto {
  return {
    dancers: value.split(",").map((value) => value.trim()),
  };
}

export function mapToAddTeachersDto(value: string): TAddTeachersDto {
  return {
    teachers: value.split(",").map((value) => value.trim()),
  };
}

export function mapToAddStudiosDto(value: string): TAddStudiosDto {
  return {
    studios: value.split(",").map((value) => value.trim()),
  };
}

export function mapToAddDancesDto(
  value: string,
  teacherId: number
): TAddDancesDto {
  const dances = value.split(",").map((value) => value.trim());

  const dancesWithTeacherId = dances.map((dance) => ({
    teacherId,
    danceName: dance,
  }));

  return {
    dances: dancesWithTeacherId,
  };
}

export function mapToUpdateTeacherDto(value: string): TUpdateTeacherDto {
  return {
    options: {
      newTeacherName: value,
    },
  };
}

export function mapToUpdateStudioDto(value: string): TUpdateStudioDto {
  return {
    options: {
      newStudioName: value,
    },
  };
}

export function mapToUpdateDancerDto(value: string): TUpdateDancerDto {
  return {
    options: {
      newDancerName: value,
    },
  };
}

export function mapToUpdateDanceDto(
  newDanceName?: string,
  newTeacherId?: number
): TUpdateDanceDto {
  return {
    options: {
      newDanceName,
      newTeacherId,
    },
  };
}

export function mapToAddScheduledDanceDto(
  startAt: Date,
  endAt: Date,
  danceId: number,
  studioId: number,
  scheduleId: number
): TAddScheduledDanceDto {
  return {
    startAt,
    endAt,
    danceId,
    studioId,
    scheduleId,
  };
}

export function mapToUpdateScheduledDanceDto(
  startAt: Date,
  endAt: Date,
  studioId: number
): TUpdateScheduledDanceDto {
  return {
    options: {
      startAt,
      endAt,
      studioId,
    },
  };
}

export function mapToUpdateScheduleDto(name: string): TUpdateScheduleDto {
  return {
    options: {
      newScheduleName: name,
    },
  };
}

export function mapToAddSchedulesDto(value: string): TAddSchedulesDto {
  return {
    schedules: value.split(",").map((value) => value.trim()),
  };
}
