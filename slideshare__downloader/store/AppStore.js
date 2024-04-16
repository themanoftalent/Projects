"use client";
import { createContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";

const AppContext = createContext();

export const initialState = {
  url: null,
  title: null,
  slideSize: 0,
  thumbs: [],
  slides: [],
  selected_slides: [],
  selection_mode: false,
  invalidUrl: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
