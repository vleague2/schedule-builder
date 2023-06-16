import { TDance } from "./TDance";

export type TScheduleDanceValidation = TScheduleDanceError | TScheduleDanceWarning;

export type TScheduleDanceError = {
  type: 'teacher' | 'studio';
  conflictObjectId: number;
  dancesWithConflict?: TDance['id'][];
  errorMessage: string;
  level: 'error';
}

export type TScheduleDanceWarning = {
  type: 'dancer';
  conflictObjectId: number;
  dancesWithConflict: TDance['id'][];
  errorMessage: string;
  level: 'warning';
}