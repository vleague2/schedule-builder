import { IconButton, Popover, Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import { MouseEvent, useEffect, useState } from "react";

import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TTeacher } from "../models/TTeacher";
import { TDancer } from "../models/TDancer";
import { getDancersInDance } from "../resources/dancesResource";
import { CastPopover } from "./CastPopover";

type TScheduledDanceCell = {
  scheduledDances: TScheduledDance[] | undefined;
  timeSlot: DateTime;
  studioId: number;
  dances: TDance[];
  teachers: TTeacher[] | undefined;
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

  // eslint-disable-next-line
  function handleClick(event: any) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  const formattedTimeSlot = timeSlot.toFormat("h:mm a");

  const scheduledDance = scheduledDances?.find((sDance) => {
    const formattedStartDate = DateTime.fromJSDate(
      new Date(sDance.startAt)
    ).toFormat("h:mm a");

    return (
      sDance.StudioId === studioId && formattedStartDate === formattedTimeSlot
    );
  });

  if (scheduledDance === undefined) {
    return (
      <td
        key={`${formattedTimeSlot}-${studioId}`}
        style={{ border: "1px solid lightgray" }}
      ></td>
    );
  }

  const dance = dances.find((dance) => dance.id === scheduledDance.DanceId);

  if (!dance) {
    return (
      <td
        key={`${formattedTimeSlot}-${studioId}`}
        style={{ border: "1px solid lightgray" }}
      ></td>
    );
  }
  const teacher = teachers?.find((t) => t.id === dance.TeacherId);

  const startAtDate = DateTime.fromJSDate(new Date(scheduledDance.startAt));

  const endAtDate = DateTime.fromJSDate(new Date(scheduledDance.endAt));

  const duration = endAtDate.diff(startAtDate, "minutes");

  const step = duration.minutes / 15;

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
        <IconButton size="small" onClick={handleClick} component="button">
          <InfoIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editScheduledDance(scheduledDance, "edit")}
        >
          <EditIcon style={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editScheduledDance(scheduledDance, "delete")}
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
