import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useState } from "react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { deleteTeacher } from "../services/teachersService";
import { deleteStudio } from "../services/studiosService";
import { deleteDancer } from "../services/dancersService";
import { deleteDance } from "../services/dancesService";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";

type TDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TAdminDialogType;
  items: TTeacher[] | TStudio[] | TDancer[] | TDance[];
};

export function DeleteDialog(props: TDeleteDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, items } = props;

  const [selectValue, setSelectValue] = useState<number>(0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    return selectValue === 0;
  }

  function onCloseHandler() {
    resetApiResponseState();
    setSelectValue(0);
    onClose();
  }

  async function saveData() {
    async function getApiCallBasedOnDialogType() {
      switch (dialogType) {
        case "studio":
          return await deleteStudio(selectValue);
        case "teacher":
          return await deleteTeacher(selectValue);
        case "dancer":
          return await deleteDancer(selectValue);
        case "dance":
          return await deleteDance(selectValue);
        default:
          return undefined;
      }
    }

    if (dialogType !== undefined) {
      await makeApiCall(getApiCallBasedOnDialogType, (count: number) => {
        onSuccess(`Successfully deleted ${count} ${dialogType}(s)`);
        onCloseHandler();
      });
    }
  }

  return (
    <Dialog open={open} onClose={onCloseHandler}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Delete a {dialogType}
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
          label={`Select the ${dialogType} you want to delete`}
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
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={saveData}
            disabled={buttonIsDisabled()}
          >
            Delete
          </Button>
          <Button onClick={onCloseHandler}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
