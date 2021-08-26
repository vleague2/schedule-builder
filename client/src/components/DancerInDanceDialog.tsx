import {
  Button,
  ButtonGroup,
  Checkbox,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import {
  addDancersToDance,
  getDancersInDance,
  removeDancersFromDance,
} from "../services/dancesService";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { TAdminDialogAction } from "../models/TAdminDialogAction";

type TDancerInDanceDialogProps = {
  open: boolean;
  dialogAction: TAdminDialogAction;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dances: TDance[];
  dancers: TDancer[];
};

export function DancerInDanceDialog(
  props: TDancerInDanceDialogProps
): JSX.Element {
  const { open, dialogAction, onClose, onSuccess, dances, dancers } = props;

  const [selectedDance, setSelectedDance] = useState<number>(0);
  const [selectedDancers, setSelectedDancers] = useState<number[]>([]);

  const [dancersInDance, setDancersInDance] = useState<TDancer[]>([]);

  const dancersNotInDance = dancers.filter((dancer) => {
    return !dancersInDance.find(
      (dancerInDance) => dancer.id === dancerInDance.id
    );
  });

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    return selectedDance === 0 || selectedDancers.length === 0;
  }

  function onCloseHandler() {
    resetApiResponseState();
    setSelectedDance(0);
    setSelectedDancers([]);
    onClose();
  }

  async function saveData() {
    async function getApiCallBasedOnDialogType() {
      if (dialogAction === "add") {
        return addDancersToDance(selectedDance, selectedDancers);
      }

      if (dialogAction === "delete") {
        return removeDancersFromDance(selectedDance, selectedDancers);
      }
    }

    await makeApiCall(getApiCallBasedOnDialogType, (count: number) => {
      const verb = dialogAction === "add" ? "added" : "removed";
      onSuccess(`Successfully ${verb} ${count} dancers`);
      onCloseHandler();
    });
  }

  function onCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    if (checked) {
      setSelectedDancers((prevState) => [
        ...prevState,
        parseInt(event.target.value),
      ]);
    } else {
      setSelectedDancers((prevState) =>
        prevState.filter((number) => number !== parseInt(event.target.value))
      );
    }
  }

  useEffect(() => {
    if (selectedDance > 0) {
      getDancersInDance(selectedDance).then((dancersResponse) => {
        setDancersInDance(
          dancersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
        );
      });
    }
  }, [selectedDance]);

  return (
    <Dialog open={open} onClose={onCloseHandler}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          {dialogAction === "add"
            ? "Add dancers to a dance"
            : "Remove dancers from a dance"}
        </DialogTitle>
        <DialogErrorMessage
          errors={apiResponseState.errors}
          successCount={apiResponseState.successes}
          dialogType="dancer"
        />
        <TextField
          select
          fullWidth
          variant="outlined"
          label="Select the dance you want to modify"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedDance(parseInt(event.target.value));
          }}
          style={{ marginBottom: 20 }}
          value={selectedDance}
        >
          <option value={0} selected disabled>
            Select a dance
          </option>
          {dances.map((dance) => (
            <option value={dance.id} key={dance.id}>
              {dance.name}
            </option>
          ))}
        </TextField>
        {selectedDance > 0 && (
          <>
            {dialogAction === "add" && (
              <>
                <Typography>Current cast:</Typography>
                <Typography style={{ fontSize: 14 }}>
                  {dancersInDance.map((dancerInDance) => (
                    <span key={dancerInDance.name}>{dancerInDance.name}, </span>
                  ))}
                </Typography>
                <br />
              </>
            )}
            <Typography>
              Choose what dancers to{" "}
              {dialogAction === "add" ? dialogAction : "remove"}:
            </Typography>
            {dialogAction === "add" &&
              dancersNotInDance.map((dancerNotInDance) => (
                <FormControlLabel
                  key={dancerNotInDance.name}
                  control={
                    <Checkbox
                      onChange={onCheckboxChange}
                      value={dancerNotInDance.id}
                    />
                  }
                  label={dancerNotInDance.name}
                />
              ))}
            {dialogAction === "delete" &&
              dancersInDance.map((dancerInDance) => (
                <FormControlLabel
                  key={dancerInDance.name}
                  control={
                    <Checkbox
                      onChange={onCheckboxChange}
                      value={dancerInDance.id}
                    />
                  }
                  label={dancerInDance.name}
                />
              ))}
          </>
        )}
        <br />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={saveData}
            disabled={buttonIsDisabled()}
          >
            {dialogAction === "add" ? "Save" : "Delete"}
          </Button>
          <Button onClick={onCloseHandler}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
