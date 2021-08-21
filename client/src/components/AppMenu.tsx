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

type TAppMenuProps = {
  state: {
    teachers: TTeacher[] | undefined;
    dancers: TDancer[] | undefined;
    dances: TDance[] | undefined;
    studios: TStudio[] | undefined;
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
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState<{
    action: TAdminDialogAction | undefined;
    type: TAdminDialogType | undefined;
  }>({ action: undefined, type: undefined });

  function handleSnackbarClose(
    event: SyntheticEvent<any, Event> | MouseEventHandler<HTMLButtonElement>,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  }

  function onDialogSuccess(message: string): void {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function openDialog(
    action: TAdminDialogAction,
    type: TAdminDialogType
  ): void {
    setDialogOpen({ action, type });
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
          items={mapDialogTypeToState[dialogOpen.type] ?? []}
          teachers={state.teachers}
        />
      )}

      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleSnackbarClose}
        />
      )}
    </>
  );
}
