import { TextField } from "@material-ui/core";
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
import { Dialog } from "./Dialog";
import { Dropdown } from "./Dropdown";

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
    <Dialog
      open={open}
      onClose={onCloseHandler}
      dialogTitle={`Edit existing ${dialogType}`}
      primaryButtonOnClick={saveData}
      primaryButtonLabel="Save"
      primaryButtonDisabled={buttonIsDisabled()}
    >
      <DialogErrorMessage
        errors={apiResponseState.errors}
        successCount={apiResponseState.successes}
        dialogType={dialogType}
      />
      <Dropdown
        label={`Select the ${dialogType} you want to edit`}
        setValue={(value: string) => setSelectValue(parseInt(value))}
        value={selectValue.toString()}
        dropdownItems={items.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }))}
      />
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
      <br />
      <br />
      {dialogType === "dance" && teachers && (
        <Dropdown
          label="Select a new teacher for this dance (optional)"
          setValue={(value: string) => {
            setSelectedTeacher(parseInt(value));
          }}
          value={selectedTeacher.toString()}
          dropdownItems={teachers.map((teacher) => ({
            label: teacher.name,
            value: teacher.id.toString(),
          }))}
        />
      )}
    </Dialog>
  );
}
