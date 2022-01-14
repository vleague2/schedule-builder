import { TextField } from "@material-ui/core";
import { useState } from "react";
import { Dialog } from "./presentational/Dialog/Dialog";

type TEditScheduleDialogProps = {
  itemName: string;
  open: boolean;
  onClose: () => void;
  onClick: (value: string) => void;
};

export function EditScheduleDialog(
  props: TEditScheduleDialogProps
): JSX.Element {
  const { open, onClose, itemName, onClick } = props;
  const [value, setValue] = useState<string>("");

  function onCloseHandler() {
    setValue("");
    onClose();
  }

  function onClickHandler() {
    onClick(value);
    setValue("");
  }

  return (
    <Dialog
      open={open}
      onClose={onCloseHandler}
      dialogTitle={`Edit ${itemName}`}
      primaryButtonDisabled={value === ""}
      primaryButtonLabel="Save"
      primaryButtonOnClick={onClickHandler}
    >
      <TextField
        variant="outlined"
        label="Enter a new name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Dialog>
  );
}
