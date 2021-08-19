import { TAddDancersDto } from "../models/TAddDancersDto";
import { TAddDancesDto } from "../models/TAddDancesDto";
import { TAddStudiosDto } from "../models/TAddStudiosDto";
import { TAddTeachersDto } from "../models/TAddTeachersDto";

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
