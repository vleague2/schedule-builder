import { useState } from "react";
import { TimePicker } from "@material-ui/pickers";
import { DateTime } from "luxon";

import { useErrorHandling } from "../hooks/useErrorHandling";
import { TDance } from "../models/TDance";
import { TStudio } from "../models/TStudio";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { TScheduledDance } from "../models/TScheduledDance";
import { valiateScheduledDance } from "../services/scheduleService";
import { Dialog } from "./presentational/Dialog/Dialog";
import { Dropdown } from "./presentational/Dropdown/Dropdown";
import {
  mapToAddScheduledDanceDto,
  mapToUpdateScheduledDanceDto,
} from "../services/mapToDtoService";
import { useHttpContext } from "../hooks/httpContext";
import { TScheduleDanceValidation } from "../models/TScheduleDanceValidation";

type TScheduledDanceDialogProps = {
  dance: TDance;
  dances: TDance[];
  open: boolean;
  onClose: () => void;
  studios: TStudio[];
  modalType: "add" | "edit";
  scheduledDances: TScheduledDance[];
  scheduleId: number;
  // required if type is "edit"
  scheduledDance?: TScheduledDance;
};

const defaultDate = DateTime.fromObject({ hour: 8 }).toJSDate();

export function ScheduledDanceDialog(
  props: TScheduledDanceDialogProps
): JSX.Element {
  const {
    dance,
    dances,
    open,
    onClose,
    studios,
    modalType,
    scheduledDance,
    scheduledDances,
    scheduleId,
  } = props;
  const [startAt, setStartAt] = useState<Date | undefined>(
    scheduledDance?.startAt ?? defaultDate
  );
  const [endAt, setEndAt] = useState<Date | undefined>(
    scheduledDance?.endAt ?? defaultDate
  );
  const [studio, setStudio] = useState<number>(scheduledDance?.StudioId ?? 1);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<
    TScheduleDanceValidation[]
  >([]);

  const { httpService } = useHttpContext();

  function onCloseHandler() {
    resetApiResponseState();
    setValidationErrors([]);
    onClose();
  }

  function buttonIsDisabled() {
    return (
      studio === 0 ||
      endAt === undefined ||
      startAt === undefined ||
      endAt <= startAt ||
      validationErrors.length > 0
    );
  }

  function resetErrorsAndWarnings() {
    resetApiResponseState();
    setValidationErrors([]);
    setValidationWarnings([]);
  }

  async function saveData() {
    if (!startAt || !endAt || studio === 0 || endAt <= startAt) {
      return;
    }

    if (modalType === "edit" && scheduledDance === undefined) {
      return;
    }

    const errors = await valiateScheduledDance(
      {
        startAt,
        endAt,
        StudioId: studio,
        DanceId: dance.id,
        id: scheduledDance?.id,
      },
      scheduledDances,
      dances,
      scheduleId,
      dance.TeacherId,
      httpService
    );

    if (errors.length > 0) {
      const blockingErrors = errors.filter((error) => error.level === "error");

      if (blockingErrors.length > 0) {
        // present only the blocking errors first
        setValidationErrors(blockingErrors.map((error) => error.errorMessage));
        return;
        // if we already have validation warnings, that means they're proceeding with saving with warnings.
        // if not, this is our first time calculating them
      } else if (validationWarnings.length === 0) {
        setValidationWarnings(errors);
        return;
      }
    }

    // TODO create table for schedule warnings, save them here, and display them

    const getApiCall =
      modalType === "add"
        ? () => {
            const dto = mapToAddScheduledDanceDto(
              startAt,
              endAt,
              dance.id,
              studio,
              scheduleId
            );

            return httpService.httpPost("scheduledDances", dto);
          }
        : () => {
            const dto = mapToUpdateScheduledDanceDto(startAt, endAt, studio);

            return httpService.httpPatch(
              "scheduledDances",
              // eslint-disable-next-line
              // @ts-ignore typescript is stupid sometimes
              scheduledDance.id,
              dto
            );
          };

    await makeApiCall(getApiCall, () => {
      onCloseHandler();
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dialogTitle={
        modalType === "add"
          ? `Add ${dance.name} to the schedule`
          : `Edit ${dance.name} on the schedule`
      }
      primaryButtonOnClick={saveData}
      primaryButtonDisabled={buttonIsDisabled()}
      primaryButtonLabel={
        validationWarnings.length > 0 ? "Save with warnings" : "Save"
      }
      primaryButtonColor={
        validationWarnings.length > 0 ? "secondary" : "primary"
      }
    >
      <DialogErrorMessage
        dialogType="dance"
        errors={[...apiResponseState.errors, ...validationErrors]}
        successCount={apiResponseState.successes}
      />
      <DialogErrorMessage
        dialogType="dance"
        errors={validationWarnings.map((warning) => warning.errorMessage)}
        successCount={0}
        style="warning"
      />
      <Dropdown
        label="Select the studio"
        setValue={(value: string) => {
          setStudio(parseInt(value));
          resetErrorsAndWarnings();
        }}
        value={studio.toString()}
        dropdownItems={studios.map((studio) => ({
          label: studio.name,
          value: studio.id.toString(),
        }))}
      />
      <TimePicker
        label="Choose a start time"
        value={startAt}
        minutesStep={15}
        onChange={(date) => {
          setStartAt(date?.toJSDate());
          resetErrorsAndWarnings();
        }}
        style={{ marginRight: 30 }}
      />
      <TimePicker
        label="Choose an end time"
        value={endAt}
        minutesStep={15}
        onChange={(date) => {
          setEndAt(date?.toJSDate());
          resetErrorsAndWarnings();
        }}
      />
    </Dialog>
  );
}
