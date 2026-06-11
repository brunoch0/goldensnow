import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLang();

  const sectionLinks = [
    { label: t("회사 소개", "About"), href: "/#about" },
    { label: t("서비스", "What We Do"), href: "/#services" },
    { label: t("포트폴리오", "Portfolio"), href: "/#portfolio" },
    { label: "Dubai 37", href: "/#dubai37" },
  ];
  const landingLinks: { label: string; to: string; highlight?: boolean }[] = [
    { label: t("DK 저널 광고", "DK Journal"), to: "/dkjournal", highlight: true },
    { label: "360° Digital Twin", to: "/360" },
    { label: t("OOH 광고", "OOH"), to: "/ooh" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center rounded-full border border-base-line text-xs ${className}`}>
      <button
        onClick={() => setLang("ko")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "ko" ? "bg-gold-gradient font-semibold text-base" : "text-gray-300"
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en" ? "bg-gold-gradient font-semibold text-base" : "text-gray-300"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-base-line bg-base/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/logos/goldensnow_LOGO-w_w.png"
            alt="Golden Snow Media Group"
            className="h-7 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {sectionLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-gray-300 transition-colors hover:text-gold">
              {l.label}
            </a>
          ))}
          {landingLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-colors hover:text-gold ${
                l.highlight ? "flex items-center gap-1.5 font-semibold text-gold" : "text-gray-300"
              }`}
            >
              {l.label}
              {l.highlight && (
                <span className="rounded-full bg-gold-gradient px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-base">
                  New
                </span>
              )}
            </Link>
          ))}
          <LangToggle />
          <a href="/#contact" className="btn-gold !px-5 !py-2">
            {t("문의", "Contact")}
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LangToggle />
          <button aria-label="Toggle menu" className="text-gold" onClick={() => setOpen((v) => !v)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-base-line bg-base/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {sectionLinks.map((l) => (
              <a key={l.href} href={l.href} className="py-1 text-gray-200 hover:text-gold">
                {l.label}
              </a>
            ))}
            {landingLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 py-1 hover:text-gold ${
                  l.highlight ? "font-semibold text-gold" : "text-gray-200"
                }`}
              >
                {l.label}
                {l.highlight && (
                  <span className="rounded-full bg-gold-gradient px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-base">
                    New
                  </span>
                )}
              </Link>
            ))}
            <a href="/#contact" className="btn-gold mt-2 w-full">
              {t("문의", "Contact")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
