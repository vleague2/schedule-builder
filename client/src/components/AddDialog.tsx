import { Button, ButtonGroup, DialogTitle, TextField } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { useState } from "react";

import { TTeacher } from "../models/TTeacher";
import { addDancers } from "../services/dancersService";
import { addDances } from "../services/dancesService";
import { addStudios } from "../services/studiosService";
import { addTeachers } from "../services/teachersService";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";

type TAddDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TAdminDialogType;
  // Required if dialogType is 'dance'
  teachers?: TTeacher[];
};

export function AddDialog(props: TAddDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, teachers } = props;

  const [value, setValue] = useState<string>("");
  const [teacherSelectValue, setTeacherSelectValue] = useState<number>(0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    if (dialogType === "dance") {
      return teacherSelectValue === 0 || value === "";
    }

    return value === "";
  }

  function onCloseHandler() {
    setValue("");
    resetApiResponseState();
    setTeacherSelectValue(0);
    onClose();
  }

  async function saveData() {
    async function getApiCallBasedOnDialogType() {
      switch (dialogType) {
        case "studio":
          return await addStudios(value);
        case "teacher":
          return await addTeachers(value);
        case "dancer":
          return await addDancers(value);
        case "dance":
          if (teacherSelectValue > 0) {
            return await addDances(value, teacherSelectValue);
          }

          return undefined;
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

  return (
    <Dialog open={open} onClose={() => onCloseHandler()}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>
          Add {dialogType}s to database
        </DialogTitle>
        <DialogErrorMessage
          dialogType={dialogType}
          errors={apiResponseState.errors}
          successCount={apiResponseState.successes}
        />
        {dialogType === "dance" && teachers && (
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Select the teacher of these dances"
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
