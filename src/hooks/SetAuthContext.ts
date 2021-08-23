import { createContext, useContext } from "react";

type SetAuthProps = {
  setAuthentication(toggle: boolean): void;
};

export const SetAuthContext = createContext<SetAuthProps>({
  setAuthentication: () => {},
});

export const useSetAuthContext = () => useContext(SetAuthContext);
