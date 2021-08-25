import { createContext, useContext } from "react";

type ShowBucketsProps = {
  showBuckets: boolean;
  setShowBuckets(toggle: boolean): void;
};

export const ShowBucketsContext = createContext<ShowBucketsProps>({
  showBuckets: false,
  setShowBuckets: () => {},
});

export const useShowBucketsContext = () => useContext(ShowBucketsContext);
