import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useState } from "react";
import { TApiResponseDto } from "../models/TApiResponseDto";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { MessageBox } from "./MessageBox";
import { addStudios } from "../services/studiosService";
import { addTeachers } from "../services/teachersService";
import { addDancers } from "../services/dancersService";
import { addDances } from "../services/dancesService";

export type TDialogOpenType =
  | "studio"
  | "teacher"
  | "dancer"
  | "dance"
  | undefined;

type TResourceReturnType = TTeacher | TStudio | TDancer | TDance;

type TAddDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TDialogOpenType;
  // Required if dialogType is 'dance'
  teachers?: TTeacher[];
};

export function AddDialog(props: TAddDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, teachers } = props;

  const [value, setValue] = useState<string>("");
  const [teacherSelectValue, setTeacherSelectValue] = useState<number>(0);
  const [mixedSuccess, setMixedSuccess] = useState<{
    errors: string[];
    successes: TResourceReturnType[];
  }>({ errors: [], successes: [] });

  function onCloseHandler() {
    setValue("");
    setMixedSuccess({ errors: [], successes: [] });
    setTeacherSelectValue(0);
    onClose();
  }

  async function saveData() {
    setMixedSuccess({ errors: [], successes: [] });

    let result;

    switch (dialogType) {
      case "studio":
        result = await addStudios(value);
        break;
      case "teacher":
        result = await addTeachers(value);
        break;
      case "dancer":
        result = await addDancers(value);
        break;
      case "dance":
        if (teacherSelectValue > 0) {
          result = await addDances(value, teacherSelectValue);
        }
        break;
    }

    if (result === undefined) {
      setMixedSuccess({
        errors: ["You have to select a teacher"],
        successes: [],
      });
      return;
    }

    if (result.error.length > 0) {
      setMixedSuccess({ errors: result.error, successes: result.data });
      return;
    }

    if (result.data.length > 0) {
      onSuccess(`Successfully added ${result.data.length} ${dialogType}(s)`);
      onCloseHandler();
    }
  }

  return (
    <Dialog open={open} onClose={() => onCloseHandler()}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Add {dialogType}s to database
        </DialogTitle>
        {mixedSuccess.errors.length > 0 &&
          mixedSuccess.successes.length > 0 && (
            <MessageBox
              style="success"
              messages={[
                `Successfully added ${mixedSuccess.successes.length} ${dialogType}(s)`,
              ]}
            />
          )}
        {mixedSuccess.errors.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <MessageBox style="error" messages={mixedSuccess.errors} />
          </div>
        )}
        {dialogType === "dance" && teachers && (
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Select the teacher of this dance"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTeacherSelectValue(parseInt(event.target.value));
            }}
            style={{ marginBottom: 20 }}
            value={teacherSelectValue}
          >
            <option value={0} selected disabled>
              Select a teacher
            </option>
            {teachers.map((teacher) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </TextField>
        )}
        <TextField
          multiline
          rows={5}
          variant="outlined"
          fullWidth
          label={`Enter ${dialogType} names (comma separated)`}
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
