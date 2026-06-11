import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../lib/i18n";

const COOKIE_NAME = "gs_dkj_popup_hide";

function hasCookie(name: string) {
  try {
    return document.cookie.split("; ").some((c) => c.startsWith(name + "="));
  } catch {
    return false;
  }
}

function setCookie(name: string, value: string, days: number) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  } catch {
    /* cookies unavailable — popup simply reappears next visit */
  }
}

export default function DKJournalPopup() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    if (hasCookie(COOKIE_NAME)) return;
    const timer = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    if (hideToday) setCookie(COOKIE_NAME, "1", 1);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold/50 bg-base-soft shadow-gold"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="DK Journal"
          >
            {/* gold glow accent */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[80px]" />

            <button
              onClick={close}
              aria-label={t("닫기", "Close")}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-base-line text-gray-400 transition-colors hover:border-gold hover:text-gold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative px-7 pb-7 pt-10 text-center sm:px-9">
              <p className="eyebrow">Since 2008 · DK Journal</p>
              <h2 className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
                {t("UAE 한인 커뮤니티 광고,", "Advertise to the UAE Korean community —")}
                <br />
                <span className="text-gold-grad glow">{t("DK Journal로", "with DK Journal")}</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {t(
                  "Since 2008 · UAE 1위 한인신문 — Golden Snow가 광고 집행을 대행합니다",
                  "Since 2008 · UAE's No.1 Korean newspaper — ad placement managed by Golden Snow"
                )}
              </p>

              <Link to="/dkjournal" onClick={close} className="btn-gold mt-7 w-full">
                {t("자세히 보기", "Learn more")}
              </Link>

              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-300">
                <input
                  type="checkbox"
                  checked={hideToday}
                  onChange={(e) => setHideToday(e.target.checked)}
                  className="h-3.5 w-3.5 accent-gold"
                />
                {t("오늘 하루 보지 않기", "Don't show again today")}
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
