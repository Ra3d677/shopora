"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Store } from "@/lib/data";

interface StoreContextType {
  store: Store;
  user: any | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ 
  children, 
  store,
  user 
}: { 
  children: ReactNode; 
  store: Store;
  user: any | null;
}) {
  return (
    <StoreContext.Provider value={{ store, user }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
