import { Button, Drawer } from "@material-ui/core";
import { TAdminDialogAction } from "../models/TAdminDialogAction";
import { TAdminDialogType } from "../models/TAdminDialogType";

type TAdminDrawerProps = {
  open: boolean;
  onClose: () => void;
  openDialog: (action: TAdminDialogAction, type: TAdminDialogType) => void;
};

export function AdminDrawer(props: TAdminDrawerProps) {
  const { open, onClose, openDialog } = props;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ padding: 20, display: "flex", flexDirection: "column" }}>
        <Button onClick={() => openDialog("add", "dancer")}>Add Dancers</Button>
        <Button onClick={() => openDialog("edit", "dancer")}>
          Edit Dancer
        </Button>
        <br />
        <Button onClick={() => openDialog("add", "teacher")}>
          Add Teachers
        </Button>
        <Button onClick={() => openDialog("edit", "teacher")}>
          Edit Teacher
        </Button>
        <br />
        <Button onClick={() => openDialog("add", "dance")}>Add Dances</Button>
        <Button onClick={() => openDialog("edit", "dance")}>Edit Dance</Button>
        <br />
        <Button onClick={() => openDialog("add", "studio")}>Add Studios</Button>
        <Button onClick={() => openDialog("edit", "studio")}>
          Edit Studio
        </Button>
      </div>
    </Drawer>
  );
}
