import { Card, Container, Typography, Button } from "@material-ui/core";
import { useOktaAuth } from "@okta/okta-react";
import { Redirect } from "react-router-dom";

export function Login(): JSX.Element {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () =>
    oktaAuth.signInWithRedirect({ originalUri: "/protected" });
  // const logout = async () => oktaAuth.signOut({ postLogoutRedirectUri: "/" });

  if (!authState) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return (
      <Container maxWidth="xs" style={{ textAlign: "center" }}>
        <Card
          style={{ padding: 40, backgroundColor: "#efefef", marginTop: 80 }}
        >
          <Typography variant="h5" component="h1">
            Log in to UPAC Schedule Builder
          </Typography>
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={login}>
            Login
          </Button>
        </Card>
      </Container>
    );
  }

  return <Redirect to="/protected" />;
}
