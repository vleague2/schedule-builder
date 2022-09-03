import { Typography } from "@material-ui/core";
import { forwardRef, useState } from "react";
import { useHttpContext } from "../hooks/httpContext";

import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TStudio } from "../models/TStudio";
import { TTeacher } from "../models/TTeacher";
import {
  calculateOccupiedTimeslots,
  getAllTimeslots,
} from "../services/scheduleService";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { ScheduledDanceDialog } from "./ScheduledDanceDialog";
import { TimeSlotRow } from "./TimeSlotRow";

type TScheduleTableProps = {
  studios: TStudio[];
  dances: TDance[];
  scheduledDances: TScheduledDance[];
  teachers: TTeacher[];
  scheduleId: number;
  refetch: () => void;
};

export const ScheduleTable = forwardRef<HTMLDivElement, TScheduleTableProps>(
  (props, ref) => {
    const { studios, dances, teachers, scheduledDances, refetch, scheduleId } =
      props;

    const [selectedScheduledDance, setSelectedScheduledDance] = useState<
      TScheduledDance | undefined
    >(undefined);
    const [modalType, setModalType] = useState<"edit" | "delete" | undefined>(
      undefined
    );

    const { httpService } = useHttpContext();

    const selectedDance = dances.find(
      (dance) => dance.id === selectedScheduledDance?.DanceId
    );

    const timeSlots = getAllTimeslots();

    const occupiedTimeSlotsPerStudio = calculateOccupiedTimeslots(
      studios,
      scheduledDances
    );

    function onClose() {
      setSelectedScheduledDance(undefined);
      setModalType(undefined);
      refetch();
    }

    function deleteScheduledDance() {
      if (!selectedScheduledDance) {
        return;
      }

      httpService
        .httpDelete("scheduledDances", selectedScheduledDance.id)
        .then(() => {
          onClose();
        });
    }

    return (
      <>
        <div style={{ width: "100%" }} id="tableDiv" ref={ref}>
          <table
            style={{
              width: "100%",
              textAlign: "center",
              borderSpacing: "1px",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Time</th>
                {studios.map((studio) => (
                  <th key={studio.id} style={{ width: "18%" }}>
                    <Typography variant="body2">{studio.name}</Typography>
                  </th>
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
            dances={dances}
            scheduledDances={scheduledDances}
            scheduledDance={selectedScheduledDance}
            studios={studios}
            modalType="edit"
            scheduleId={scheduleId}
          />
        )}
        {selectedDance && selectedScheduledDance && (
          <DeleteConfirmationDialog
            itemName={selectedDance.name}
            open={
              selectedScheduledDance !== undefined && modalType === "delete"
            }
            onClose={onClose}
            onClick={deleteScheduledDance}
          />
        )}
      </>
    );
  }
);
