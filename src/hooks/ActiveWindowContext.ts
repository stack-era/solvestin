import { createContext, useContext } from "react";

type ActiveWindowProps = {
  activeWindow: string;
  setActiveWindow(toggle: string): void;
};

export const ActiveWindowContext = createContext<ActiveWindowProps>({
  activeWindow: "dashboard",
  setActiveWindow: () => {},
});

export const useActiveWindowContext = () => useContext(ActiveWindowContext);
