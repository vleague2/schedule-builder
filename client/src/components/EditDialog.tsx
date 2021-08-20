import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { MessageBox } from "./MessageBox";
import { updateTeacher } from "../services/teachersService";
import { updateStudio } from "../services/studiosService";
import { updateDancer } from "../services/dancersService";
import { updateDance } from "../services/dancesService";

export type TDialogOpenType =
  | "studio"
  | "teacher"
  | "dancer"
  | "dance"
  | undefined;

type TEditDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TDialogOpenType;
  items: TTeacher[] | TStudio[] | TDancer[] | TDance[];
  // Required if dialogType is "dance"
  teachers?: TTeacher[];
};

export function EditDialog(props: TEditDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, items, teachers } = props;

  const [newValue, setNewValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<number>(0);
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
  const [mixedSuccess, setMixedSuccess] = useState<{
    errors: string[];
    successes: number;
  }>({ errors: [], successes: 0 });

  function buttonIsDisabled() {
    if (dialogType === "dance") {
      return selectValue === 0 || (newValue === "" && selectedTeacher === 0);
    }

    return newValue === "" || selectValue === 0;
  }

  function onCloseHandler() {
    setNewValue("");
    setMixedSuccess({ errors: [], successes: 0 });
    setSelectValue(0);
    onClose();
  }

  async function saveData() {
    setMixedSuccess({ errors: [], successes: 0 });

    let result;

    switch (dialogType) {
      case "studio":
        result = await updateStudio(newValue, selectValue);
        break;
      case "teacher":
        result = await updateTeacher(newValue, selectValue);
        break;
      case "dancer":
        result = await updateDancer(newValue, selectValue);
        break;
      case "dance":
        result = await updateDance(selectValue, newValue, selectedTeacher);
        break;
    }

    if (result === undefined) {
      setMixedSuccess({
        errors: ["You have to select something to edit"],
        successes: 0,
      });
      return;
    }

    if (result.error.length > 0) {
      setMixedSuccess({ errors: result.error, successes: result.data });
      return;
    }

    if (result.data > 0) {
      onSuccess(`Successfully edited ${result.data} ${dialogType}(s)`);
      onCloseHandler();
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
    <Dialog open={open} onClose={() => onCloseHandler()}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Edit existing {dialogType}
        </DialogTitle>
        {mixedSuccess.errors.length > 0 && mixedSuccess.successes > 0 && (
          <MessageBox
            style="success"
            messages={[
              `Successfully added ${mixedSuccess.successes} ${dialogType}(s)`,
            ]}
          />
        )}
        {mixedSuccess.errors.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <MessageBox style="error" messages={mixedSuccess.errors} />
          </div>
        )}
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
              : `Enter new ${dialogType} name (optional)`
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
