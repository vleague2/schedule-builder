import { DateTime } from "luxon";
import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TOccupiedTimeSlots } from "../services/scheduleTimeService";
import { ScheduledDanceCell } from "./ScheduledDanceCell";

type TTimeSlotRowProps = {
  timeSlot: DateTime;
  studios: TStudio[];
  scheduledDances: TScheduledDance[] | undefined;
  dances: TDance[];
  occupiedTimeSlotsPerStudio: TOccupiedTimeSlots;
};

export function TimeSlotRow(props: TTimeSlotRowProps): JSX.Element {
  const {
    timeSlot,
    studios,
    scheduledDances,
    dances,
    occupiedTimeSlotsPerStudio,
  } = props;

  return (
    <tr>
      <td>{timeSlot.toFormat("h:mm a")}</td>
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
              key={studio.id}
            />
          );
        }
      })}
    </tr>
  );
}
