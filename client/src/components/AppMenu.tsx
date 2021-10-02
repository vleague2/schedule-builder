import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { MouseEventHandler, useState, SyntheticEvent } from "react";

import { AddDialog } from "./AddDialog";
import { TTeacher } from "../models/TTeacher";
import { TDancer } from "../models/TDancer";
import { TDance } from "../models/TDance";
import { TStudio } from "../models/TStudio";
import { EditDialog } from "./EditDialog";
import { TAdminDialogType } from "../models/TAdminDialogType";
import { TAdminDialogAction } from "../models/TAdminDialogAction";
import { AdminDrawer } from "./AdminDrawer";
import { Snackbar } from "./Snackbar";
import { DeleteDialog } from "./DeleteDialog";
import { DancerInDanceDialog } from "./DancerInDanceDialog";

type TAppMenuProps = {
  state: {
    teachers: TTeacher[];
    dancers: TDancer[];
    dances: TDance[];
    studios: TStudio[];
  };
  refetch: {
    teachers: () => void;
    studios: () => void;
    dancers: () => void;
    dances: () => void;
  };
};

export function AppMenu(props: TAppMenuProps): JSX.Element {
  const { state, refetch } = props;

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState<{
    action: TAdminDialogAction | undefined;
    type: TAdminDialogType | undefined;
  }>({ action: undefined, type: undefined });

  const [dancerInDanceDialogOpen, setDancerInDanceDialogOpen] = useState<
    "add" | "delete" | undefined
  >(undefined);

  function handleSnackbarClose(
    // eslint-disable-next-line
    event: SyntheticEvent<any, Event> | MouseEventHandler<HTMLButtonElement>,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarMessage(undefined);
  }

  function onDialogSuccess(message: string): void {
    setSnackbarMessage(message);
  }

  function openDialog(
    action: TAdminDialogAction,
    type: TAdminDialogType
  ): void {
    setDialogOpen({ action, type });
    setMenuOpen(false);
  }

  function openDancerInDanceDialog(action: "add" | "delete"): void {
    setDancerInDanceDialogOpen(action);
    setMenuOpen(false);
  }

  function closeDialog(): void {
    switch (dialogOpen.type) {
      case "teacher":
        refetch.teachers();
        break;
      case "studio":
        refetch.studios();
        break;
      case "dancer":
        refetch.dancers();
        break;
      case "dance":
        refetch.dances();
        break;
    }

    setDialogOpen({ action: undefined, type: undefined });
    setDancerInDanceDialogOpen(undefined);
  }

  const mapDialogTypeToState = {
    teacher: state.teachers,
    dance: state.dances,
    dancer: state.dancers,
    studio: state.studios,
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" style={{ marginLeft: 20 }}>
            Saturday Schedule Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <AdminDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        openDialog={openDialog}
        openDancerInDanceDialog={openDancerInDanceDialog}
      />

      {dialogOpen.type !== undefined && (
        <AddDialog
          open={dialogOpen.action === "add"}
          onClose={closeDialog}
          onSuccess={onDialogSuccess}
          dialogType={dialogOpen.type}
          teachers={state.teachers}
        />
      )}

      {dialogOpen.type !== undefined && (
        <EditDialog
          open={dialogOpen.action === "edit"}
          onClose={closeDialog}
          onSuccess={onDialogSuccess}
          dialogType={dialogOpen.type}
          items={mapDialogTypeToState[dialogOpen.type]}
          teachers={state.teachers}
        />
      )}

      {dialogOpen.type !== undefined && (
        <DeleteDialog
          open={dialogOpen.action === "delete"}
          onClose={closeDialog}
          onSuccess={onDialogSuccess}
          dialogType={dialogOpen.type}
          items={mapDialogTypeToState[dialogOpen.type]}
        />
      )}

      {dancerInDanceDialogOpen !== undefined && (
        <DancerInDanceDialog
          open={true}
          onClose={closeDialog}
          onSuccess={onDialogSuccess}
          dances={state.dances}
          dancers={state.dancers}
          dialogAction={dancerInDanceDialogOpen}
        />
      )}

      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </>
  );
}
