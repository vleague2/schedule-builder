import { AppBar, IconButton, Drawer, Toolbar, Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";

export function AppMenu(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          <Button>Add Dancers</Button>
          <Button>Add Teachers</Button>
          <Button>Add Dances</Button>
          <Button>Add Studios</Button>
        </div>
      </Drawer>
    </>
  );
}
