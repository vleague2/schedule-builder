import { useState } from "react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { DialogErrorMessage } from "./DialogErrorMessage";
import { Dropdown } from "./Dropdown";
import { Dialog } from "./Dialog";
import { useHttpContext } from "../hooks/httpContext";

type TDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  dialogType: TAdminDialogType;
  items: TTeacher[] | TStudio[] | TDancer[] | TDance[];
};

export function DeleteDialog(props: TDeleteDialogProps): JSX.Element {
  const { open, onClose, onSuccess, dialogType, items } = props;
  const { httpService } = useHttpContext();

  const [selectValue, setSelectValue] = useState<number>(0);

  const { apiResponseState, resetApiResponseState, makeApiCall } =
    useErrorHandling();

  function buttonIsDisabled() {
    return !selectValue;
  }

  function onCloseHandler() {
    resetApiResponseState();
    setSelectValue(0);
    onClose();
  }

  async function saveData() {
    async function getApiCallBasedOnDialogType() {
      if (selectValue === 0 || !dialogType) {
        return;
      }

      switch (dialogType) {
        case "studio":
          return await httpService.httpDelete("studios", selectValue);
        case "teacher":
          return await httpService.httpDelete("teachers", selectValue);
        case "dancer":
          return await httpService.httpDelete("dancers", selectValue);
        case "dance":
          return await httpService.httpDelete("dances", selectValue);
        default:
          return undefined;
      }
    }

    await makeApiCall(getApiCallBasedOnDialogType, (count: number) => {
      onSuccess(`Successfully deleted ${count} ${dialogType}(s)`);
      onCloseHandler();
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onCloseHandler}
      dialogTitle={`Delete a ${dialogType}`}
      primaryButtonOnClick={saveData}
      primaryButtonLabel="Delete"
      primaryButtonDisabled={buttonIsDisabled()}
    >
      <DialogErrorMessage
        errors={apiResponseState.errors}
        successCount={apiResponseState.successes}
        dialogType={dialogType}
      />
      <Dropdown
        label={`Select the ${dialogType} you want to delete`}
        setValue={(value: string) => setSelectValue(parseInt(value))}
        value={selectValue.toString()}
        dropdownItems={items.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }))}
      />
    </Dialog>
  );
}
