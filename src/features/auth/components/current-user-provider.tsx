"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
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
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function applyTheme() {
      const dark = currentUser.theme === "DARK" ||
        (currentUser.theme === "SYSTEM" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    }
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [currentUser.theme]);

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
