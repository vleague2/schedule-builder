import {
  Button,
  ButtonGroup,
  Dialog,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";

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
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <Typography>Edit {itemName}</Typography>
        <br />
        <TextField
          variant="outlined"
          label="Enter a new name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <br />
        <br />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button color="primary" variant="contained" onClick={onClickHandler}>
            Save
          </Button>
          <Button onClick={onCloseHandler}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
