'use client';
import { useLang } from './LangContext';
import en from '../dictionaries/en.json';
import sv from '../dictionaries/sv.json';

const dictionaries = { en, sv };

export function useDictionary() {
  const lang = useLang();
  return dictionaries[lang] || dictionaries.en;
}