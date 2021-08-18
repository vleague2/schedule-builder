import { Card, Grid, Typography } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import { capitalize } from "lodash";

type TMessageBox = {
  messages: string[];
  style: "warning" | "error" | "success";
};

export function MessageBox(props: TMessageBox): JSX.Element {
  const { messages, style } = props;

  const backgroundColor: string =
    style === "error" ? "#ffe3e3" : style === "warning" ? "#faead9" : "#ccffd2";

  const borderColor: string =
    style === "error" ? "#fa2a3c" : style === "warning" ? "#e88e2e" : "#33b042";

  return (
    <Card
      style={{
        backgroundColor,
        padding: 10,
        margin: 10,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Grid container>
        <Grid item xs={1} style={{ textAlign: "center" }}>
          {style === "error" ? <ErrorIcon /> : <WarningIcon />}
        </Grid>
        <Grid item xs={11}>
          <Typography>{capitalize(style)}s:</Typography>
          <ul>
            {messages.map((message) => (
              <li>
                <Typography key={message}>{message}</Typography>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
    </Card>
  );
}
