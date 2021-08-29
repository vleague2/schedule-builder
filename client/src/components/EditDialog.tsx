import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { updateTeacher } from "../services/teachersService";
import { updateStudio } from "../services/studiosService";
import { updateDancer } from "../services/dancersService";
import { updateDance } from "../services/dancesService";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";

type TEditDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TAdminDialogType;
  items: TTeacher[] | TStudio[] | TDancer[] | TDance[];
  // Required if dialogType is "dance"
  teachers?: TTeacher[];
};

export function EditDialog(props: TEditDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, items, teachers } = props;
  const { authState } = useOktaAuth();
  const accessToken = authState?.accessToken;

  const [newValue, setNewValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    if (dialogType === "dance") {
      return selectValue === 0 || (newValue === "" && selectedTeacher === 0);
    }

    return newValue === "" || selectValue === 0;
  }

  function onCloseHandler() {
    setNewValue("");
    resetApiResponseState();
    setSelectValue(0);
    onClose();
  }

  async function saveData() {
    async function getApiCallBasedOnDialogType() {
      switch (dialogType) {
        case "studio":
          return await updateStudio(newValue, selectValue, accessToken);
        case "teacher":
          return await updateTeacher(newValue, selectValue, accessToken);
        case "dancer":
          return await updateDancer(newValue, selectValue, accessToken);
        case "dance":
          return await updateDance(
            selectValue,
            accessToken,
            newValue,
            selectedTeacher
          );
        default:
          return undefined;
      }
    }

    if (dialogType !== undefined) {
      await makeApiCall(getApiCallBasedOnDialogType, (count: number) => {
        onSuccess(`Successfully added ${count} ${dialogType}(s)`);
        onCloseHandler();
      });
    }
  }

  useEffect(() => {
    const selectedItem = items.find((item) => item.id === selectValue);

    if (selectedItem) {
      setNewValue(selectedItem.name);
    }

    if (dialogType === "dance" && selectedItem) {
      setSelectedTeacher((selectedItem as TDance).TeacherId);
    }
  }, [selectValue]);

  return (
    <Dialog open={open} onClose={onCloseHandler}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Edit existing {dialogType}
        </DialogTitle>
        <DialogErrorMessage
          errors={apiResponseState.errors}
          successCount={apiResponseState.successes}
          dialogType={dialogType}
        />
        <TextField
          select
          fullWidth
          variant="outlined"
          label={`Select the ${dialogType} you want to edit`}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectValue(parseInt(event.target.value));
          }}
          style={{ marginBottom: 20 }}
          value={selectValue}
        >
          <option value={0} selected disabled>
            Select a {dialogType}
          </option>
          {items.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          fullWidth
          label={
            dialogType === "dance"
              ? `Enter new ${dialogType} name (optional)`
              : `Enter new ${dialogType} name`
          }
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        {dialogType === "dance" && teachers && (
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Select a new teacher for this dance (optional)"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedTeacher(parseInt(event.target.value));
            }}
            style={{ marginBottom: 20, marginTop: 20 }}
            value={selectedTeacher}
          >
            {teachers.map((teacher) => (
              <option
                value={teacher.id}
                key={teacher.id}
                selected={teacher.id === selectedTeacher}
              >
                {teacher.name}
              </option>
            ))}
          </TextField>
        )}
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={saveData}
            disabled={buttonIsDisabled()}
          >
            Save
          </Button>
          <Button onClick={onCloseHandler}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
