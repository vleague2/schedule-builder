import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TTeacher } from "../models/TTeacher";
import { UnscheduledDanceCard } from "./UnscheduledDanceCard";

type TUnscheduledDanceColumnProps = {
  unscheduledDances: TDance[];
  teachers: TTeacher[];
  dancers: TDancer[];
};

export function UnscheduledDanceColumn(
  props: TUnscheduledDanceColumnProps
): JSX.Element {
  const { unscheduledDances, teachers, dancers } = props;

  return (
    <div style={{ width: "100%" }}>
      {unscheduledDances.map((unscheduledDance) => (
        <div key={unscheduledDance.name} style={{ marginBottom: 20 }}>
          <UnscheduledDanceCard
            unscheduledDance={unscheduledDance}
            teacher={teachers.find(
              (teacher) => teacher.id === unscheduledDance.TeacherId
            )}
          />
        </div>
      ))}
    </div>
  );
}
