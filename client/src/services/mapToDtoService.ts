import { TAddDancersDto } from "../models/TAddDancersDto";

export function mapToAddDancersDto(value: string): TAddDancersDto {
  return {
    dancers: value.split(",").map((value) => value.trim()),
  };
}
