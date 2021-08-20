import {
  AppBar,
  IconButton,
  Drawer,
  Toolbar,
  Button,
  Typography,
  Snackbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { MouseEventHandler, useState, SyntheticEvent } from "react";

import { AddDialog, TDialogOpenType } from "./AddDialog";
import { useEffect } from "react";
import { TTeacher } from "../models/TTeacher";
import { getAllTeachers } from "../services/teachersService";
import { TDancer } from "../models/TDancer";
import { TDance } from "../models/TDance";
import { TStudio } from "../models/TStudio";
import { EditDialog } from "./EditDialog";

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
    action: "add" | "edit" | undefined;
    type: TDialogOpenType;
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

  function openDialog(action: "edit" | "add", type: TDialogOpenType): void {
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
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          <Button onClick={() => openDialog("add", "dancer")}>
            Add Dancers
          </Button>
          <Button onClick={() => openDialog("edit", "dancer")}>
            Edit Dancer
          </Button>
          <Button onClick={() => openDialog("add", "teacher")}>
            Add Teachers
          </Button>
          <Button onClick={() => openDialog("edit", "teacher")}>
            Edit Teacher
          </Button>
          <Button onClick={() => openDialog("add", "dance")}>Add Dances</Button>
          <Button onClick={() => openDialog("edit", "dance")}>
            Edit Dance
          </Button>
          <Button onClick={() => openDialog("add", "studio")}>
            Add Studios
          </Button>
          <Button onClick={() => openDialog("edit", "studio")}>
            Edit Studio
          </Button>
        </div>
      </Drawer>

      <AddDialog
        open={dialogOpen.action === "add"}
        onClose={closeDialog}
        onSuccess={onDialogSuccess}
        dialogType={dialogOpen.type}
        teachers={state.teachers}
      />

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

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}
