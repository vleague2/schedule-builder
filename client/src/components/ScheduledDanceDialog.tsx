import {
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import { TimePicker } from "@material-ui/pickers";
import { DateTime } from "luxon";

import { useErrorHandling } from "../hooks/useErrorHandling";
import { TDance } from "../models/TDance";
import { TStudio } from "../models/TStudio";
import { DialogErrorMessage } from "./DialogErrorMessage";
import {
  addScheduledDance,
  editScheduledDance,
} from "../services/scheduledDancesService";
import { TScheduledDance } from "../models/TScheduledDance";

type TScheduledDanceDialogProps = {
  dance: TDance;
  open: boolean;
  onClose: () => void;
  studios: TStudio[];
  modalType: "add" | "edit";
  // required if type is "edit"
  scheduledDance?: TScheduledDance;
};

const defaultDate = DateTime.fromObject({ hour: 8 }).toJSDate();

export function ScheduledDanceDialog(
  props: TScheduledDanceDialogProps
): JSX.Element {
  const { dance, open, onClose, studios, modalType, scheduledDance } = props;
  const [startAt, setStartAt] = useState<Date | undefined>(
    scheduledDance?.startAt ?? defaultDate
  );
  const [endAt, setEndAt] = useState<Date | undefined>(
    scheduledDance?.endAt ?? defaultDate
  );
  const [studio, setStudio] = useState<number>(scheduledDance?.StudioId ?? 0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function onCloseHandler() {
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

    const getApiCall =
      modalType === "add"
        ? () => addScheduledDance(startAt, endAt, dance.id, studio)
        : // eslint-disable-next-line
          // @ts-ignore typescript is stupid sometimes
          () => editScheduledDance(scheduledDance.id, startAt, endAt, studio);

    await makeApiCall(getApiCall, () => {
      onCloseHandler();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          {modalType === "add"
            ? `Add ${dance.name} to`
            : `Edit ${dance.name} on`}{" "}
          the schedule
        </DialogTitle>
        <DialogErrorMessage
          dialogType="dance"
          errors={apiResponseState.errors}
          successCount={apiResponseState.successes}
        />
        <TextField
          select
          fullWidth
          variant="outlined"
          label="Select the studio"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setStudio(parseInt(event.target.value));
          }}
          style={{ marginBottom: 20 }}
          value={studio}
        >
          <option value={0} selected disabled>
            Select a studio
          </option>
          {studios.map((studioOption) => (
            <option value={studioOption.id} key={studioOption.id}>
              {studioOption.name}
            </option>
          ))}
        </TextField>
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
        <br />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button
            color="primary"
            disabled={buttonIsDisabled()}
            variant="contained"
            onClick={saveData}
          >
            Save
          </Button>
          <Button onClick={onCloseHandler}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
