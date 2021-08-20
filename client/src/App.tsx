import { Container, CssBaseline, Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { AppMenu } from "./components/AppMenu";
import { TDance } from "./models/TDance";
import { TDancer } from "./models/TDancer";
import { TStudio } from "./models/TStudio";
import { TTeacher } from "./models/TTeacher";
import { getAllDancers } from "./services/dancersService";
import { getAllDances } from "./services/dancesService";
import { getAllStudios } from "./services/studiosService";
import { getAllTeachers } from "./services/teachersService";

function App(): JSX.Element {
  const [teachers, setTeachers] = useState<TTeacher[] | undefined>(undefined);
  const [dancers, setDancers] = useState<TDancer[] | undefined>(undefined);
  const [dances, setDances] = useState<TDance[] | undefined>(undefined);
  const [studios, setStudios] = useState<TStudio[] | undefined>(undefined);

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

  useEffect(() => {
    fetchTeachers();
    fetchStudios();
    fetchDancers();
    fetchDances();
  }, []);

  return (
    <div>
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
        {/* <table style={{ width: "100%" }}>
          <tr>
            <td>Time</td>
            <td>Studio 1</td>
            <td>Studio 2</td>
            <td>Studio 3</td>
            <td>Studio 4</td>
            <td>Studio 5</td>
          </tr>
        </table> */}
        <Grid container justifyContent="center">
          <Grid container item xs={9}>
            <Grid item xs={2}>
              Time
            </Grid>
            <Grid item xs={2}>
              studio 1
            </Grid>
            <Grid item xs={2}>
              studio 2
            </Grid>
            <Grid item xs={2}>
              studio 3
            </Grid>
            <Grid item xs={2}>
              studio 4
            </Grid>
            <Grid item xs={2}>
              studio 5
            </Grid>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid container item xs={2}>
            Un-scheduled dances go here
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
