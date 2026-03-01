import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import i18n, { setLocale } from "../i18n";

interface LanguageContextType {
  locale: "en";
  setLocale: (locale: "en") => void;
  t: (key: string, options?: object) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // English only
  const [locale, setLocaleState] = useState<"en">("en");

  useEffect(() => {
    setLocale("en");
  }, []);

  const handleSetLocale = (newLocale: "en") => {
    setLocaleState(newLocale);
    setLocale(newLocale);
  };

  const t = (key: string, options?: object): string => {
    return i18n.t(key, options);
  };

  return (
    <LanguageContext.Provider
      value={{ locale: "en", setLocale: handleSetLocale, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
