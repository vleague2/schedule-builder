import { ModelStatic, Sequelize } from "sequelize";
import {
  addDancersToDance,
  addDances,
  deleteDance,
  getDance,
  getDancersForDance,
  getDances,
  removeDancersFromDance,
  updateDance,
} from "./managers/danceManager";
import {
  addDancers,
  deleteDancer,
  getDancer,
  getDancers,
  getDancesForDancer,
  updateDancer,
} from "./managers/dancerManager";
import {
  addScheduledDance,
  deleteScheduledDance,
  getScheduledDances,
  updateScheduledDance,
} from "./managers/scheduledDanceManager";
import {
  addSchedules,
  deleteSchedule,
  getSchedule,
  getSchedules,
  updateSchedule,
} from "./managers/scheduleManager";
import {
  addStudios,
  deleteStudio,
  getStudio,
  getStudios,
  updateStudio,
} from "./managers/studioManager";
import {
  addTeachers,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from "./managers/teacherManager";
import { DanceModelInstance } from "./models/danceModel";
import { DancerDancesModelInstance } from "./models/dancerDancesModel";
import { DancerModelInstance } from "./models/dancerModel";
import { ScheduledDanceModelInstance } from "./models/scheduledDanceModel";
import { ScheduleModelInstance } from "./models/scheduleModel";
import { StudioModelInstance } from "./models/studioModel";
import { TeacherModelInstance } from "./models/teacherModel";
import {
  ScheduleWarningModelInstance,
} from "./models/scheduleWarningModel";
import {
  DanceWithConflictModelInstance,
} from "./models/danceWithConflictModel";
import {
  TScheduleWarningWithDances,
  addScheduleWarnings,
  deleteScheduleWarning,
  getWarningsForSchedule,
} from "./managers/scheduleWarningManager";

type TReturnDto<Data> = {
  data?: Data | undefined;
  error?: any; // an error object or a string
};

type TDance = {
  danceName: string;
  teacherId: number;
};

class Api {
  sequelize: Sequelize;
  context: any;
  danceModel: ModelStatic<DanceModelInstance>;
  dancerModel: ModelStatic<DancerModelInstance>;
  studioModel: ModelStatic<StudioModelInstance>;
  teacherModel: ModelStatic<TeacherModelInstance>;
  scheduledDanceModel: ModelStatic<ScheduledDanceModelInstance>;
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>;
  scheduleModel: ModelStatic<ScheduleModelInstance>;
  scheduleWarningModel: ModelStatic<ScheduleWarningModelInstance>;
  danceWithConflictModel: ModelStatic<DanceWithConflictModelInstance>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;

    this.danceModel = this.sequelize.models
      .Dance as ModelStatic<DanceModelInstance>;
    this.dancerModel = this.sequelize.models
      .Dancer as ModelStatic<DancerModelInstance>;
    this.studioModel = this.sequelize.models
      .Studio as ModelStatic<StudioModelInstance>;
    this.teacherModel = this.sequelize.models
      .Teacher as ModelStatic<TeacherModelInstance>;
    this.scheduledDanceModel = this.sequelize.models
      .ScheduledDance as ModelStatic<ScheduledDanceModelInstance>;
    this.dancerDancesModel = this.sequelize.models
      .DancerDances as ModelStatic<DancerDancesModelInstance>;
    this.scheduleModel = this.sequelize.models
      .Schedule as ModelStatic<ScheduleModelInstance>;
    this.scheduleWarningModel = this.sequelize.models
      .ScheduleWarning as ModelStatic<ScheduleWarningModelInstance>;
    this.danceWithConflictModel = this.sequelize.models
      .DanceWithConflict as ModelStatic<DanceWithConflictModelInstance>;
  }

  async getStudios(): Promise<TReturnDto<StudioModelInstance[]>> {
    return await getStudios(this.studioModel);
  }

  async getStudio(
    studioId: string
  ): Promise<TReturnDto<StudioModelInstance[]>> {
    return await getStudio(this.studioModel, studioId);
  }

  async addStudios(
    studios: string[]
  ): Promise<TReturnDto<StudioModelInstance[]>> {
    return await addStudios(this.studioModel, studios);
  }

  async updateStudio(
    studioId: string,
    options: {
      newStudioName: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateStudio(this.studioModel, studioId, options);
  }

  async deleteStudio(studioId: string): Promise<TReturnDto<number>> {
    return await deleteStudio(this.studioModel, studioId);
  }

  async getDancers(): Promise<TReturnDto<DancerModelInstance[]>> {
    return await getDancers(this.dancerModel);
  }

  async getDancer(
    dancerId: string
  ): Promise<TReturnDto<DancerModelInstance[]>> {
    return await getDancer(this.dancerModel, dancerId);
  }

  async addDancers(
    dancers: string[]
  ): Promise<TReturnDto<DancerModelInstance[]>> {
    return await addDancers(this.dancerModel, dancers);
  }

  async updateDancer(
    dancerId: string,
    options: {
      newDancerName: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateDancer(this.dancerModel, dancerId, options);
  }

  async deleteDancer(dancerId: string): Promise<TReturnDto<number>> {
    return await deleteDancer(this.dancerModel, dancerId);
  }

  async getTeachers(): Promise<TReturnDto<TeacherModelInstance[]>> {
    return await getTeachers(this.teacherModel);
  }

  async getTeacher(
    teacherId: string
  ): Promise<TReturnDto<TeacherModelInstance[]>> {
    return await getTeacher(this.teacherModel, teacherId);
  }

  async addTeachers(
    teachers: string[]
  ): Promise<TReturnDto<TeacherModelInstance[]>> {
    return await addTeachers(this.teacherModel, teachers);
  }

  async updateTeacher(
    teacherId: string,
    options: {
      newTeacherName: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateTeacher(this.teacherModel, teacherId, options);
  }

  async deleteTeacher(teacherId: string): Promise<TReturnDto<number>> {
    return await deleteTeacher(this.teacherModel, teacherId);
  }

  async getDances(
    teacherId?: string
  ): Promise<TReturnDto<DanceModelInstance[]>> {
    return await getDances(this.danceModel, teacherId);
  }

  async getDance(danceId: string): Promise<TReturnDto<DanceModelInstance[]>> {
    return await getDance(this.danceModel, danceId);
  }

  async addDances(
    dances: { danceName: string; teacherId: string }[]
  ): Promise<TReturnDto<DanceModelInstance[]>> {
    return await addDances(this.danceModel, dances);
  }

  async updateDance(
    danceId: string,
    options: {
      newDanceName?: string;
      newTeacherId?: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateDance(this.danceModel, danceId, options);
  }

  async deleteDance(danceId: string): Promise<TReturnDto<number>> {
    return await deleteDance(this.danceModel, danceId);
  }

  async getDancersForDance(
    danceId: string
  ): Promise<TReturnDto<DancerModelInstance[]>> {
    return await getDancersForDance(
      this.dancerDancesModel,
      this.dancerModel,
      danceId
    );
  }

  async getDancesForDancer(
    dancerId: string
  ): Promise<TReturnDto<DanceModelInstance[]>> {
    return await getDancesForDancer(
      this.dancerDancesModel,
      this.danceModel,
      dancerId
    );
  }

  async addDancersToDance({
    danceId,
    dancerIds,
  }: {
    danceId: string;
    dancerIds: string[];
  }): Promise<TReturnDto<number>> {
    return await addDancersToDance(this.dancerDancesModel, {
      danceId,
      dancerIds,
    });
  }

  async removeDancersFromDance({
    danceId,
    dancerIds,
  }: {
    danceId: string;
    dancerIds: string[];
  }): Promise<TReturnDto<number>> {
    return await removeDancersFromDance(this.dancerDancesModel, {
      danceId,
      dancerIds,
    });
  }

  async getScheduledDances(): Promise<
    TReturnDto<ScheduledDanceModelInstance[]>
  > {
    return await getScheduledDances(this.scheduledDanceModel);
  }

  async addScheduledDance({
    startAt,
    endAt,
    danceId,
    studioId,
    scheduleId,
  }: {
    startAt: string;
    endAt: string;
    danceId: string;
    studioId: string;
    scheduleId: string;
  }): Promise<TReturnDto<ScheduledDanceModelInstance[]>> {
    return await addScheduledDance(this.scheduledDanceModel, {
      startAt,
      endAt,
      danceId,
      studioId,
      scheduleId,
    });
  }

  async deleteScheduledDance(
    scheduledDanceId: string
  ): Promise<TReturnDto<number>> {
    return deleteScheduledDance(this.scheduledDanceModel, scheduledDanceId);
  }

  async updateScheduledDance(
    scheduledDanceId: string,
    options: {
      startAt?: string;
      endAt?: string;
      studioId?: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateScheduledDance(
      this.scheduledDanceModel,
      scheduledDanceId,
      options
    );
  }

  async getSchedules(): Promise<TReturnDto<ScheduleModelInstance[]>> {
    return await getSchedules(this.scheduleModel);
  }

  async getSchedule(
    scheduleId: string
  ): Promise<TReturnDto<ScheduleModelInstance[]>> {
    return await getSchedule(this.scheduleModel, scheduleId);
  }

  async addSchedules(
    schedules: string[]
  ): Promise<TReturnDto<ScheduleModelInstance[]>> {
    return await addSchedules(this.scheduleModel, schedules);
  }

  async updateSchedule(
    scheduleId: string,
    options: {
      newScheduleName: string;
    }
  ): Promise<TReturnDto<number>> {
    return await updateSchedule(this.scheduleModel, scheduleId, options);
  }

  async deleteSchedule(scheduleId: string): Promise<TReturnDto<number>> {
    return await deleteSchedule(this.scheduleModel, scheduleId);
  }

  async getWarningsForSchedule(
    scheduleId: string
  ): Promise<TReturnDto<TScheduleWarningWithDances[]>> {
    return await getWarningsForSchedule(
      this.scheduleWarningModel,
      this.danceWithConflictModel,
      scheduleId
    );
  }

  async addScheduleWarnings(scheduleWarnings: {
    conflictObjectId: string | number;
    warningType: string;
    errorMessage: string;
    scheduleId: string | number;
    conflictDanceIds: string[] | number[];
  }[]): Promise<TReturnDto<TScheduleWarningWithDances[]>> {
    return await addScheduleWarnings(
      this.scheduleWarningModel,
      this.danceWithConflictModel,
      scheduleWarnings
    );
  }

  async deleteScheduleWarning(
    scheduleWarningId: string
  ): Promise<TReturnDto<number>> {
    return await deleteScheduleWarning(
      this.scheduleWarningModel,
      scheduleWarningId
    );
  }
}

export default Api;
