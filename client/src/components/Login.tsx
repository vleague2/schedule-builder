import { useOktaAuth } from "@okta/okta-react";

export function Login(): JSX.Element {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () =>
    oktaAuth.signInWithRedirect({ originalUri: "/protected" });
  const logout = async () => oktaAuth.signOut({ postLogoutRedirectUri: "/" });

  if (!authState) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return (
      <div>
        <p>Not Logged in yet</p>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
