import { Typography } from "@material-ui/core";
import { useState } from "react";

import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import {
  calculateOccupiedTimeslots,
  getAllTimeslots,
} from "../services/scheduleTimeService";
import { DeleteScheduledDanceDialog } from "./DeleteScheduledDanceDialog";
import { ScheduledDanceDialog } from "./ScheduledDanceDialog";
import { TimeSlotRow } from "./TimeSlotRow";

type TScheduleTableProps = {
  studios: TStudio[];
  dances: TDance[];
  scheduledDances: TScheduledDance[] | undefined;
  teachers: TTeacher[] | undefined;
  refetch: () => void;
};

export function ScheduleTable(props: TScheduleTableProps): JSX.Element {
  const { studios, dances, teachers, scheduledDances, refetch } = props;

  const [selectedScheduledDance, setSelectedScheduledDance] = useState<
    TScheduledDance | undefined
  >(undefined);
  const [modalType, setModalType] = useState<"edit" | "delete" | undefined>(
    undefined
  );

  const selectedDance = dances.find(
    (dance) => dance.id === selectedScheduledDance?.DanceId
  );

  const timeSlots = getAllTimeslots();

  const occupiedTimeSlotsPerStudio = calculateOccupiedTimeslots(
    studios,
    scheduledDances
  );

  return (
    <>
      <div style={{ width: "100%" }}>
        <table
          style={{
            width: "100%",
            textAlign: "center",
            borderSpacing: "1px",
          }}
        >
          <thead>
            <tr>
              <th>Time</th>
              {studios?.map((studio) => (
                <td key={studio.id}>
                  <Typography variant="body2">{studio.name}</Typography>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <TimeSlotRow
                timeSlot={timeSlot}
                dances={dances}
                scheduledDances={scheduledDances}
                studios={studios}
                teachers={teachers}
                occupiedTimeSlotsPerStudio={occupiedTimeSlotsPerStudio}
                editScheduledDance={(
                  dance: TScheduledDance,
                  modalType: "edit" | "delete"
                ) => {
                  setSelectedScheduledDance(dance);
                  setModalType(modalType);
                }}
                key={timeSlot.toString()}
              />
            ))}
          </tbody>
        </table>
      </div>
      {selectedDance && (
        <ScheduledDanceDialog
          open={selectedScheduledDance !== undefined && modalType === "edit"}
          onClose={() => {
            setSelectedScheduledDance(undefined);
            setModalType(undefined);
            refetch();
          }}
          dance={selectedDance}
          scheduledDance={selectedScheduledDance}
          studios={studios}
          modalType="edit"
        />
      )}
      {selectedDance && selectedScheduledDance && (
        <DeleteScheduledDanceDialog
          scheduledDanceId={selectedScheduledDance.id}
          scheduledDanceName={selectedDance.name}
          open={selectedScheduledDance !== undefined && modalType === "delete"}
          onClose={() => {
            setSelectedScheduledDance(undefined);
            setModalType(undefined);
            refetch();
          }}
        />
      )}
    </>
  );
}
