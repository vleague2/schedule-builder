import { Button, ButtonGroup, Dialog, Typography } from "@material-ui/core";
import { removeScheduledDance } from "../services/scheduledDancesService";

type TDeleteScheduledDanceDialogProps = {
  scheduledDanceId: number;
  scheduledDanceName: string;
  open: boolean;
  onClose: () => void;
};

export function DeleteScheduledDanceDialog(
  props: TDeleteScheduledDanceDialogProps
): JSX.Element {
  const { scheduledDanceId, open, onClose, scheduledDanceName } = props;

  function saveData() {
    removeScheduledDance(scheduledDanceId).then(() => {
      onClose();
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <Typography>
          Are you sure you want to remove {scheduledDanceName} from the
          schedule?
        </Typography>
        <br />
        <ButtonGroup style={{ marginTop: 30 }}>
          <Button color="primary" variant="contained" onClick={saveData}>
            Yes
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
