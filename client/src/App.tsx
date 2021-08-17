import { Container, CssBaseline, Grid } from "@material-ui/core";
import { AppMenu } from "./components/AppMenu";

function App(): JSX.Element {
  return (
    <div>
      <CssBaseline />
      <AppMenu />
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
