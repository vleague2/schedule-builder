import { CssBaseline } from "@material-ui/core";
import { useState, useEffect } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import { useOktaAuth } from "@okta/okta-react";
import "./index.css";

import { AppMenu } from "./components/AppMenu";
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
import { ScheduleTabs } from "./components/ScheduleTabs";
import { getAllSchedules } from "./services/scheduleService";
import { TSchedule } from "./models/TSchedule";

function App(): JSX.Element {
  const [teachers, setTeachers] = useState<TTeacher[] | undefined>(undefined);
  const [dancers, setDancers] = useState<TDancer[] | undefined>(undefined);
  const [dances, setDances] = useState<TDance[] | undefined>(undefined);
  const [studios, setStudios] = useState<TStudio[] | undefined>(undefined);
  const [scheduledDances, setScheduledDances] = useState<
    TScheduledDance[] | undefined
  >(undefined);
  const [schedules, setSchedules] = useState<TSchedule[] | undefined>(
    undefined
  );

  const { authState } = useOktaAuth();
  const accessToken = authState?.accessToken;

  function fetchTeachers() {
    getAllTeachers(accessToken).then((teachersResponse) => {
      setTeachers(
        teachersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchStudios() {
    getAllStudios(accessToken).then((studiosResponse) => {
      setStudios(
        studiosResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDancers() {
    getAllDancers(accessToken).then((dancersResponse) => {
      setDancers(
        dancersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDances() {
    getAllDances(accessToken).then((dancesResponse) => {
      setDances(
        dancesResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchScheduledDances() {
    getAllScheduledDances(accessToken).then((scheduledDancesResponse) => {
      setScheduledDances(scheduledDancesResponse.data);
    });
  }

  function fetchSchedules() {
    getAllSchedules(accessToken).then((schedulesResponse) => {
      setSchedules(schedulesResponse.data.sort((a, b) => a.id - b.id));
    });
  }

  useEffect(() => {
    fetchTeachers();
    fetchStudios();
    fetchDancers();
    fetchDances();
    fetchScheduledDances();
    fetchSchedules();
  }, []);

  return (
    <div>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <CssBaseline />
        <AppMenu
          state={{
            teachers: teachers ?? [],
            dancers: dancers ?? [],
            dances: dances ?? [],
            studios: studios ?? [],
          }}
          refetch={{
            teachers: fetchTeachers,
            studios: fetchStudios,
            dancers: fetchDancers,
            dances: fetchDances,
          }}
        />
        <ScheduleTabs
          schedules={schedules ?? []}
          dances={dances ?? []}
          dancers={dancers ?? []}
          scheduledDances={scheduledDances ?? []}
          fetchScheduledDances={fetchScheduledDances}
          fetchSchedules={fetchSchedules}
          teachers={teachers ?? []}
          studios={studios ?? []}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default App;
