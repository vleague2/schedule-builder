import { useState } from "react";
import { TimePicker } from "@material-ui/pickers";
import { DateTime } from "luxon";

import { useErrorHandling } from "../hooks/useErrorHandling";
import { TDance } from "../models/TDance";
import { TStudio } from "../models/TStudio";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { TScheduledDance } from "../models/TScheduledDance";
import { valiateScheduledDance } from "../services/scheduleService";
import { Dialog } from "./Dialog";
import { Dropdown } from "./Dropdown";
import {
  mapToAddScheduledDanceDto,
  mapToUpdateScheduledDanceDto,
} from "../services/mapToDtoService";
import { useHttpContext } from "../hooks/httpContext";

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
  const [studio, setStudio] = useState<number>(scheduledDance?.StudioId ?? 0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      endAt <= startAt
    );
  }

  async function saveData() {
    if (!startAt || !endAt || studio === 0 || endAt <= startAt) {
      return;
    }

    if (modalType === "edit" && scheduledDance === undefined) {
      return;
    }

    resetApiResponseState();
    setValidationErrors([]);

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
      setValidationErrors(errors);
      return;
    }

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
      primaryButtonLabel="Save"
    >
      <DialogErrorMessage
        dialogType="dance"
        errors={[...apiResponseState.errors, ...validationErrors]}
        successCount={apiResponseState.successes}
      />
      <Dropdown
        label="Select the studio"
        setValue={(value: string) => setStudio(parseInt(value))}
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
        onChange={(date) => setStartAt(date?.toJSDate())}
        style={{ marginRight: 30 }}
      />
      <TimePicker
        label="Choose an end time"
        value={endAt}
        minutesStep={15}
        onChange={(date) => setEndAt(date?.toJSDate())}
      />
    </Dialog>
  );
}
