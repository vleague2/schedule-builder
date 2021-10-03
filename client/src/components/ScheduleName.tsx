import { IconButton, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

import { TSchedule } from "../models/TSchedule";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useState } from "react";
import { savePdf } from "../services/scheduleService";
import { EditScheduleDialog } from "./EditScheduleDialog";
import { useHttpContext } from "../hooks/httpContext";
import { mapToUpdateScheduleDto } from "../services/mapToDtoService";

type TScheduleNameProps = {
  schedule: TSchedule;
  refetch: () => void;
};

export function ScheduleName(props: TScheduleNameProps): JSX.Element {
  const { schedule, refetch } = props;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const { httpService } = useHttpContext();

  function onDelete(): void {
    httpService.httpDelete("schedules", schedule.id).then(() => {
      setDeleteDialogOpen(false);
      refetch();
    });
  }

  function editSchedule(value: string): void {
    const dto = mapToUpdateScheduleDto(value);

    httpService.httpPatch("schedules", schedule.id, dto).then(() => {
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
        <IconButton size="small" onClick={() => savePdf(schedule.name)}>
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
