import { SecureRoute, Security, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { useHistory, Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import { Login } from "./components/Login";

const oktaAuth = new OktaAuth({
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + "/callback",
});

function Routes(): JSX.Element {
  const history = useHistory();

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/" exact={true} component={Login} />
      <SecureRoute path="/protected" component={App} />
      <Route path="/callback" component={LoginCallback} />
    </Security>
  );
}

export function AppWithRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
