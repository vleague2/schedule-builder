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

import { AddDialog } from "./AddDialog";
import { addStudios } from "../services/studiosService";
import { addTeachers } from "../services/teachersService";
import { addDancers } from "../services/dancersService";

type TDialogOpenType = "studio" | "teacher" | "dancer" | undefined;

export function AppMenu(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(
    undefined
  );
  const [dialogOpenType, setDialogOpenType] =
    useState<TDialogOpenType>(undefined);

  function deriveDialogResource() {
    switch (dialogOpenType) {
      case "studio":
        return addStudios;
      case "teacher":
        return addTeachers;
      case "dancer":
        return addDancers;
      default:
        return undefined;
    }
  }

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
          <Button
            onClick={() => {
              setDialogOpenType("dancer");
              setMenuOpen(false);
            }}
          >
            Add Dancers
          </Button>
          <Button
            onClick={() => {
              setDialogOpenType("teacher");
              setMenuOpen(false);
            }}
          >
            Add Teachers
          </Button>
          <Button>Add Dances</Button>
          <Button
            onClick={() => {
              setDialogOpenType("studio");
              setMenuOpen(false);
            }}
          >
            Add Studios
          </Button>
        </div>
      </Drawer>

      <AddDialog
        open={Boolean(dialogOpenType)}
        onClose={() => setDialogOpenType(undefined)}
        onSuccess={onDialogSuccess}
        resource={deriveDialogResource()}
        dialogType={dialogOpenType}
      />

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
