import { FindOptions, Model, ModelCtor, Sequelize } from "sequelize";
import {
  addDance,
  addDancersToDance,
  addDances,
  deleteDance,
  getDance,
  getDancersForDance,
  getDances,
  removeDancerFromDance,
  updateDance,
} from "./managers/danceManager";
import {
  addDancer,
  addDancers,
  deleteDancer,
  getDancer,
  getDancers,
  getDancesForDancer,
  updateDancer,
} from "./managers/dancerManager";
import {
  addStudio,
  addStudios,
  deleteStudio,
  getStudio,
  getStudios,
  updateStudio,
} from "./managers/studioManager";
import {
  addTeacher,
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
  }

  async getStudios(): Promise<TReturnDto<StudioModelInstance[]>> {
    return await getStudios(this.studioModel);
  }

  async getStudio(studioId: string): Promise<TReturnDto<StudioModelInstance>> {
    return await getStudio(this.studioModel, studioId);
  }

  async addStudio(
    studioName: string
  ): Promise<TReturnDto<StudioModelInstance>> {
    return await addStudio(this.studioModel, studioName);
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

  async getDancer(dancerId: string): Promise<TReturnDto<DancerModelInstance>> {
    return await getDancer(this.dancerModel, dancerId);
  }

  async addDancer(
    dancerName: string
  ): Promise<TReturnDto<DancerModelInstance>> {
    return await addDancer(this.dancerModel, dancerName);
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
  ): Promise<TReturnDto<TeacherModelInstance>> {
    return await getTeacher(this.teacherModel, teacherId);
  }

  async addTeacher(
    teacherName: string
  ): Promise<TReturnDto<TeacherModelInstance>> {
    return await addTeacher(this.teacherModel, teacherName);
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

  async getDance(danceId: string): Promise<TReturnDto<DanceModelInstance>> {
    return await getDance(this.danceModel, danceId);
  }

  async addDance({
    danceName,
    teacherId,
  }: {
    danceName: string;
    teacherId: string | number;
  }): Promise<TReturnDto<DanceModelInstance>> {
    return await addDance(this.danceModel, { danceName, teacherId });
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

  async removeDancerFromDance({
    danceId,
    dancerId,
  }: {
    danceId: string;
    dancerId: string;
  }): Promise<TReturnDto<number>> {
    return await removeDancerFromDance(this.dancerDancesModel, {
      danceId,
      dancerId,
    });
  }

  async addScheduledDance({
    startsAt,
    endsAt,
    danceId,
    studioId,
  }: {
    startsAt: Date;
    endsAt: Date;
    danceId: number;
    studioId: number;
  }): Promise<TReturnDto<ScheduledDanceModelInstance>> {
    if (!startsAt || !endsAt || !danceId || !studioId) {
      return {
        error: "You need a start time, end time, dance id, and studio id",
      };
    }

    const res: TReturnDto<ScheduledDanceModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const scheduleRes = await this.scheduledDanceModel.create({
        startsAt,
        endsAt,
        StudioId: studioId,
        DanceId: danceId,
      });

      if (scheduleRes) {
        res.data = scheduleRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async deleteScheduledDance(
    scheduledDanceId: number
  ): Promise<TReturnDto<number>> {
    if (!scheduledDanceId) {
      return { error: "Must provide the id of the scheduled dance " };
    }

    const res = {
      data: undefined,
      error: undefined,
    };

    try {
      const deleteRes = this.scheduledDanceModel.destroy({
        where: { id: scheduledDanceId },
      });

      res.data = deleteRes;
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async updateScheduledDance(
    scheduledDanceId: number,
    options: {
      startAt?: Date;
      endAt?: Date;
      studioId?: number;
    }
  ): Promise<TReturnDto<number>> {
    if (!scheduledDanceId) {
      return { error: "Must provide the id of the scheduled dance" };
    }

    const { startAt, endAt, studioId } = options;

    const res = {
      data: undefined,
      error: undefined,
    };

    const values: { [key: string]: any } = {};

    if (startAt) {
      values.startAt = startAt;
    }

    if (endAt) {
      values.endAt = endAt;
    }

    if (studioId) {
      values.StudioId = studioId;
    }

    try {
      const updateRes = this.scheduledDanceModel.update(values, {
        where: { id: scheduledDanceId },
      });

      res.data = updateRes;
    } catch (error) {
      res.error = error;
    }

    return res;
  }
}

export default Api;
