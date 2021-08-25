import { createContext, useCallback, useContext, useState } from "react";
import type { FC, ReactNode } from "react";

type Context = {
  isAuthenticated: boolean;
  setAuthentication: (value: any) => void;
};

const AuthContext = createContext<Context>({
  isAuthenticated: false,
  setAuthentication: () => {},
});

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthentication] = useState(false);
  // console.log(isAuthenticated)
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthentication,
      }}
    >
      {children}
      {/* {isAuthenticated && (
        <button type="button" onClick={handleAuthentication}>
          Log out
        </button>
      )} */}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
