import { createContext, useContext } from "react";
import { HttpService } from "../services/httpService";

const HttpContext = createContext<{ httpService: HttpService }>({
  httpService: new HttpService({
    accessToken: "",
    tokenType: "",
    userinfoUrl: "",
    expiresAt: 0,
    authorizeUrl: "",
    scopes: [],
    claims: { sub: "" },
  }),
});

export function useHttpContext(): { httpService: HttpService } {
  return useContext(HttpContext);
}

export function HttpProvider({
  children,
  httpService,
}: {
  children: React.ReactNode;
  httpService: HttpService;
}): JSX.Element {
  return (
    <HttpContext.Provider value={{ httpService }}>
      {children}
    </HttpContext.Provider>
  );
}
