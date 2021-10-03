import { AccessToken } from "@okta/okta-auth-js";
import { DateTime } from "luxon";
import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { getDancersInDance } from "./dancesService";

type TScheduledDancePartial = Pick<
  TScheduledDance,
  "StudioId" | "endAt" | "startAt" | "DanceId"
>;

export function savePdf(scheduleName: string): boolean {
  const printMe = window.open("") as Window;
  printMe.document.write(
    `<html><head><style>th,
    tr,
    td {
      border: 1px solid gray;
    }</style></head><body><h1 style="text-align: center">${scheduleName}</h1>${
      document.getElementById("tableDiv")?.innerHTML
    }</body></html>`
  );

  const iconButtons = printMe.document.querySelectorAll(".iconButton");

  const iconButtonsArray = Array.from(iconButtons);

  iconButtonsArray.forEach((iconButton) => iconButton.remove());

  printMe.print();
  printMe.close();

  return true;
}

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

export function getScheduledDanceInfo(
  scheduledDances: TScheduledDance[],
  studioId: number,
  formattedTimeSlot: string,
  dances: TDance[],
  teachers: TTeacher[]
):
  | {
      scheduledDance: TScheduledDance;
      dance: TDance;
      teacher: TTeacher | undefined;
      step: number;
      startAtDate: DateTime;
      endAtDate: DateTime;
    }
  | undefined {
  const scheduledDance = scheduledDances.find((sDance) => {
    const formattedStartDate = DateTime.fromJSDate(
      new Date(sDance.startAt)
    ).toFormat("h:mm a");

    return (
      sDance.StudioId === studioId && formattedStartDate === formattedTimeSlot
    );
  });

  if (scheduledDance === undefined) {
    return undefined;
  }

  const dance = dances.find((dance) => dance.id === scheduledDance.DanceId);

  if (!dance) {
    return undefined;
  }

  const teacher = teachers.find((t) => t.id === dance.TeacherId);

  const startAtDate = DateTime.fromJSDate(new Date(scheduledDance.startAt));

  const endAtDate = DateTime.fromJSDate(new Date(scheduledDance.endAt));

  const duration = endAtDate.diff(startAtDate, "minutes");

  const step = duration.minutes / 15;

  return {
    scheduledDance,
    dance,
    teacher,
    step,
    startAtDate,
    endAtDate,
  };
}

function isScheduledDance(
  dance: TScheduledDancePartial | TScheduledDance
): dance is TScheduledDance {
  return (dance as TScheduledDance).id !== undefined;
}

export async function valiateScheduledDance(
  scheduledDance: TScheduledDancePartial | TScheduledDance,
  scheduledDances: TScheduledDance[],
  dances: TDance[],
  scheduleId: number,
  teacherId: number,
  accessToken: AccessToken | undefined
): Promise<string[]> {
  const { StudioId } = scheduledDance;

  const { startStamp, endStamp } = getStartAndEndStamp(scheduledDance);

  const scheduledDancesFiltered = isScheduledDance(scheduledDance)
    ? scheduledDances.filter((dance) => dance.id !== scheduledDance.id)
    : scheduledDances;

  const dancesAtSameTimeErrors = getDancesAtSameTimeInSameStudio(
    scheduledDancesFiltered,
    StudioId,
    startStamp,
    endStamp,
    scheduleId
  );

  const dancersDoubleBookedErrors =
    await getDancersAndTeachersWhoAreDoubleBooked(
      scheduledDancesFiltered,
      scheduledDance,
      scheduleId,
      teacherId,
      dances,
      accessToken
    );

  return [...dancesAtSameTimeErrors, ...dancersDoubleBookedErrors];
}

function getDancesAtSameTimeInSameStudio(
  scheduledDances: TScheduledDance[],
  studioId: number,
  startStamp: number,
  endStamp: number,
  scheduleId: number
): string[] {
  const errors: string[] = [];

  const dancesInSameStudio = scheduledDances.filter(
    (dance) => dance.StudioId === studioId && scheduleId === dance.ScheduleId
  );

  dancesInSameStudio.forEach((danceInSameStudio) => {
    const {
      startStamp: danceInSameStudioStartStamp,
      endStamp: danceInSameStudioEndStamp,
    } = getStartAndEndStamp(danceInSameStudio);

    if (
      dancesAreScheduledAtSameTime(
        startStamp,
        endStamp,
        danceInSameStudioStartStamp,
        danceInSameStudioEndStamp
      )
    ) {
      errors.push(
        "There is already another dance scheduled in this studio during this timeslot. Try a different time."
      );
    }
  });

  return errors;
}

function dancesAreScheduledAtSameTime(
  dance1StartStamp: number,
  dance1EndStamp: number,
  dance2StartStamp: number,
  dance2EndStamp: number
) {
  return (
    (dance1StartStamp <= dance2StartStamp &&
      dance1EndStamp > dance2StartStamp) ||
    (dance1StartStamp >= dance2StartStamp && dance1StartStamp < dance2EndStamp)
  );
}

function getStartAndEndStamp(
  scheduledDance: TScheduledDance | TScheduledDancePartial
): {
  startStamp: number;
  endStamp: number;
} {
  const { hour: startAtHour, minute: startAtMinute } = DateTime.fromJSDate(
    new Date(scheduledDance.startAt)
  );
  const { hour: endAtHour, minute: endAtMinute } = DateTime.fromJSDate(
    new Date(scheduledDance.endAt)
  );
  const startStamp = startAtHour * 60 + startAtMinute;
  const endStamp = endAtHour * 60 + endAtMinute;

  return { startStamp, endStamp };
}

async function getDancersAndTeachersWhoAreDoubleBooked(
  scheduledDances: TScheduledDance[],
  newScheduledDance: TScheduledDancePartial,
  scheduleId: number,
  teacherId: number,
  dances: TDance[],
  accessToken: AccessToken | undefined
): Promise<string[]> {
  const errors: string[] = [];

  const dancersInNewDance = (
    await getDancersInDance(newScheduledDance.DanceId, accessToken)
  ).data;

  const { startStamp, endStamp } = getStartAndEndStamp(newScheduledDance);

  const dancesAtSameTime = scheduledDances.filter((scheduledDance) => {
    if (scheduledDance.ScheduleId !== scheduleId) {
      return false;
    }

    const { startStamp: sdStartStamp, endStamp: sdEndStamp } =
      getStartAndEndStamp(scheduledDance);

    return dancesAreScheduledAtSameTime(
      startStamp,
      endStamp,
      sdStartStamp,
      sdEndStamp
    );
  });

  for (const danceAtSameTime of dancesAtSameTime) {
    const dancersInDanceAtSameTime = (
      await getDancersInDance(danceAtSameTime.DanceId, accessToken)
    ).data;

    const dancersInBothDances = dancersInNewDance.filter((dancer) => {
      return dancersInDanceAtSameTime.find(
        (dancer2) => dancer.id === dancer2.id
      );
    });

    if (dancersInBothDances) {
      dancersInBothDances.forEach((dancer) =>
        errors.push(`${dancer.name} is in a dance scheduled at the same time`)
      );
    }

    const teacherOfDance = dances.find(
      (dance) => dance.id === danceAtSameTime.DanceId
    )?.TeacherId;

    if (teacherOfDance === teacherId) {
      errors.push("This teacher is already teaching at this time");
    }
  }

  return errors;
}
