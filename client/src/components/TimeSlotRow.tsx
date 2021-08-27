import { Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { TOccupiedTimeSlots } from "../services/scheduleTimeService";
import { ScheduledDanceCell } from "./ScheduledDanceCell";

type TTimeSlotRowProps = {
  timeSlot: DateTime;
  studios: TStudio[];
  scheduledDances: TScheduledDance[] | undefined;
  dances: TDance[];
  teachers: TTeacher[] | undefined;
  occupiedTimeSlotsPerStudio: TOccupiedTimeSlots;
  editScheduledDance: (
    dance: TScheduledDance,
    modalType: "edit" | "delete"
  ) => void;
};

export function TimeSlotRow(props: TTimeSlotRowProps): JSX.Element {
  const {
    timeSlot,
    studios,
    scheduledDances,
    dances,
    occupiedTimeSlotsPerStudio,
    teachers,
    editScheduledDance,
  } = props;

  return (
    <tr>
      <td>
        <Typography variant="body2">{timeSlot.toFormat("h:mm a")}</Typography>
      </td>
      {studios.map((studio) => {
        if (
          !occupiedTimeSlotsPerStudio[studio.id].slots.includes(
            timeSlot.toFormat("h:mm a")
          )
        ) {
          return (
            <ScheduledDanceCell
              studioId={studio.id}
              scheduledDances={scheduledDances}
              dances={dances}
              timeSlot={timeSlot}
              teachers={teachers}
              key={studio.id}
              editScheduledDance={editScheduledDance}
            />
          );
        }
      })}
    </tr>
  );
}
