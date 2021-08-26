import { IconButton, Snackbar as MuiSnackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { MouseEventHandler, SyntheticEvent } from "react";

type TSnackbarProps = {
  open: boolean;
  onClose: (
    // eslint-disable-next-line
    event: SyntheticEvent<any, Event> | MouseEventHandler<HTMLButtonElement>,
    reason?: string
  ) => void;
  message: string;
};

export function Snackbar(props: TSnackbarProps): JSX.Element {
  const { open, onClose, message } = props;

  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
