"use client"

import { createContext, useContext, useState } from "react";

const ChantierContext = createContext(null);

export function useChantier() {
  return useContext(ChantierContext);
}

export function ChantierInfo({ children }) {
  const [data, setData] = useState({});

  return (
    <ChantierContext.Provider value={{ data, setData }}>
      {children}
    </ChantierContext.Provider>
  );
}