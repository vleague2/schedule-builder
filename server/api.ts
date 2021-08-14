import { FindOptions, Model, ModelCtor, Sequelize } from "sequelize";
import {
  addDance,
  addDances,
  deleteDance,
  getDance,
  getDances,
  updateDance,
} from "./managers/danceManager";
import { DanceModelInstance } from "./models/danceModel";
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

interface DancerDancesModelInstance extends Model {
  DancerId: number;
  DanceId: number;
}

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
    const res: TReturnDto<StudioModelInstance[]> = {
      data: undefined,
      error: undefined,
    };

    try {
      const studioRes = await this.studioModel.findAll();

      res.data = studioRes;
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async getStudio(studioId: number): Promise<TReturnDto<StudioModelInstance>> {
    if (!studioId) {
      return { error: "No studio provided" };
    }

    const res: TReturnDto<StudioModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const studioRes = await this.studioModel.findOne({
        where: {
          id: studioId,
        },
      });

      if (studioRes) {
        res.data = studioRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addStudio(
    studioName: string
  ): Promise<TReturnDto<StudioModelInstance>> {
    if (!studioName) {
      return { error: "No studio provided" };
    }

    const res: TReturnDto<StudioModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const studioRes = await this.studioModel.create({
        name: studioName,
      });

      if (studioRes) {
        res.data = studioRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addStudios(
    studios: string[]
  ): Promise<TReturnDto<StudioModelInstance[]>> {
    if (studios.length < 1) {
      return { error: "No studios provided" };
    }

    const res: TReturnDto<StudioModelInstance[]> = {
      data: undefined,
      error: [],
    };

    const promiseResult = await Promise.all(
      studios.map(async (studioName) => {
        try {
          const studioRes = await this.addStudio(studioName);
          return studioRes?.data;
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = promiseResult;

    return res;
  }

  async updateStudio({
    studioId,
    newName,
  }: {
    studioId: string;
    newName: string;
  }): Promise<TReturnDto<number>> {
    if (!studioId || !newName) {
      return { error: "Must provide the studio ID and the new name" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const studioRes = await this.studioModel.update(
        {
          name: newName,
        },
        {
          where: {
            id: studioId,
          },
        }
      );

      res.data = studioRes[0];
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async deleteStudio(studioId: number): Promise<TReturnDto<number>> {
    if (!studioId) {
      return { error: "Must provide studio ID" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const studioRes = await this.studioModel.destroy({
        where: {
          id: studioId,
        },
      });

      res.data = studioRes;
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async getDancers(): Promise<TReturnDto<DancerModelInstance[]>> {
    const res: TReturnDto<DancerModelInstance[]> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerRes = await this.dancerModel.findAll();

      if (dancerRes) {
        res.data = dancerRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async getDancer(dancerId: number): Promise<TReturnDto<DancerModelInstance>> {
    if (!dancerId) {
      return { error: "No dancer provided" };
    }

    const res: TReturnDto<DancerModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerRes = await this.dancerModel.findOne({
        where: {
          id: dancerId,
        },
      });

      if (dancerRes) {
        res.data = dancerRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addDancer(
    dancerName: string
  ): Promise<TReturnDto<DancerModelInstance>> {
    const res: TReturnDto<DancerModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerRes = await this.dancerModel.create({
        name: dancerName,
      });

      if (dancerRes) {
        res.data = dancerRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addDancers(
    dancers: string[]
  ): Promise<TReturnDto<DancerModelInstance[]>> {
    const res: TReturnDto<DancerModelInstance[]> = {
      data: undefined,
      error: [],
    };

    if (dancers.length < 1) {
      return { error: "No dancers provided" };
    }

    const promiseResult = await Promise.all(
      dancers.map(async (dancerName) => {
        try {
          const dancerRes = await this.addDancer(dancerName);
          return dancerRes?.data;
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = promiseResult;
  }

  async updateDancer({
    dancerId,
    newName,
  }: {
    dancerId: number;
    newName: string;
  }): Promise<TReturnDto<number>> {
    if (!dancerId || !newName) {
      return { error: "Must provide the dancer ID and the new name" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerRes = await this.dancerModel.update(
        {
          name: newName,
        },
        {
          where: {
            id: dancerId,
          },
        }
      );

      res.data = dancerRes[0];
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async deleteDancer(dancerId: number): Promise<TReturnDto<number>> {
    if (!dancerId) {
      return { error: "Must provide dancer ID" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerRes = await this.dancerModel.destroy({
        where: {
          id: dancerId,
        },
      });

      res.data = dancerRes;
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async getTeachers(): Promise<TReturnDto<TeacherModelInstance[]>> {
    const res: TReturnDto<TeacherModelInstance[]> = {
      data: undefined,
      error: undefined,
    };

    try {
      const teacherRes = await this.teacherModel.findAll();

      if (teacherRes) {
        res.data = teacherRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async getTeacher(
    teacherId: number
  ): Promise<TReturnDto<TeacherModelInstance>> {
    if (!teacherId) {
      return { error: "No teacher provided" };
    }

    const res: TReturnDto<TeacherModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const teacherRes = await this.teacherModel.findOne({
        where: {
          id: teacherId,
        },
      });

      if (teacherRes) {
        res.data = teacherRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addTeacher(
    teacherName: string
  ): Promise<TReturnDto<TeacherModelInstance>> {
    if (!teacherName) {
      return { error: "No teacher provided" };
    }

    const res: TReturnDto<TeacherModelInstance> = {
      data: undefined,
      error: undefined,
    };

    try {
      const teacherRes = await this.teacherModel.create({
        name: teacherName,
      });

      if (teacherRes) {
        res.data = teacherRes;
      }
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async addTeachers(
    teachers: string[]
  ): Promise<TReturnDto<TeacherModelInstance[]>> {
    if (teachers.length < 1) {
      return { error: "No teachers provided" };
    }

    const res: TReturnDto<TeacherModelInstance[]> = {
      data: undefined,
      error: [],
    };

    const promiseResult = await Promise.all(
      teachers.map(async (teacherName) => {
        try {
          const teacherRes = await this.addTeacher(teacherName);
          return teacherRes?.data;
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = promiseResult;

    return res;
  }

  async updateTeacher({
    teacherId,
    newName,
  }: {
    teacherId: number;
    newName: string;
  }): Promise<TReturnDto<number>> {
    if (!teacherId || !newName) {
      return { error: "Must provide the teacher ID and the new name" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const teacherRes = await this.teacherModel.update(
        {
          name: newName,
        },
        {
          where: {
            id: teacherId,
          },
        }
      );

      res.data = teacherRes[0];
    } catch (error) {
      res.error = error;
    }

    return res;
  }

  async deleteTeacher(teacherId: number): Promise<TReturnDto<number>> {
    if (!teacherId) {
      return { error: "Must provide teacher ID" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const teacherRes = await this.teacherModel.destroy({
        where: {
          id: teacherId,
        },
      });

      res.data = teacherRes;
    } catch (error) {
      res.error = error;
    }

    return res;
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
    danceId: number
  ): Promise<TReturnDto<DancerModelInstance[]>> {
    if (!danceId) {
      return { error: "No dance provided" };
    }

    const res: TReturnDto<DancerModelInstance[]> = {
      data: undefined,
      error: [],
    };

    const dancerDancesRes = await this.dancerDancesModel.findAll({
      where: {
        DanceId: danceId,
      },
    });

    const promiseResult = await Promise.all(
      dancerDancesRes.map(async (dancerDance) => {
        try {
          const dancerRes = await this.dancerModel.findOne({
            where: { id: dancerDance.DancerId },
          });

          if (dancerRes) {
            return dancerRes;
          }
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = promiseResult;

    return res;
  }

  async getDancesForDancer(
    dancerId: number
  ): Promise<TReturnDto<DanceModelInstance[]>> {
    if (!dancerId) {
      return { error: "No dancer provided" };
    }

    const res: TReturnDto<DanceModelInstance[]> = {
      data: undefined,
      error: [],
    };

    const dancerDancesRes = await this.dancerDancesModel.findAll({
      where: {
        DancerId: dancerId,
      },
    });

    const promiseResult = await Promise.all(
      dancerDancesRes.map(async (dancerDance) => {
        try {
          const danceRes = await this.danceModel.findOne({
            where: { id: dancerDance.DanceId },
          });

          if (danceRes) {
            return danceRes;
          }
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = promiseResult;

    return res;
  }

  async addDancersToDance({
    dancerIds,
    danceId,
  }: {
    dancerIds: number[];
    danceId: number;
  }): Promise<TReturnDto<number>> {
    if (dancerIds.length < 1) {
      return { error: "No dancers provided" };
    }

    if (!danceId) {
      return { error: "No dance provided" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: [],
    };

    const addedDancers = await Promise.all(
      dancerIds.map(async (dancerId) => {
        try {
          const addDancerDanceRes = await this.dancerDancesModel.create({
            DancerId: dancerId,
            DanceId: danceId,
          });

          if (addDancerDanceRes) {
            return addDancerDanceRes;
          }
        } catch (error) {
          res.error.push(error);
        }
      })
    );

    res.data = addedDancers.length;

    return res;
  }

  async removeDancerFromDance({
    dancerId,
    danceId,
  }: {
    dancerId: string;
    danceId: string;
  }): Promise<TReturnDto<number>> {
    if (!dancerId || !danceId) {
      return { error: "Must provide dancer id and dance id" };
    }

    const res: TReturnDto<number> = {
      data: undefined,
      error: undefined,
    };

    try {
      const dancerDancesRes = await this.dancerDancesModel.destroy({
        where: {
          DancerId: dancerId,
          DanceId: danceId,
        },
      });

      res.data = dancerDancesRes;
    } catch (error) {
      res.error = error;
    }

    return res;
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
