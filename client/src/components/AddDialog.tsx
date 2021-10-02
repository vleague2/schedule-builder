import { useState } from "react";
import { useOktaAuth } from "@okta/okta-react";

import { TTeacher } from "../models/TTeacher";
import { addDancers } from "../services/dancersService";
import { addDances } from "../services/dancesService";
import { addStudios } from "../services/studiosService";
import { addTeachers } from "../services/teachersService";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { Dialog } from "./Dialog";
import { Dropdown } from "./Dropdown";
import { TextField } from "@material-ui/core";

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
  const { authState } = useOktaAuth();
  const accessToken = authState?.accessToken;

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
          return await addStudios(value, accessToken);
        case "teacher":
          return await addTeachers(value, accessToken);
        case "dancer":
          return await addDancers(value, accessToken);
        case "dance":
          if (teacherSelectValue > 0) {
            return await addDances(value, teacherSelectValue, accessToken);
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
    <Dialog
      open={open}
      onClose={onCloseHandler}
      dialogTitle={`Add ${dialogType}s to database`}
      primaryButtonDisabled={buttonIsDisabled()}
      primaryButtonLabel="Save"
      primaryButtonOnClick={saveData}
    >
      <DialogErrorMessage
        dialogType={dialogType}
        errors={apiResponseState.errors}
        successCount={apiResponseState.successes}
      />
      {dialogType === "dance" && teachers && (
        <Dropdown
          label="Select the teacher of these dances"
          setValue={(value: string) => setTeacherSelectValue(parseInt(value))}
          value={teacherSelectValue.toString()}
          dropdownItems={teachers.map((teacher) => ({
            value: teacher.id.toString(),
            label: teacher.name,
          }))}
        />
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
    </Dialog>
  );
}
