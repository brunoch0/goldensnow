import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "ko" | "en";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Inline bilingual helper: t("한국어", "English") */
  t: (ko: string, en: string) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "ko",
  setLang: () => {},
  toggle: () => {},
  t: (ko) => ko,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gs_lang") as Lang | null;
      if (saved === "ko" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("gs_lang", l);
    } catch {
      /* ignore */
    }
  };
  const toggle = () => setLang(lang === "ko" ? "en" : "ko");
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  return <Ctx.Provider value={{ lang, setLang, toggle, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
