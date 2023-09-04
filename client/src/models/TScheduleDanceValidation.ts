import { TDance } from "./TDance";

export type TScheduleDanceValidation = TScheduleDanceError | TScheduleDanceWarning;

export type TScheduleDanceError = {
  type: 'teacher' | 'studio';
  conflictObjectId: number;
  dancesWithConflict?: TDance['id'][];
  errorMessage: string;
  level: 'error';
  scheduleId: number;
}

export type TScheduleDanceWarning = {
  type: 'dancer';
  conflictObjectId: number;
  dancesWithConflict: TDance['id'][];
  errorMessage: string;
  level: 'warning';
  scheduleId: number;
}