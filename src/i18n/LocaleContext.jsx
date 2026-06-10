import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMessage, interpolate } from "./getMessage";
import en from "./locales/en";
import es from "./locales/es";

const STORAGE_KEY = "bbm-locale";
const LOCALES = {
  en: { label: "English", ogLocale: "en_US", htmlLang: "en", ...en },
  es: { label: "Español", ogLocale: "es_US", htmlLang: "es", ...es },
};

function getBrowserLocale() {
  if (typeof navigator === "undefined") return "en";
  const lang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  return lang.startsWith("es") ? "es" : "en";
}

function getStoredLocale() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "en" || value === "es") return value;
  } catch {
    /* ignore */
  }
  return null;
}

function getInitialLocale() {
  return getStoredLocale() || getBrowserLocale();
}

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((next) => {
    setLocaleState(next === "es" ? "es" : "en");
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    const { htmlLang, ogLocale } = LOCALES[locale];
    document.documentElement.lang = htmlLang;
    const ogMeta = document.querySelector('meta[property="og:locale"]');
    if (ogMeta) {
      ogMeta.setAttribute("content", ogLocale);
    }
  }, [locale]);

  const bundle = LOCALES[locale];

  const t = useCallback(
    (key, vars) => {
      const raw = getMessage(bundle.messages, key);
      return interpolate(raw, vars);
    },
    [bundle.messages]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      siteConfig: bundle.siteConfig,
      seo: bundle.messages.seo,
      ogLocale: bundle.ogLocale,
      htmlLang: bundle.htmlLang,
    }),
    [locale, setLocale, t, bundle]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export { LOCALES };
