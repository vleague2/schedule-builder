import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { TAdminDialogAction } from "../models/TAdminDialogAction";
import { Dialog } from "./Dialog";
import { Dropdown } from "./Dropdown";
import { useHttpContext } from "../hooks/httpContext";

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
  const { httpService } = useHttpContext();

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
      const requestType = dialogAction === "add" ? "POST" : "DELETE";

      return httpService.httpDancersInDance(requestType, {
        danceId: selectedDance,
        dancerIds: selectedDancers,
      });
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
      httpService
        .httpDancersInDance("GET", { danceId: selectedDance })
        .then((dancersResponse) => {
          setDancersInDance(
            dancersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
          );
        });
    }
  }, [selectedDance]);

  return (
    <Dialog
      open={open}
      onClose={onCloseHandler}
      dialogTitle={
        dialogAction === "add"
          ? "Add dancers to a dance"
          : "Remove dancers from a dance"
      }
      primaryButtonLabel={dialogAction === "add" ? "Save" : "Remove"}
      primaryButtonDisabled={buttonIsDisabled()}
      primaryButtonOnClick={saveData}
    >
      <DialogErrorMessage
        errors={apiResponseState.errors}
        successCount={apiResponseState.successes}
        dialogType="dancer"
      />
      <Dropdown
        label="Select the dance you want to modify"
        setValue={(value: string) => setSelectedDance(parseInt(value))}
        value={selectedDance.toString()}
        dropdownItems={dances.map((dance) => ({
          label: dance.name,
          value: dance.id.toString(),
        }))}
      />
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
    </Dialog>
  );
}
