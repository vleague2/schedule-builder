import { useState } from "react";

import { TTeacher } from "../models/TTeacher";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { Dialog } from "./presentational/Dialog/Dialog";
import { Dropdown } from "./presentational/Dropdown/Dropdown";
import { TextField } from "@material-ui/core";
import { useHttpContext } from "../hooks/httpContext";
import {
  mapToAddDancersDto,
  mapToAddDancesDto,
  mapToAddStudiosDto,
  mapToAddTeachersDto,
} from "../services/mapToDtoService";

export type TAddDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TAdminDialogType;
  teachers: TTeacher[];
};

export function AddDialog(props: TAddDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, teachers } = props;

  const { httpService } = useHttpContext();

  const [value, setValue] = useState<string>("");
  const [teacherSelectValue, setTeacherSelectValue] = useState<number>(teachers[0]?.id ?? 0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    if (dialogType === "dance") {
      return teachers.length === 0 || value === "";
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
        case "studio": {
          const dto = mapToAddStudiosDto(value);
          return await httpService.httpPost("studios", dto);
        }
        case "teacher": {
          const dto = mapToAddTeachersDto(value);
          return await httpService.httpPost("teachers", dto);
        }
        case "dancer": {
          const dto = mapToAddDancersDto(value);
          return await httpService.httpPost("dancers", dto);
        }
        case "dance": {
          if (teachers.length > 0) {
            const dto = mapToAddDancesDto(value, teacherSelectValue);
            return await httpService.httpPost("dances", dto);
          }

          return undefined;
        }
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
      {dialogType === "dance" && (
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
