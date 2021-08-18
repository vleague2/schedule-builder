import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useState } from "react";
import { TDancer } from "../models/TDancer";
import { addDancers } from "../services/dancersService";
import { MessageBox } from "./MessageBox";

type TAddDancersDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export function AddDancersDialog(props: TAddDancersDialogProps): JSX.Element {
  const { open, onClose, onSuccess } = props;

  const [value, setValue] = useState<string>("");
  const [mixedSuccess, setMixedSuccess] = useState<{
    errors: string[] | undefined;
    successes: TDancer[] | undefined;
  }>({ errors: undefined, successes: undefined });

  function onCloseHandler() {
    setValue("");
    setMixedSuccess({ errors: undefined, successes: undefined });
    onClose();
  }

  async function saveData() {
    setMixedSuccess({ errors: undefined, successes: undefined });

    const result = await addDancers(value);

    console.log(result);

    if (result.error && result.error.length > 0) {
      setMixedSuccess({ errors: result.error, successes: result.data });
      return;
    }

    if (result.data) {
      onSuccess(`Successfully added ${result.data.length} dancers`);
      onCloseHandler();
    }
  }

  return (
    <Dialog open={open} onClose={() => onCloseHandler()}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Add Dancers to Database
        </DialogTitle>
        {mixedSuccess.errors &&
          mixedSuccess.successes &&
          mixedSuccess.successes.length > 0 && (
            <MessageBox
              style="success"
              messages={[
                `Successfully added ${mixedSuccess.successes.length} dancers`,
              ]}
            />
          )}
        {mixedSuccess.errors && (
          <div style={{ marginBottom: 30 }}>
            <MessageBox style="error" messages={mixedSuccess.errors} />
          </div>
        )}
        <TextField
          multiline
          rows={5}
          variant="outlined"
          fullWidth
          label="Enter dancer names (comma separated)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => saveData()}
          >
            Save
          </Button>
          <Button onClick={() => onCloseHandler()}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
