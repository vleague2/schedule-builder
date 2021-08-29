import { Button, ButtonGroup, Dialog, Typography } from "@material-ui/core";

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
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <Typography>Are you sure you want to remove {itemName}?</Typography>
        <br />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button color="primary" variant="contained" onClick={onClick}>
            Yes
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
