import { DateTime } from "luxon";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";

export function getAllTimeslots(): DateTime[] {
  const timeSlots: DateTime[] = [];

  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots.push(
        DateTime.fromObject({
          hour,
          minute,
        })
      );
    }
  }

  return timeSlots;
}

export type TOccupiedTimeSlots = {
  [studioId: number]: {
    slots: string[];
  };
};

export function calculateOccupiedTimeslots(
  studios: TStudio[] | undefined,
  scheduledDances: TScheduledDance[] | undefined
): TOccupiedTimeSlots {
  const occupiedTimeSlotsPerStudio: TOccupiedTimeSlots = {};

  studios?.forEach((studio) => {
    occupiedTimeSlotsPerStudio[studio.id] = {
      slots: [],
    };
  });

  scheduledDances?.forEach((scheduledDance) => {
    const { StudioId, startAt, endAt } = scheduledDance;
    if (!StudioId) {
      return;
    }

    const { hour: startHour, minute: startMinute } = DateTime.fromJSDate(
      new Date(startAt)
    );

    const { hour: endHour, minute: endMinute } = DateTime.fromJSDate(
      new Date(endAt)
    );

    if (startHour === endHour) {
      for (let minute = startMinute + 15; minute < endMinute; minute += 15) {
        occupiedTimeSlotsPerStudio[StudioId].slots.push(
          DateTime.fromObject({
            hour: startHour,
            minute,
          }).toFormat("h:mm a")
        );
      }
    } else {
      for (let hour = startHour; hour <= endHour; hour++) {
        let minute: number = startMinute;

        if (hour > startHour && startMinute > 0) {
          minute = 0;
        }

        // We don't want to block off the first 15 minutes because we need that cell
        // to become the start cell
        if (hour === startHour) {
          minute = minute + 15;
        }

        for (minute; minute < 60; minute += 15) {
          if (hour === endHour && minute >= endMinute) return;

          occupiedTimeSlotsPerStudio[StudioId].slots.push(
            DateTime.fromObject({
              hour,
              minute,
            }).toFormat("h:mm a")
          );
        }
      }
    }
  });

  return occupiedTimeSlotsPerStudio;
}
