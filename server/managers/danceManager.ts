import { FindOptions, ModelStatic, ValidationError } from "sequelize/types";
import { DanceModelInstance } from "../models/danceModel";
import { DancerDancesModelInstance } from "../models/dancerDancesModel";
import { DancerModelInstance } from "../models/dancerModel";
import { TReturnDto } from "../types";

export async function getDances(
  danceModel: ModelStatic<DanceModelInstance>,
  teacherId?: string
): Promise<TReturnDto<DanceModelInstance[]>> {
  const res: TReturnDto<DanceModelInstance[]> = {
    data: [],
    error: [],
  };

  const options: FindOptions = {};

  if (teacherId) {
    const parsedId = parseInt(teacherId);

    if (Number.isNaN(parsedId)) {
      return { data: [], error: ["ID must be a number"] };
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
    res.error.push(error);
  }

  return res;
}

export async function getDance(
  danceModel: ModelStatic<DanceModelInstance>,
  danceId: string
): Promise<TReturnDto<DanceModelInstance[]>> {
  if (!danceId) {
    return { data: [], error: ["No dance provided"] };
  }

  const parsedId = parseInt(danceId);

  if (Number.isNaN(parsedId)) {
    return { data: [], error: ["ID must be a number"] };
  }

  const res: TReturnDto<DanceModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const danceRes = await danceModel.findOne({
      where: {
        id: parsedId,
      },
    });

    if (danceRes) {
      res.data.push(danceRes);
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getDancersForDance(
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>,
  dancerModel: ModelStatic<DancerModelInstance>,
  danceId: string
): Promise<TReturnDto<DancerModelInstance[]>> {
  if (!danceId) {
    return { data: [], error: ["No dance provided"] };
  }

  const parsedId = parseInt(danceId);

  if (Number.isNaN(parsedId)) {
    return { data: [], error: ["ID must be a number"] };
  }

  const res: TReturnDto<DancerModelInstance[]> = {
    data: [],
    error: [],
  };

  const dancerDancesRes = await dancerDancesModel.findAll({
    where: {
      DanceId: danceId,
    },
  });

  const promiseResult = await Promise.all(
    dancerDancesRes.map(async (dancerDance) => {
      try {
        const dancerRes = await dancerModel.findOne({
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

export async function addDance(
  danceModel: ModelStatic<DanceModelInstance>,
  {
    danceName,
    teacherId,
  }: {
    danceName: string;
    teacherId: string | number;
  }
): Promise<DanceModelInstance> {
  if (!danceName || !teacherId) {
    throw "You must send a dance name and a teacher ID";
  }

  if (typeof teacherId === "string") {
    const parsedId = parseInt(teacherId);

    if (Number.isNaN(parsedId)) {
      throw "The teacher ID must be a number";
    }
  }

  try {
    const danceRes = await danceModel.create({
      name: danceName,
      TeacherId: teacherId,
    });

    if (danceRes) {
      return danceRes;
    }
  } catch (error) {
    throw error;
  }
}

export async function addDances(
  danceModel: ModelStatic<DanceModelInstance>,
  dances: { danceName: string; teacherId: string }[]
): Promise<TReturnDto<DanceModelInstance[]>> {
  if (dances.length < 1) {
    return { data: [], error: ["No dances provided"] };
  }

  const res: TReturnDto<DanceModelInstance[]> = {
    data: [],
    error: [],
  };

  await Promise.all(
    dances.map(async (dance) => {
      try {
        const addDanceRes = await addDance(danceModel, dance);
        if (addDanceRes) {
          res.data.push(addDanceRes);
        }
      } catch (error) {
        const errorMessage = (error as ValidationError).errors[0].message;
        const errorValue = (error as ValidationError).errors[0].value;
        res.error.push(`${errorMessage}: ${errorValue}`);
      }
    })
  );

  return res;
}

export async function addDancersToDance(
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>,
  {
    danceId,
    dancerIds,
  }: {
    danceId: string;
    dancerIds: string[];
  }
): Promise<TReturnDto<number>> {
  if (dancerIds.length < 1) {
    return { data: 0, error: ["No dancers provided"] };
  }

  if (!danceId) {
    return { data: 0, error: ["No dance provided"] };
  }

  const parsedDanceId = parseInt(danceId);

  if (Number.isNaN(parsedDanceId)) {
    return { data: 0, error: ["Dance ID must be a number"] };
  }

  dancerIds.forEach((dancerId) => {
    const parsedDancerId = parseInt(dancerId);

    if (Number.isNaN(parsedDancerId)) {
      return { data: 0, error: ["Dancer IDs must be numbers"] };
    }
  });

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  const addedDancers = await Promise.all(
    dancerIds.map(async (dancerId) => {
      try {
        const addDancerDanceRes = await dancerDancesModel.create({
          DancerId: dancerId,
          DanceId: danceId,
        });

        if (addDancerDanceRes) {
          return addDancerDanceRes;
        }
      } catch (error) {
        console.log(error);
        res.error.push(error);
      }
    })
  );

  res.data = addedDancers.length;

  return res;
}

export async function updateDance(
  danceModel: ModelStatic<DanceModelInstance>,
  danceId: string,
  options: {
    newDanceName?: string;
    newTeacherId?: string;
  }
): Promise<TReturnDto<number>> {
  const { newDanceName, newTeacherId } = options;

  if (!danceId) {
    return {
      data: 0,
      error: ["Must provide the dance ID"],
    };
  }

  const parsedDanceId = parseInt(danceId);

  if (Number.isNaN(parsedDanceId)) {
    return {
      data: 0,
      error: ["Must provide a number as the dance ID"],
    };
  }

  if (!newDanceName && !newTeacherId) {
    return {
      data: 0,
      error: [
        "Must provide an update to either the dance's name or the teacher ID",
      ],
    };
  }

  const values: { [x: string]: any } = {};

  if (newDanceName) {
    values.name = newDanceName;
  }

  if (newTeacherId) {
    const parsedTeacherId = parseInt(newTeacherId);

    if (Number.isNaN(parsedTeacherId)) {
      return {
        data: 0,
        error: ["Must provide a number as the teacher ID"],
      };
    }
    values.TeacherId = parsedTeacherId;
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const danceRes = await danceModel.update(values, {
      where: {
        id: parsedDanceId,
      },
    });

    res.data = danceRes[0];
  } catch (error) {
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteDance(
  danceModel: ModelStatic<DanceModelInstance>,
  danceId: string
): Promise<TReturnDto<number>> {
  if (!danceId) {
    return { data: 0, error: ["Must provide dance id"] };
  }

  const parsedId = parseInt(danceId);

  if (Number.isNaN(parsedId)) {
    return { data: 0, error: ["Must provide a dance id number"] };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const danceRes = await danceModel.destroy({
      where: {
        id: parsedId,
      },
    });

    res.data = danceRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function removeDancerFromDance(
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>,
  {
    danceId,
    dancerId,
  }: {
    danceId: string;
    dancerId: string;
  }
): Promise<number> {
  if (!dancerId || !danceId) {
    throw "Must provide dancer id and dance id";
  }

  const parsedDanceId = parseInt(danceId);

  if (Number.isNaN(parsedDanceId)) {
    throw "Dance ID must be a number";
  }

  const parsedDancer = parseInt(dancerId);

  if (Number.isNaN(parsedDancer)) {
    throw "Dancer ID must be a number";
  }

  try {
    const dancerDancesRes = await dancerDancesModel.destroy({
      where: {
        DancerId: dancerId,
        DanceId: danceId,
      },
    });

    return dancerDancesRes;
  } catch (error) {
    throw error;
  }
}

export async function removeDancersFromDance(
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>,
  {
    danceId,
    dancerIds,
  }: {
    danceId: string;
    dancerIds: string[];
  }
): Promise<TReturnDto<number>> {
  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  if (dancerIds.length < 1) {
    return { data: 0, error: ["No dances provided"] };
  }

  await Promise.all(
    dancerIds.map(async (dancerId) => {
      try {
        const addDancerToDanceRes = await removeDancerFromDance(
          dancerDancesModel,
          { danceId, dancerId }
        );
        if (addDancerToDanceRes) {
          res.data++;
        }
      } catch (error) {
        const errorMessage = (error as ValidationError).errors[0].message;
        const errorValue = (error as ValidationError).errors[0].value;
        res.error.push(`${errorMessage}: ${errorValue}`);
      }
    })
  );

  return res;
}
