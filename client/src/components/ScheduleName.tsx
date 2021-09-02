import { IconButton, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { useOktaAuth } from "@okta/okta-react";

import { TSchedule } from "../models/TSchedule";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useState } from "react";
import { removeSchedule, updateSchedule } from "../services/scheduleService";
import { EditScheduleDialog } from "./EditScheduleDialog";

type TScheduleNameProps = {
  schedule: TSchedule;
  refetch: () => void;
};

export function ScheduleName(props: TScheduleNameProps): JSX.Element {
  const { schedule, refetch } = props;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const { authState } = useOktaAuth();
  const accessToken = authState?.accessToken;

  function onDelete(): void {
    removeSchedule(schedule.id, accessToken).then(() => {
      setDeleteDialogOpen(false);
      refetch();
    });
  }

  function editSchedule(value: string): void {
    updateSchedule(value, schedule.id, accessToken).then(() => {
      setEditDialogOpen(false);
      refetch();
    });
  }

  function savePdf() {
    const printMe = window.open("") as Window;
    printMe.document.write(
      `<html><head><style>th,
      tr,
      td {
        border: 1px solid gray;
      }</style></head><body><h1 style="text-align: center">${
        schedule.name
      }</h1>${document.getElementById("tableDiv")?.innerHTML}</body></html>`
    );

    const iconButtons = printMe.document.querySelectorAll(".iconButton");

    const iconButtonsArray = Array.from(iconButtons);

    iconButtonsArray.forEach((iconButton) => iconButton.remove());

    printMe.print();
    printMe.close();

    return true;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          component="p"
          align="center"
          style={{ marginRight: 10 }}
        >
          {schedule.name}
        </Typography>
        <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
          <EditIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" onClick={() => setDeleteDialogOpen(true)}>
          <CancelIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" onClick={() => savePdf()}>
          <SaveAltIcon style={{ fontSize: 16 }} />
        </IconButton>
      </div>
      <EditScheduleDialog
        itemName={schedule.name}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onClick={editSchedule}
      />
      <DeleteConfirmationDialog
        itemName={schedule.name}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onClick={onDelete}
      />
    </>
  );
}
