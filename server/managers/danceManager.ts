import { FindOptions, ModelCtor } from "sequelize/types";
import { DanceModelInstance } from "../models/danceModel";
import { TReturnDto } from "../types";

export async function getDances(
  danceModel: ModelCtor<DanceModelInstance>,
  teacherId?: string
): Promise<TReturnDto<DanceModelInstance[]>> {
  const res: TReturnDto<DanceModelInstance[]> = {
    data: undefined,
    error: undefined,
  };

  const options: FindOptions = {};

  if (teacherId) {
    const parsedId = parseInt(teacherId);

    if (parsedId === NaN) {
      return { error: "ID must be a number" };
    }

    options.where = {
      TeacherId: parsedId,
    };
  }

  try {
    const danceRes = await danceModel.findAll(options);

    if (danceRes) {
      res.data = danceRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function getDance(
  danceModel: ModelCtor<DanceModelInstance>,
  danceId: string
): Promise<TReturnDto<DanceModelInstance>> {
  if (!danceId) {
    return { error: "No dance provided" };
  }

  const parsedId = parseInt(danceId);

  if (parsedId === NaN) {
    return { error: "ID must be a number" };
  }

  const res: TReturnDto<DanceModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const danceRes = await danceModel.findOne({
      where: {
        id: parsedId,
      },
    });

    if (danceRes) {
      res.data = danceRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function addDance(
  danceModel: ModelCtor<DanceModelInstance>,
  {
    danceName,
    teacherId,
  }: {
    danceName: string;
    teacherId: string | number;
  }
): Promise<TReturnDto<DanceModelInstance>> {
  if (!danceName || !teacherId) {
    return { error: "You must send a dance name and a teacher ID" };
  }

  if (typeof teacherId === "string") {
    const parsedId = parseInt(teacherId);

    if (parsedId === NaN) {
      return { error: "The teacher ID must be a number" };
    }
  }

  const res: TReturnDto<DanceModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const danceRes = await danceModel.create({
      name: danceName,
      TeacherId: teacherId,
    });

    if (danceRes) {
      res.data = danceRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function addDances(
  danceModel: ModelCtor<DanceModelInstance>,
  dances: { danceName: string; teacherId: string }[]
): Promise<TReturnDto<DanceModelInstance[]>> {
  if (dances.length < 1) {
    return { error: "No dances provided" };
  }

  const res: TReturnDto<DanceModelInstance[]> = {
    data: undefined,
    error: [],
  };

  const promiseResult = await Promise.all(
    dances.map(async (dance) => {
      try {
        const addDanceRes = await addDance(danceModel, dance);
        return addDanceRes?.data;
      } catch (error) {
        res.error.push(error);
      }
    })
  );

  res.data = promiseResult;

  return res;
}

export async function updateDance(
  danceModel: ModelCtor<DanceModelInstance>,
  danceId: string,
  options: {
    newDanceName?: string;
    newTeacherId?: string;
  }
): Promise<TReturnDto<number>> {
  const { newDanceName, newTeacherId } = options;

  if (!danceId) {
    return {
      error: "Must provide the dance ID",
    };
  }

  const parsedDanceId = parseInt(danceId);

  if (parsedDanceId === NaN) {
    return {
      error: "Must provide a number as the dance ID",
    };
  }

  if (!newDanceName && !newTeacherId) {
    return {
      error:
        "Must provide an update to either the dance's name or the teacher ID",
    };
  }

  const values: { [x: string]: any } = {};

  if (newDanceName) {
    values.name = newDanceName;
  }

  if (newTeacherId) {
    const parsedTeacherId = parseInt(newTeacherId);

    if (parsedTeacherId === NaN) {
      return {
        error: "Must provide a number as the teacher ID",
      };
    }
    values.TeacherId = parsedTeacherId;
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const danceRes = await danceModel.update(values, {
      where: {
        id: parsedDanceId,
      },
    });

    res.data = danceRes[0];
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function deleteDance(
  danceModel: ModelCtor<DanceModelInstance>,
  danceId: string
): Promise<TReturnDto<number>> {
  if (!danceId) {
    return { error: "Must provide dance id" };
  }

  const parsedId = parseInt(danceId);

  if (parsedId === NaN) {
    return { error: "Must provide a dance id number" };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const danceRes = await danceModel.destroy({
      where: {
        id: parsedId,
      },
    });

    res.data = danceRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}
