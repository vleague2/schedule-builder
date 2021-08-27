import { Typography } from "@material-ui/core";
import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import { UnscheduledDanceCard } from "./UnscheduledDanceCard";

type TUnscheduledDanceColumnProps = {
  unscheduledDances: TDance[];
  teachers: TTeacher[];
  dancers: TDancer[];
  studios: TStudio[];
  refetch: () => void;
};

export function UnscheduledDanceColumn(
  props: TUnscheduledDanceColumnProps
): JSX.Element {
  const { unscheduledDances, teachers, refetch, studios } = props;

  return (
    <div style={{ width: "100%" }}>
      <Typography align="center">Dances To Be Scheduled</Typography>
      <br />
      {unscheduledDances.map((unscheduledDance) => (
        <div key={unscheduledDance.name} style={{ marginBottom: 20 }}>
          <UnscheduledDanceCard
            unscheduledDance={unscheduledDance}
            teacher={teachers.find(
              (teacher) => teacher.id === unscheduledDance.TeacherId
            )}
            refetch={refetch}
            studios={studios}
          />
        </div>
      ))}
    </div>
  );
}
