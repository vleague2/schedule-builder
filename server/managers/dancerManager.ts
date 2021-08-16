import { ModelCtor } from "sequelize/types";
import { DancerModelInstance } from "../models/dancerModel";
import { TReturnDto } from "../types";

export async function getDancers(
  dancerModel: ModelCtor<DancerModelInstance>
): Promise<TReturnDto<DancerModelInstance[]>> {
  const res: TReturnDto<DancerModelInstance[]> = {
    data: undefined,
    error: undefined,
  };

  try {
    const dancerRes = await dancerModel.findAll();

    if (dancerRes) {
      res.data = dancerRes;
    }
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function getDancer(
  dancerModel: ModelCtor<DancerModelInstance>,
  dancerId: string
): Promise<TReturnDto<DancerModelInstance>> {
  if (!dancerId) {
    return { error: "No dancer provided" };
  }

  const parsedDancerId = parseInt(dancerId);

  if (parsedDancerId === NaN) {
    return { error: "Must provide a number for dancer id" };
  }

  const res: TReturnDto<DancerModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const dancerRes = await dancerModel.findOne({
      where: {
        id: parsedDancerId,
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

export async function addDancer(
  dancerModel: ModelCtor<DancerModelInstance>,
  dancerName: string
): Promise<TReturnDto<DancerModelInstance>> {
  const res: TReturnDto<DancerModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const dancerRes = await dancerModel.create({
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

export async function addDancers(
  dancerModel: ModelCtor<DancerModelInstance>,
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
        const dancerRes = await addDancer(dancerModel, dancerName);
        return dancerRes?.data;
      } catch (error) {
        res.error.push(error);
      }
    })
  );

  res.data = promiseResult;

  return res;
}

export async function updateDancer(
  dancerModel: ModelCtor<DancerModelInstance>,
  dancerId: string,
  options: {
    newDancerName: string;
  }
): Promise<TReturnDto<number>> {
  const { newDancerName } = options;

  if (!dancerId || !newDancerName) {
    return { error: "Must provide the dancer ID and the new name" };
  }

  const parsedDancerId = parseInt(dancerId);

  if (parsedDancerId === NaN) {
    return {
      error: "Must provide a number as the dance ID",
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
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
    res.error = error;
  }

  return res;
}

export async function deleteDancer(
  dancerModel: ModelCtor<DancerModelInstance>,
  dancerId: string
): Promise<TReturnDto<number>> {
  if (!dancerId) {
    return { error: "Must provide dancer ID" };
  }

  const parsedDancerId = parseInt(dancerId);

  if (parsedDancerId === NaN) {
    return {
      error: "Must provide a number as the dance ID",
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const dancerRes = await dancerModel.destroy({
      where: {
        id: parsedDancerId,
      },
    });

    res.data = dancerRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}
