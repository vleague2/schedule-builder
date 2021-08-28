import {
  Tab,
  Tabs,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { ChangeEvent, useState } from "react";

import { UnscheduledDanceColumn } from "./UnscheduledDanceColumn";
import { ScheduleTable } from "./ScheduleTable";
import { TSchedule } from "../models/TSchedule";
import { TStudio } from "../models/TStudio";
import { TDancer } from "../models/TDancer";
import { TDance } from "../models/TDance";
import { TScheduledDance } from "../models/TScheduledDance";
import { TTeacher } from "../models/TTeacher";
import { addSchedules } from "../services/scheduleService";

type TTabPanelProps = {
  value: number;
  index: number;
  children: JSX.Element;
};

type TScheduleTabsProps = {
  schedules: TSchedule[];
  studios: TStudio[];
  dancers: TDancer[];
  dances: TDance[];
  teachers: TTeacher[];
  scheduledDances: TScheduledDance[];
  fetchScheduledDances: () => void;
  fetchSchedules: () => void;
};

function TabPanel(props: TTabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number): {
  id: string;
  ["aria-controls"]: string;
} {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ScheduleTabs(props: TScheduleTabsProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [newScheduleName, setNewScheduleName] = useState<string>("");

  const {
    schedules,
    studios,
    dancers,
    dances,
    teachers,
    scheduledDances,
    fetchScheduledDances,
    fetchSchedules,
  } = props;

  function handleChange(event: ChangeEvent<unknown>, newValue: number) {
    setSelectedTab(newValue);
  }

  async function createNewSchedule() {
    await addSchedules(newScheduleName);
    fetchSchedules();
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="simple tabs example"
        style={{ backgroundColor: "#dddddd" }}
        indicatorColor="primary"
      >
        {schedules.map((schedule, index) => (
          <Tab
            label={schedule.name}
            {...a11yProps(index)}
            key={schedule.name}
          />
        ))}
        <Tab label="+" {...a11yProps(schedules.length)} />
      </Tabs>
      {schedules.map((schedule, index) => {
        const dancesInThisSchedule = scheduledDances.filter(
          (scheduledDance) => scheduledDance.ScheduleId === schedule.id
        );

        const unscheduledDances = dances.filter((dance) => {
          return !dancesInThisSchedule?.find(
            (scheduledDance) => scheduledDance.DanceId === dance.id
          );
        });

        return (
          <TabPanel value={selectedTab} index={index}>
            <Container maxWidth="lg" style={{ marginTop: 30 }}>
              <Grid container justifyContent="center">
                <Grid container item md={8} xs={12}>
                  {studios.length === 0 || dances.length === 0 ? (
                    <p>Add some studios and dances first!</p>
                  ) : (
                    <ScheduleTable
                      studios={studios}
                      teachers={teachers}
                      dances={dances}
                      scheduledDances={dancesInThisSchedule}
                      refetch={fetchScheduledDances}
                      scheduleId={schedule.id}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={1} />
                <Grid container item md={3} xs={12}>
                  <UnscheduledDanceColumn
                    scheduledDances={dancesInThisSchedule}
                    unscheduledDances={unscheduledDances}
                    teachers={teachers}
                    dancers={dancers}
                    refetch={fetchScheduledDances}
                    studios={studios}
                    scheduleId={schedule.id}
                  />
                </Grid>
              </Grid>
            </Container>
          </TabPanel>
        );
      })}
      <TabPanel value={selectedTab} index={schedules.length}>
        <Container maxWidth="lg" style={{ marginTop: 30, textAlign: "center" }}>
          <Typography>Add a new schedule</Typography>
          <br />
          <TextField
            label="Schedule name"
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewScheduleName(e.target.value)
            }
          />
          <br />
          <br />
          <Button
            onClick={createNewSchedule}
            variant="contained"
            disabled={newScheduleName === ""}
          >
            Save
          </Button>
        </Container>
      </TabPanel>
    </>
  );
}
