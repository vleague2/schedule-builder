import { ModelCtor, ValidationError } from "sequelize/types";
import { StudioModelInstance } from "../models/studioModel";
import { TReturnDto } from "../types";

export async function getStudios(
  studioModel: ModelCtor<StudioModelInstance>
): Promise<TReturnDto<StudioModelInstance[]>> {
  const res: TReturnDto<StudioModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const studioRes = await studioModel.findAll();

    res.data = studioRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function getStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string
): Promise<TReturnDto<StudioModelInstance[]>> {
  if (!studioId) {
    return { data: [], error: ["No studio provided"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      data: [],
      error: ["Must provide a number as the studio ID"],
    };
  }

  const res: TReturnDto<StudioModelInstance[]> = {
    data: [],
    error: [],
  };

  try {
    const studioRes = await studioModel.findOne({
      where: {
        id: parsedStudioId,
      },
    });

    if (studioRes) {
      res.data.push(studioRes);
    }
  } catch (error) {
    res.error.push(error);
  }

  return res;
}

export async function addStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioName: string
): Promise<StudioModelInstance> {
  if (!studioName) {
    throw "No studio provided";
  }

  try {
    const studioRes = await studioModel.create({
      name: studioName,
    });

    if (studioRes) {
      return studioRes;
    }
  } catch (error) {
    throw error;
  }
}

export async function addStudios(
  studioModel: ModelCtor<StudioModelInstance>,
  studios: string[]
): Promise<TReturnDto<StudioModelInstance[]>> {
  if (studios.length < 1) {
    return { data: [], error: ["No studios provided"] };
  }

  const res: TReturnDto<StudioModelInstance[]> = {
    data: [],
    error: [],
  };

  await Promise.all(
    studios.map(async (studioName) => {
      try {
        const studioRes = await addStudio(studioModel, studioName);
        if (studioRes) {
          res.data.push(studioRes);
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

export async function updateStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string,
  options: {
    newStudioName: string;
  }
): Promise<TReturnDto<number>> {
  const { newStudioName } = options;

  if (!studioId || !newStudioName) {
    return { data: 0, error: ["Must provide the studio ID and the new name"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      data: 0,
      error: ["Must provide a number as the studio ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
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
    const errorMessage = (error as ValidationError).errors[0].message;
    const errorValue = (error as ValidationError).errors[0].value;
    res.error.push(`${errorMessage}: ${errorValue}`);
  }

  return res;
}

export async function deleteStudio(
  studioModel: ModelCtor<StudioModelInstance>,
  studioId: string
): Promise<TReturnDto<number>> {
  if (!studioId) {
    return { data: 0, error: ["Must provide studio ID"] };
  }

  const parsedStudioId = parseInt(studioId);

  if (parsedStudioId === NaN) {
    return {
      data: 0,
      error: ["Must provide a number as the studio ID"],
    };
  }

  const res: TReturnDto<number> = {
    data: 0,
    error: [],
  };

  try {
    const studioRes = await studioModel.destroy({
      where: {
        id: parsedStudioId,
      },
    });

    res.data = studioRes;
  } catch (error) {
    res.error.push(error);
  }

  return res;
}
