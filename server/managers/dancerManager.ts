import { ModelStatic, ValidationError } from "sequelize/types";
import { DanceModelInstance } from "../models/danceModel";
import { DancerDancesModelInstance } from "../models/dancerDancesModel";
import { DancerModelInstance } from "../models/dancerModel";
import { TReturnDto } from "../types";

export async function getDancers(
  dancerModel: ModelStatic<DancerModelInstance>
): Promise<TReturnDto<DancerModelInstance[]>> {
  const res: TReturnDto<DancerModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const dancerRes = await dancerModel.findAll();

    if (dancerRes) {
      res.data = dancerRes;
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getDancer(
  dancerModel: ModelStatic<DancerModelInstance>,
  dancerId: string
): Promise<TReturnDto<DancerModelInstance[]>> {
  if (!dancerId) {
    return { data: [], error: ["No dancer provided"] };
  }

  const parsedDancerId = parseInt(dancerId);

  if (Number.isNaN(parsedDancerId)) {
    return { data: [], error: ["Must provide a number for dancer id"] };
  }

  const res: TReturnDto<DancerModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const dancerRes = await dancerModel.findOne({
      where: {
        id: parsedDancerId,
      },
    });

    if (dancerRes) {
      res.data.push(dancerRes);
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getDancesForDancer(
  dancerDancesModel: ModelStatic<DancerDancesModelInstance>,
  danceModel: ModelStatic<DanceModelInstance>,
  dancerId: string
): Promise<TReturnDto<DanceModelInstance[]>> {
  if (!dancerId) {
    return { data: [], error: ["No dancer provided"] };
  }

  const parsedDancerId = parseInt(dancerId);

  if (Number.isNaN(parsedDancerId)) {
    return { data: [], error: ["Must provide a number for dancer id"] };
  }

  const res: TReturnDto<DanceModelInstance[]> = {
    data: [],
    error: [],
  };

  const dancerDancesRes = await dancerDancesModel.findAll({
    where: {
      DancerId: dancerId,
    },
  });

  const promiseResult = await Promise.all(
    dancerDancesRes.map(async (dancerDance) => {
      try {
        const danceRes = await danceModel.findOne({
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

export async function addDancer(
  dancerModel: ModelStatic<DancerModelInstance>,
  dancerName: string
): Promise<DancerModelInstance> {
  if (!dancerName) {
    throw "Must provide a dancer name";
  }

  try {
    const dancerRes = await dancerModel.create({
      name: dancerName,
    });

    if (dancerRes) {
      return dancerRes;
    }
  } catch (error) {
    throw error;
  }
}

export async function addDancers(
  dancerModel: ModelStatic<DancerModelInstance>,
  dancers: string[]
): Promise<TReturnDto<DancerModelInstance[]>> {
  const res: TReturnDto<DancerModelInstance[]> = {
    data: [],
    error: [],
  };

  if (dancers.length < 1) {
    return { data: [], error: ["No dancers provided"] };
  }

  await Promise.all(
    dancers.map(async (dancerName) => {
      try {
        const dancerRes = await addDancer(dancerModel, dancerName);
        res.data.push(dancerRes);
      } catch (error) {
        const errorMessage = (error as ValidationError).errors[0].message;
        const errorValue = (error as ValidationError).errors[0].value;
        res.error.push(`${errorMessage}: ${errorValue}`);
      }
    })
  );

  return res;
}

export async function updateDancer(
  dancerModel: ModelStatic<DancerModelInstance>,
  dancerId: string,
  options: {
    newDancerName: string;
  }
): Promise<TReturnDto<number>> {
  const { newDancerName } = options;

  if (!dancerId || !newDancerName) {
    return { data: 0, error: ["Must provide the dancer ID and the new name"] };
  }

  const parsedDancerId = parseInt(dancerId);

  if (Number.isNaN(parsedDancerId)) {
    return {
      data: 0,
      error: ["Must provide a number as the dance ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const dancerRes = await dancerModel.update(
      {
        name: newDancerName,
      },
      {
        where: {
          id: parsedDancerId,
        },
      }
    );

    res.data = dancerRes[0];
  } catch (error) {
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteDancer(
  dancerModel: ModelStatic<DancerModelInstance>,
  dancerId: string
): Promise<TReturnDto<number>> {
  if (!dancerId) {
    return { data: 0, error: ["Must provide dancer ID"] };
  }

  const parsedDancerId = parseInt(dancerId);

  if (Number.isNaN(parsedDancerId)) {
    return {
      data: 0,
      error: ["Must provide a number as the dance ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const dancerRes = await dancerModel.destroy({
      where: {
        id: parsedDancerId,
      },
    });

    res.data = dancerRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}
