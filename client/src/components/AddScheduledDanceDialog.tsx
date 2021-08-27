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
import { addScheduledDance } from "../services/scheduledDancesService";

type TAddScheduledDanceDialogProps = {
  dance: TDance;
  open: boolean;
  onClose: () => void;
  studios: TStudio[];
};

export function AddScheduledDanceDialog(
  props: TAddScheduledDanceDialogProps
): JSX.Element {
  const { dance, open, onClose, studios } = props;
  const [startAt, setStartAt] = useState<Date | undefined>(
    DateTime.fromObject({ hour: 8 }).toJSDate()
  );
  const [endAt, setEndAt] = useState<Date | undefined>(
    DateTime.fromObject({ hour: 8 }).toJSDate()
  );
  const [studio, setStudio] = useState<number>(0);

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

    resetApiResponseState();

    const apiCall = () => addScheduledDance(startAt, endAt, dance.id, studio);

    await makeApiCall(apiCall, () => {
      onCloseHandler();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Add {dance.name} to the schedule
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
