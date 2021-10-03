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
import { ScheduleTabs } from "./components/ScheduleTabs";
import { TSchedule } from "./models/TSchedule";
import { HttpProvider } from "./hooks/httpContext";
import { HttpService } from "./services/httpService";
import { Redirect } from "react-router-dom";

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

  if (!accessToken) {
    return <Redirect to="/" />;
  }

  const httpService = new HttpService(accessToken);

  function fetchTeachers() {
    httpService.httpGet("teachers").then((teachersResponse) => {
      setTeachers(
        teachersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchStudios() {
    httpService.httpGet("studios").then((studiosResponse) => {
      setStudios(
        studiosResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDancers() {
    httpService.httpGet("dancers").then((dancersResponse) => {
      setDancers(
        dancersResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchDances() {
    httpService.httpGet("dances").then((dancesResponse) => {
      setDances(
        dancesResponse.data.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }

  function fetchScheduledDances() {
    httpService.httpGet("scheduledDances").then((scheduledDancesResponse) => {
      setScheduledDances(scheduledDancesResponse.data);
    });
  }

  function fetchSchedules() {
    httpService.httpGet("schedules").then((schedulesResponse) => {
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
    <HttpProvider httpService={httpService}>
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
    </HttpProvider>
  );
}

export default App;
