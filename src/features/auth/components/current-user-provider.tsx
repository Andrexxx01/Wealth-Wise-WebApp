"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CurrentUser } from "@/types/current-user";

type CurrentUserContextValue = {
  currentUser: CurrentUser;
};

type CurrentUserProviderProps = {
  currentUser: CurrentUser;
  children: ReactNode;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export default function CurrentUserProvider({
  currentUser,
  children,
}: CurrentUserProviderProps) {
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider.");
  }

  return context;
}
