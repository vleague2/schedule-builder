import { DateTime } from "luxon";
import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";

type TScheduledDanceCell = {
  scheduledDances: TScheduledDance[] | undefined;
  timeSlot: DateTime;
  studioId: number;
  dances: TDance[];
};

export function ScheduledDanceCell(props: TScheduledDanceCell): JSX.Element {
  const { scheduledDances, timeSlot, studioId, dances } = props;

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

  const startAtDate = DateTime.fromJSDate(new Date(scheduledDance.startAt));

  const endAtDate = DateTime.fromJSDate(new Date(scheduledDance.endAt));

  const duration = endAtDate.diff(startAtDate, "minutes");

  const step = duration.minutes / 15;

  return (
    <td rowSpan={step} key={`${formattedTimeSlot}-${studioId}`}>
      {dance?.name}
    </td>
  );
}
