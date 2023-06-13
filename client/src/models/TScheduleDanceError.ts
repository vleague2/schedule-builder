import { TDance } from "./TDance";
import { TDancer } from "./TDancer";
import { TStudio } from "./TStudio";
import { TTeacher } from "./TTeacher";

export type TScheduleDanceError = TScheduleDanceTeacherError | TScheduleDanceDancerError | TScheduleDanceStudioError;

export type TScheduleDanceDancerError = {
  dancerId: TDancer['id'];
  dancesWithConflict: TDance['id'][];
  errorMessage: string;
}

export type TScheduleDanceTeacherError = {
  teacherId: TTeacher['id'];
  dancesWithConflict: TDance['id'][];
  errorMessage: string;
}

export type TScheduleDanceStudioError = {
  studioId: TStudio['id'];
  errorMessage: string;
}