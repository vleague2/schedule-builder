import { IconButton, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";

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

  function onDelete(): void {
    removeSchedule(schedule.id).then(() => {
      setDeleteDialogOpen(false);
      refetch();
    });
  }

  function editSchedule(value: string): void {
    updateSchedule(value, schedule.id).then(() => {
      setEditDialogOpen(false);
      refetch();
    });
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
