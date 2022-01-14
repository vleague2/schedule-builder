import {
  Button,
  ButtonGroup,
  DialogTitle,
  Dialog as MuiDialog,
} from "@material-ui/core";

export type TDialogProps = {
  open: boolean;
  onClose: () => void;
  dialogTitle: string;
  children?: React.ReactNode;
  primaryButtonOnClick: () => void;
  primaryButtonLabel: string;
  primaryButtonDisabled: boolean;
};

export function Dialog(props: TDialogProps): JSX.Element {
  const {
    open,
    onClose,
    children,
    primaryButtonOnClick,
    primaryButtonDisabled,
    primaryButtonLabel,
    dialogTitle,
  } = props;

  return (
    <MuiDialog open={open} onClose={onClose}>
      <div style={{ padding: 40, width: 600 }}>
        <DialogTitle style={{ marginBottom: 15 }}>{dialogTitle}</DialogTitle>
        {children}
        <ButtonGroup style={{ marginTop: 30, display: "block" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={primaryButtonOnClick}
            disabled={primaryButtonDisabled}
          >
            {primaryButtonLabel}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </div>
    </MuiDialog>
  );
}
