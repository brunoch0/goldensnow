import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-base-line bg-base">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img
            src="/assets/logos/goldensnow_LOGO-w_w.png"
            alt="Golden Snow Media Group"
            className="h-7 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            {t(
              "Golden Snow Media Group — 한국과 중동을 잇는 두바이 크리에이티브 프로덕션. 보여지고 싶은 브랜드를 위한 비전과 기술, 그리고 craft.",
              "Golden Snow Media Group — Dubai-based creative production house bridging Korea and the Middle East. Vision, technology, and craft for brands that want to be seen."
            )}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("서비스", "Services")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li><Link to="/360" className="hover:text-gold">360° Digital Twin</Link></li>
            <li><Link to="/ooh" className="hover:text-gold">{t("OOH 옥외광고", "OOH Advertising")}</Link></li>
            <li><a href="/#services" className="hover:text-gold">{t("크리에이티브 프로덕션", "Creative Production")}</a></li>
            <li><a href="/#dubai37" className="hover:text-gold">Dubai 37 Film Festival</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">{t("문의", "Contact")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li><a href="mailto:business@goldensnow.ae" className="hover:text-gold">business@goldensnow.ae</a></li>
            <li><a href="https://goldensnow.ae" className="hover:text-gold">goldensnow.ae</a></li>
            <li>{t("두바이, 아랍에미리트", "Dubai, United Arab Emirates")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-base-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-gray-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Golden Snow Media Group. All rights reserved.</span>
          <span>{t("한국 ↔ 중동 · 크리에이티브 프로덕션", "Korea ↔ Middle East · Creative Production")}</span>
        </div>
      </div>
    </footer>
  );
}
