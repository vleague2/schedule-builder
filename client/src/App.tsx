import { Container, CssBaseline, Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import "./index.css";

import { AppMenu } from "./components/AppMenu";
import { UnscheduledDanceColumn } from "./components/UnscheduledDanceColumn";
import { TDance } from "./models/TDance";
import { TDancer } from "./models/TDancer";
import { TScheduledDance } from "./models/TScheduledDance";
import { TStudio } from "./models/TStudio";
import { TTeacher } from "./models/TTeacher";
import { getAllDancers } from "./services/dancersService";
import { getAllDances } from "./services/dancesService";
import { getAllScheduledDances } from "./services/scheduledDancesService";
import { getAllStudios } from "./services/studiosService";
import { getAllTeachers } from "./services/teachersService";
import {
  calculateOccupiedTimeslots,
  getAllTimeslots,
} from "./services/scheduleTimeService";
import { TimeSlotRow } from "./components/TimeSlotRow";

function App(): JSX.Element {
  const [teachers, setTeachers] = useState<TTeacher[] | undefined>(undefined);
  const [dancers, setDancers] = useState<TDancer[] | undefined>(undefined);
  const [dances, setDances] = useState<TDance[] | undefined>(undefined);
  const [studios, setStudios] = useState<TStudio[] | undefined>(undefined);
  const [scheduledDances, setScheduledDances] = useState<
    TScheduledDance[] | undefined
  >(undefined);

  const unscheduledDances =
    dances?.filter((dance) => {
      return !scheduledDances?.find(
        (scheduledDance) => scheduledDance.DanceId === dance.id
      );
    }) || [];

  function fetchTeachers() {
    getAllTeachers().then((teachersResponse) => {
      setTeachers(
        teachersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchStudios() {
    getAllStudios().then((studiosResponse) => {
      setStudios(
        studiosResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDancers() {
    getAllDancers().then((dancersResponse) => {
      setDancers(
        dancersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDances() {
    getAllDances().then((dancesResponse) => {
      setDances(
        dancesResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchScheduledDances() {
    getAllScheduledDances().then((scheduledDancesResponse) => {
      setScheduledDances(scheduledDancesResponse.data);
    });
  }

  useEffect(() => {
    fetchTeachers();
    fetchStudios();
    fetchDancers();
    fetchDances();
    fetchScheduledDances();
  }, []);

  const timeSlots = getAllTimeslots();

  const occupiedTimeSlotsPerStudio = calculateOccupiedTimeslots(
    studios,
    scheduledDances
  );

  return (
    <div>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <CssBaseline />
        <AppMenu
          state={{
            teachers,
            dancers,
            dances,
            studios,
          }}
          refetch={{
            teachers: fetchTeachers,
            studios: fetchStudios,
            dancers: fetchDancers,
            dances: fetchDances,
          }}
        />
        <Container maxWidth="lg" style={{ marginTop: 30 }}>
          <Grid container justifyContent="center">
            <Grid container item xs={8}>
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
                        <td key={studio.id}>{studio.name}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!studios || !dances ? (
                      <tr>
                        <td>Add some studios and dances</td>
                      </tr>
                    ) : (
                      timeSlots.map((timeSlot) => (
                        <TimeSlotRow
                          timeSlot={timeSlot}
                          dances={dances}
                          scheduledDances={scheduledDances}
                          studios={studios}
                          occupiedTimeSlotsPerStudio={
                            occupiedTimeSlotsPerStudio
                          }
                          key={timeSlot.toString()}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Grid>
            <Grid item xs={1} />
            <Grid container item xs={3}>
              {unscheduledDances && teachers && dancers && studios && (
                <UnscheduledDanceColumn
                  unscheduledDances={unscheduledDances}
                  teachers={teachers}
                  dancers={dancers}
                  refetch={fetchScheduledDances}
                  studios={studios}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default App;
