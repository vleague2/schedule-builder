import { useState } from "react";

import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";

type TReturnValue = {
  apiResponseState: {
    errors: string[];
    successes: number;
  };
  resetApiResponseState: () => void;
  makeApiCall: (
    apiCall: () => Promise<
      TApiResponseDto<TResourceReturnType[] | number> | undefined
    >,
    onSuccess: (count: number) => void
  ) => Promise<void>;
};

export type TResourceReturnType =
  | TTeacher
  | TStudio
  | TDancer
  | TDance
  | TScheduledDance;

function dataIsNumber(data: number | TResourceReturnType[]): data is number {
  return typeof data === "number";
}

export function useErrorHandling(): TReturnValue {
  const [apiResponseState, setApiResponseState] = useState<{
    errors: string[];
    successes: number;
  }>({ errors: [], successes: 0 });

  function resetApiResponseState() {
    setApiResponseState({ errors: [], successes: 0 });
  }

  async function makeApiCall(
    apiCall: () => Promise<
      TApiResponseDto<TResourceReturnType[] | number> | undefined
    >,
    onSuccess: (count: number) => void
  ) {
    resetApiResponseState();

    const result = await apiCall();

    if (result === undefined) {
      setApiResponseState({ errors: ["Something went wrong"], successes: 0 });
      return;
    }

    if (result.error.length > 0) {
      setApiResponseState({
        errors: result.error,
        successes: dataIsNumber(result.data) ? result.data : result.data.length,
      });
      return;
    }

    if (dataIsNumber(result.data) && result.data > 0) {
      onSuccess(result.data);
      return;
    }

    if (!dataIsNumber(result.data) && result.data.length > 0) {
      onSuccess(result.data.length);
      return;
    }
  }

  return { apiResponseState, resetApiResponseState, makeApiCall };
}
