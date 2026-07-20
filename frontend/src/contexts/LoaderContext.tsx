import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import Loader from "../components/common/Loader/Loader";

interface LoaderContextProps {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({
      isLoading,
      showLoader: () => setIsLoading(true),
      hideLoader: () => setIsLoading(false),
    }),
    [isLoading],
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
