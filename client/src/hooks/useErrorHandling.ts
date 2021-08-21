import { useState } from "react";

import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";

export type TResourceReturnType = TTeacher | TStudio | TDancer | TDance;

function dataIsNumber(data: any): data is number {
  return typeof data === "number";
}

export function useErrorHandling() {
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

    console.log(result);

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

    if (!dataIsNumber(result.data) && result.data.length > 1) {
      onSuccess(result.data.length);
      return;
    }
  }

  return { apiResponseState, resetApiResponseState, makeApiCall };
}
