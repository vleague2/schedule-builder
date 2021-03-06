import { Card, Collapse, IconButton, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useEffect, useState } from "react";

import { TDance } from "../models/TDance";
import { TDancer } from "../models/TDancer";
import { TTeacher } from "../models/TTeacher";
import { ScheduledDanceDialog } from "./ScheduledDanceDialog";
import { TStudio } from "../models/TStudio";
import { TScheduledDance } from "../models/TScheduledDance";
import { useHttpContext } from "../hooks/httpContext";

type TUnscheduledDanceCardProps = {
  unscheduledDance: TDance;
  scheduledDances: TScheduledDance[];
  refetch: () => void;
  studios: TStudio[];
  dances: TDance[];
  scheduleId: number;
  teacher?: TTeacher;
};

export function UnscheduledDanceCard(
  props: TUnscheduledDanceCardProps
): JSX.Element {
  const {
    unscheduledDance,
    teacher,
    refetch,
    studios,
    scheduledDances,
    scheduleId,
    dances,
  } = props;
  const [cast, setCast] = useState<TDancer[] | undefined>(undefined);
  const [castOpen, setCastOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { httpService } = useHttpContext();

  useEffect(() => {
    httpService
      .httpDancersInDance("GET", { danceId: unscheduledDance.id })
      .then((dancers) => {
        setCast(dancers.data.sort((a, b) => a.name.localeCompare(b.name)));
      });
  }, [unscheduledDance]);

  return (
    <>
      <Card key={unscheduledDance.name} style={{ width: "100%", padding: 15 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>
            <b>{unscheduledDance.name}</b>
          </Typography>
          <IconButton
            size="small"
            title="Add to schedule"
            onClick={() => setModalOpen(true)}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
        <Typography variant="body2">
          Instructor: {teacher?.name ?? "N/A"}
        </Typography>
        <Typography variant="body2">
          {castOpen ? "Hide" : "Show"} list of dancers
          <IconButton onClick={() => setCastOpen(!castOpen)}>
            {castOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Typography>
        <Collapse in={castOpen} unmountOnExit>
          {cast?.map((castMember, index) => {
            const itemIsLastInArray = index === cast.length - 1;
            return (
              <span key={castMember.name}>
                {castMember.name}
                {!itemIsLastInArray && ","}{" "}
              </span>
            );
          })}
        </Collapse>
      </Card>
      <ScheduledDanceDialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetch();
        }}
        dance={unscheduledDance}
        dances={dances}
        studios={studios}
        modalType="add"
        scheduledDances={scheduledDances}
        scheduleId={scheduleId}
      />
    </>
  );
}
