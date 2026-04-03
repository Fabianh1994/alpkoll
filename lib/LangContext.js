'use client';
import { createContext, useContext } from 'react';

const LangContext = createContext('en');

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}