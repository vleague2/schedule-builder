import { Typography } from "@material-ui/core";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { UnscheduledDanceCard } from "./UnscheduledDanceCard";

type TUnscheduledDanceColumnProps = {
  unscheduledDances: TDance[];
  scheduledDances: TScheduledDance[];
  teachers: TTeacher[];
  dancers: TDancer[];
  studios: TStudio[];
  scheduleId: number;
  refetch: () => void;
};

export function UnscheduledDanceColumn(
  props: TUnscheduledDanceColumnProps
): JSX.Element {
  const {
    unscheduledDances,
    teachers,
    refetch,
    studios,
    scheduledDances,
    scheduleId,
  } = props;

  return (
    <div style={{ width: "100%" }}>
      <Typography align="center">Dances To Be Scheduled</Typography>
      <br />
      {unscheduledDances.map((unscheduledDance) => (
        <div key={unscheduledDance.name} style={{ marginBottom: 20 }}>
          <UnscheduledDanceCard
            scheduledDances={scheduledDances}
            unscheduledDance={unscheduledDance}
            teacher={teachers.find(
              (teacher) => teacher.id === unscheduledDance.TeacherId
            )}
            refetch={refetch}
            studios={studios}
            scheduleId={scheduleId}
          />
        </div>
      ))}
    </div>
  );
}
