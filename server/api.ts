import { ModelCtor, Sequelize } from "sequelize";
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
  danceModel: ModelCtor<DanceModelInstance>;
  dancerModel: ModelCtor<DancerModelInstance>;
  studioModel: ModelCtor<StudioModelInstance>;
  teacherModel: ModelCtor<TeacherModelInstance>;
  scheduledDanceModel: ModelCtor<ScheduledDanceModelInstance>;
  dancerDancesModel: ModelCtor<DancerDancesModelInstance>;
  scheduleModel: ModelCtor<ScheduleModelInstance>;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;

    this.danceModel = this.sequelize.models
      .Dance as ModelCtor<DanceModelInstance>;
    this.dancerModel = this.sequelize.models
      .Dancer as ModelCtor<DancerModelInstance>;
    this.studioModel = this.sequelize.models
      .Studio as ModelCtor<StudioModelInstance>;
    this.teacherModel = this.sequelize.models
      .Teacher as ModelCtor<TeacherModelInstance>;
    this.scheduledDanceModel = this.sequelize.models
      .ScheduledDance as ModelCtor<ScheduledDanceModelInstance>;
    this.dancerDancesModel = this.sequelize.models
      .DancerDances as ModelCtor<DancerDancesModelInstance>;
    this.scheduleModel = this.sequelize.models
      .Schedule as ModelCtor<ScheduleModelInstance>;
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
}

export default Api;
