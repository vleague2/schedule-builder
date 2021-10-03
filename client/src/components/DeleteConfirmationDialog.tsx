import { Dialog } from "./Dialog";

type TDeleteScheduledDanceDialogProps = {
  itemName: string;
  open: boolean;
  onClose: () => void;
  onClick: () => void;
};

export function DeleteConfirmationDialog(
  props: TDeleteScheduledDanceDialogProps
): JSX.Element {
  const { open, onClose, itemName, onClick } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dialogTitle={`Are you sure you want to remove ${itemName}?`}
      primaryButtonOnClick={onClick}
      primaryButtonLabel="Yes"
      primaryButtonDisabled={false}
    />
  );
}
