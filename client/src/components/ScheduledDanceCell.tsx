import { IconButton, Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import { MouseEvent, useState } from "react";

import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TTeacher } from "../models/TTeacher";
import { CastPopover } from "./CastPopover";
import { getScheduledDanceInfo } from "../services/scheduleService";

type TScheduledDanceCell = {
  scheduledDances: TScheduledDance[];
  timeSlot: DateTime;
  studioId: number;
  dances: TDance[];
  teachers: TTeacher[];
  editScheduledDance: (
    dance: TScheduledDance,
    modalType: "edit" | "delete"
  ) => void;
};

export function ScheduledDanceCell(props: TScheduledDanceCell): JSX.Element {
  const {
    scheduledDances,
    timeSlot,
    studioId,
    dances,
    teachers,
    editScheduledDance,
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const formattedTimeSlot = timeSlot.toFormat("h:mm a");

  const scheduledDanceInfo = getScheduledDanceInfo(
    scheduledDances,
    studioId,
    formattedTimeSlot,
    dances,
    teachers
  );

  if (scheduledDanceInfo === undefined) {
    return (
      <td
        key={`${formattedTimeSlot}-${studioId}`}
        style={{ border: "1px solid lightgray" }}
      ></td>
    );
  }

  const { scheduledDance, dance, teacher, step, startAtDate, endAtDate } =
    scheduledDanceInfo;

  return (
    <>
      <td rowSpan={step} key={`${formattedTimeSlot}-${studioId}`}>
        <Typography variant="body2">
          <b>{dance.name}</b>
        </Typography>
        {teacher && (
          <>
            <Typography variant="caption">{teacher.name}</Typography>
            <br />
          </>
        )}
        <Typography variant="caption">
          {startAtDate.toFormat("h:mm a")} - {endAtDate.toFormat("h:mm a")}
        </Typography>
        <br />
        <IconButton
          size="small"
          onClick={handleClick}
          component="button"
          className="iconButton"
        >
          <InfoIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editScheduledDance(scheduledDance, "edit")}
          className="iconButton"
        >
          <EditIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editScheduledDance(scheduledDance, "delete")}
          className="iconButton"
        >
          <CancelIcon style={{ fontSize: 16 }} />
        </IconButton>
        {anchorEl && scheduledDance && (
          <CastPopover
            open={open}
            handleClose={handleClose}
            anchorEl={anchorEl}
            danceId={scheduledDance.DanceId}
          />
        )}
      </td>
    </>
  );
}
