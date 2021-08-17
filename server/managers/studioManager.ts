import { ModelCtor } from "sequelize/types";
import { StudioModelInstance } from "../models/studioModel";
import { TReturnDto } from "../types";

export async function getStudios(
  studioModel: ModelCtor<StudioModelInstance>
): Promise<TReturnDto<StudioModelInstance[]>> {
  const res: TReturnDto<StudioModelInstance[]> = {
    data: undefined,
    error: undefined,
  };

  try {
    const studioRes = await studioModel.findAll();

    res.data = studioRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function getStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string
): Promise<TReturnDto<StudioModelInstance>> {
  if (!studioId) {
    return { error: ["No studio provided"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      error: ["Must provide a number as the studio ID"],
    };
  }

  const res: TReturnDto<StudioModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const studioRes = await studioModel.findOne({
      where: {
        id: parsedStudioId,
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

export async function addStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioName: string
): Promise<TReturnDto<StudioModelInstance>> {
  if (!studioName) {
    return { error: ["No studio provided"] };
  }

  const res: TReturnDto<StudioModelInstance> = {
    data: undefined,
    error: undefined,
  };

  try {
    const studioRes = await studioModel.create({
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

export async function addStudios(
  studioModel: ModelCtor<StudioModelInstance>,
  studios: string[]
): Promise<TReturnDto<StudioModelInstance[]>> {
  if (studios.length < 1) {
    return { error: ["No studios provided"] };
  }

  const res: TReturnDto<StudioModelInstance[]> = {
    data: undefined,
    error: [],
  };

  const promiseResult = await Promise.all(
    studios.map(async (studioName) => {
      try {
        const studioRes = await addStudio(studioModel, studioName);
        return studioRes?.data;
      } catch (error) {
        res.error.push(error);
      }
    })
  );

  res.data = promiseResult;

  return res;
}

export async function updateStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string,
  options: {
    newStudioName: string;
  }
): Promise<TReturnDto<number>> {
  const { newStudioName } = options;

  if (!studioId || !newStudioName) {
    return { error: ["Must provide the studio ID and the new name"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      error: ["Must provide a number as the teacher ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const studioRes = await studioModel.update(
      {
        name: newStudioName,
      },
      {
        where: {
          id: parsedStudioId,
        },
      }
    );

    res.data = studioRes[0];
  } catch (error) {
    res.error = error;
  }

  return res;
}

export async function deleteStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string
): Promise<TReturnDto<number>> {
  if (!studioId) {
    return { error: ["Must provide studio ID"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      error: ["Must provide a number as the studio ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: undefined,
    error: undefined,
  };

  try {
    const studioRes = await studioModel.destroy({
      where: {
        id: parsedStudioId,
      },
    });

    res.data = studioRes;
  } catch (error) {
    res.error = error;
  }

  return res;
}
