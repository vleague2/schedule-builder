import { Button, Drawer } from "@material-ui/core";
import { TAdminDialogAction } from "../models/TAdminDialogAction";
import { TAdminDialogType } from "../models/TAdminDialogType";

type TAdminDrawerProps = {
  open: boolean;
  onClose: () => void;
  openDialog: (action: TAdminDialogAction, type: TAdminDialogType) => void;
  openDancerInDanceDialog: (action: "add" | "delete") => void;
};

export function AdminDrawer(props: TAdminDrawerProps) {
  const { open, onClose, openDialog, openDancerInDanceDialog } = props;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ padding: 20, display: "flex", flexDirection: "column" }}>
        <Button onClick={() => openDialog("add", "dancer")}>Add Dancers</Button>
        <Button onClick={() => openDialog("edit", "dancer")}>
          Edit Dancer
        </Button>
        <Button onClick={() => openDialog("delete", "dancer")}>
          Delete Dancer
        </Button>
        <br />
        <Button onClick={() => openDialog("add", "teacher")}>
          Add Teachers
        </Button>
        <Button onClick={() => openDialog("edit", "teacher")}>
          Edit Teacher
        </Button>
        <Button onClick={() => openDialog("delete", "teacher")}>
          Delete Teacher
        </Button>
        <br />
        <Button onClick={() => openDialog("add", "dance")}>Add Dances</Button>
        <Button onClick={() => openDialog("edit", "dance")}>Edit Dance</Button>
        <Button onClick={() => openDialog("delete", "dance")}>
          Delete Dance
        </Button>
        <br />
        <Button onClick={() => openDancerInDanceDialog("add")}>
          Add Dancers to Dance
        </Button>
        <Button onClick={() => openDancerInDanceDialog("delete")}>
          Remove Dancers from Dance
        </Button>
        <br />
        <Button onClick={() => openDialog("add", "studio")}>Add Studios</Button>
        <Button onClick={() => openDialog("edit", "studio")}>
          Edit Studio
        </Button>
        <Button onClick={() => openDialog("delete", "studio")}>
          Delete Studio
        </Button>
      </div>
    </Drawer>
  );
}
