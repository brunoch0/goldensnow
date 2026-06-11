import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import Lightbox from "../components/Lightbox";
import LazyVideo from "../components/LazyVideo";
import { Reveal, StaggerGrid, staggerItem, CountUp } from "../components/motion";
import { useLang } from "../lib/i18n";

type Bi = { ko: string; en: string };

const marketStats: { v: number; decimals?: number; prefix?: string; suffix: string; t: Bi }[] = [
  { v: 750, suffix: "K+", t: { ko: "Dubai Metro 일일 이용객", en: "Dubai Metro daily riders" } },
  { v: 100, suffix: "M+", t: { ko: "Dubai Mall 연간 방문객", en: "Dubai Mall annual visitors" } },
  { v: 3.7, decimals: 1, suffix: "M+", t: { ko: "두바이 거주 인구", en: "Dubai residents" } },
  { v: 1, prefix: "#", suffix: "", t: { ko: "중동 프리미엄 OOH", en: "Premium OOH in MENA" } },
];

const gallery: { video: string; poster: string; name: Bi }[] = [
  { video: "/assets/visuals/ooh/loc-dubai-mall.mp4", poster: "/assets/visuals/ooh/loc-dubai-mall.jpg", name: { ko: "Dubai Mall 내부 사이니지", en: "Dubai Mall Interior Signage" } },
  { video: "/assets/visuals/ooh/loc-sheikh-zayed.mp4", poster: "/assets/visuals/ooh/loc-sheikh-zayed.jpg", name: { ko: "Sheikh Zayed Road · 야간", en: "Sheikh Zayed Road · Night" } },
  { video: "/assets/visuals/ooh/loc-jbr.mp4", poster: "/assets/visuals/ooh/loc-jbr.jpg", name: { ko: "JBR 해변가 빌보드", en: "JBR Beachfront Billboard" } },
  { video: "/assets/visuals/ooh/loc-dubai-frame.mp4", poster: "/assets/visuals/ooh/loc-dubai-frame.jpg", name: { ko: "Dubai Frame 랜드마크", en: "Dubai Frame Landmark" } },
  { video: "/assets/visuals/ooh/loc-metro.mp4", poster: "/assets/visuals/ooh/loc-metro.jpg", name: { ko: "Dubai Metro 역사 내부", en: "Dubai Metro Interior" } },
  { video: "/assets/visuals/ooh/loc-marina.mp4", poster: "/assets/visuals/ooh/loc-marina.jpg", name: { ko: "Dubai Marina · 야경", en: "Dubai Marina · Night" } },
];

const mediaLocations: { title: string; en: Bi; desc: Bi }[] = [
  { title: "Dubai Metro", en: { ko: "RTA", en: "RTA" }, desc: { ko: "일 75만+ 이용객. 출퇴근·관광 동선을 매일 장악하는 메트로 미디어.", en: "750K+ daily riders — metro media owning commuter and tourist routes." } },
  { title: "The Dubai Mall", en: { ko: "세계 최대 쇼핑몰", en: "World's largest mall" }, desc: { ko: "연 1억+ 방문객. 구매 직전 고소비층에 직접 닿는 프리미엄 면.", en: "100M+ visitors — premium placements right before purchase." } },
  { title: "Mall of the Emirates", en: { ko: "랜드마크 몰", en: "Landmark mall" }, desc: { ko: "두바이 대표 몰 중 하나. 럭셔리·리테일 타겟에 최적.", en: "A flagship Dubai mall — ideal for luxury and retail targeting." } },
  { title: "Sheikh Zayed Road", en: { ko: "메인 간선도로", en: "Main highway" }, desc: { ko: "두바이를 관통하는 대로의 대형 빌보드. 압도적 노출량.", en: "Giant billboards along Dubai's main artery — overwhelming reach." } },
  { title: "Dubai Frame", en: { ko: "랜드마크", en: "Landmark" }, desc: { ko: "두바이의 상징적 랜드마크 권역 미디어. 브랜드 위상 상승.", en: "Iconic landmark-zone media that elevates brand stature." } },
  { title: "JBR The Walk", en: { ko: "해변 상권", en: "Beachfront district" }, desc: { ko: "관광·여가 인구가 모이는 해변 산책로 상권 노출.", en: "Exposure across the beachfront promenade's leisure crowds." } },
];

const process: { step: string; title: Bi; desc: Bi }[] = [
  { step: "01", title: { ko: "문의", en: "Inquiry" }, desc: { ko: "타겟·기간·예산을 알려주시면 시작합니다.", en: "Share your target, timing, and budget to begin." } },
  { step: "02", title: { ko: "위치 제안", en: "Location proposal" }, desc: { ko: "목표에 맞는 최적의 미디어 위치를 제안합니다.", en: "We propose the best media locations for your goal." } },
  { step: "03", title: { ko: "견적", en: "Quote" }, desc: { ko: "선택 위치·기간 기준 맞춤 견적을 드립니다.", en: "A tailored quote based on locations and duration." } },
  { step: "04", title: { ko: "집행", en: "Execution" }, desc: { ko: "소재 제작부터 집행·성과 리포트까지 진행합니다.", en: "From creative production to launch and reporting." } },
];

const faqs: { q: Bi; a: Bi }[] = [
  { q: { ko: "최소 예산은 얼마인가요?", en: "What's the minimum budget?" }, a: { ko: "미디어·기간에 따라 다릅니다. 목표 예산을 알려주시면 맞는 위치 조합을 제안드립니다.", en: "It depends on media and duration. Tell us your budget and we'll propose a fitting mix." } },
  { q: { ko: "한국에서 결제·계약이 가능한가요?", en: "Can we pay and contract from Korea?" }, a: { ko: "네. 한국 기업의 결제·계약 프로세스를 지원합니다.", en: "Yes — we support Korean companies' payment and contracting." } },
  { q: { ko: "광고 소재 제작도 지원하나요?", en: "Do you produce the creative too?" }, a: { ko: "지원합니다. 디렉터의 광고 제작 역량으로 현지 규정에 맞춘 소재를 제작합니다.", en: "We do — our director's craft delivers compliant local creative." } },
  { q: { ko: "성과 리포트를 받을 수 있나요?", en: "Do we get performance reports?" }, a: { ko: "집행 후 노출·성과 리포트를 제공합니다.", en: "Yes — we provide exposure and performance reports after the run." } },
];

const serviceOptions = [
  { value: "OOH", label: "OOH" },
  { value: "general", label: "General" },
];

function Pin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
      <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function LandingOOH() {
  const { lang, t } = useLang();
  const L = <T extends Bi>(o: T) => o[lang];
  const [lb, setLb] = useState<{ src: string; cap: string } | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 160]);

  return (
    <div className="bg-base">
      <Navbar />

      {/* ===== HERO (parallax video + light fx) ===== */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <LazyVideo
            src="/assets/visuals/ooh/ooh-1.mp4"
            poster="/assets/visuals/ooh/loc-sheikh-zayed.jpg"
            className="absolute inset-0 h-[115%] w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-base/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-base/60" />
        {/* animated light blobs */}
        <motion.div
          className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[100px]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-gold-bright/10 blur-[120px]"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="container-x relative">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            Dubai OOH · {t("두바이 옥외광고", "Out-of-Home Advertising")}
          </motion.p>
          <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {(lang === "ko"
              ? ["두바이가 보는 곳에,", "당신의 브랜드를."]
              : ["Where Dubai looks,", "your brand belongs."]
            ).map((line, i) => (
              <motion.span key={i} className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                {i === 1 ? <span className="text-gold glow">{line}</span> : line}
              </motion.span>
            ))}
          </h1>
          <motion.p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            {t(
              "두바이에서 보이는 것이, 두바이에서 팔립니다.",
              "Visibility in Dubai is credibility worldwide."
            )}
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}>
            <a href="#contact" className="btn-gold">{t("상담하기", "Talk to us")}</a>
            <a href="#gallery" className="btn-outline">{t("미디어 갤러리", "Media Gallery")}</a>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS (countup + glow) ===== */}
      <section className="border-y border-base-line bg-base-soft/30">
        <div className="container-x grid grid-cols-2 gap-8 py-16 lg:grid-cols-4">
          {marketStats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="text-4xl font-bold text-gold-grad glow sm:text-5xl">
                <CountUp value={s.v} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-2 text-sm text-gray-400">{L(s.t)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== GALLERY (masonry + lightbox + watermark) ===== */}
      <section id="gallery" className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("미디어 갤러리", "Media Gallery")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>두바이 도심을 <span className="text-gold-grad">밝히는 자리.</span></>) : (<>Spaces that <span className="text-gold-grad">light up Dubai.</span></>)}
            </h2>
          </Reveal>

          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map((g) => (
              <button
                key={g.poster}
                onClick={() => setLb({ src: g.video, cap: L(g.name) })}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-base-line text-left"
              >
                <LazyVideo
                  src={g.video}
                  poster={g.poster}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* gold hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gold-deep/85 via-base/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 font-semibold text-white"><Pin /> {L(g.name)}</span>
                  <span className="mt-1 block text-xs text-white/80">{t("클릭하여 확대", "Click to enlarge")}</span>
                </div>
                {/* watermark */}
                <span className="pointer-events-none absolute bottom-1.5 right-2 text-[10px] leading-none text-white/40">
                  *Visualization image / 가상 이미지
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POSITIONING ===== */}
      <section className="section bg-base-soft/40">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Positioning</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>이건 광고가 아닙니다.<br /><span className="text-gold-grad">선택된 브랜드만 올라가는 자리.</span></>) : (<>This isn't advertising.<br /><span className="text-gold-grad">It's a place few brands reach.</span></>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "두바이의 핵심 미디어는 단순한 노출이 아니라 브랜드의 격을 결정합니다. 도시의 가장 강력한 위치에 오른 브랜드는, 수백만 명의 시선 속에서 기억됩니다.",
                "Dubai's core media doesn't just create exposure — it sets your brand's stature. Brands that reach the city's most powerful spots are remembered, across millions of eyes."
              )}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <h3 className="text-lg font-semibold text-white">{t("두바이에서 가장 강력한 위치", "Dubai's most powerful locations")}</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                {[
                  { ko: "전 세계 자본이 모이는 글로벌 허브", en: "A global hub where world capital converges" },
                  { ko: "매일 수백만 명의 시선이 교차하는 동선", en: "Routes crossed by millions of eyes daily" },
                  { ko: "세계 최고 수준의 구매력을 가진 도시", en: "A city with world-leading purchasing power" },
                  { ko: "결과 — 당신의 브랜드가 '기억'됩니다", en: "The result — your brand is remembered" },
                ].map((f) => (
                  <li key={f.en} className="flex gap-3"><span className="text-gold">✓</span> {L(f)}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== MEDIA LOCATIONS (pin + glow) ===== */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("미디어 위치", "Media Locations")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>두바이 핵심 <span className="text-gold-grad">노출 거점.</span></>) : (<>Dubai's key <span className="text-gold-grad">exposure points.</span></>)}
            </h2>
          </Reveal>
          <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mediaLocations.map((m) => (
              <motion.div
                key={m.title}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="card group transition-shadow duration-300 hover:border-gold/60 hover:shadow-gold"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/10"><Pin /></span>
                  <h3 className="text-xl font-semibold text-white group-hover:text-gold">{m.title}</h3>
                </div>
                <p className="mt-2 text-xs text-gold">{L(m.en)}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{L(m.desc)}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="section bg-base-soft/40">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("집행 프로세스", "Process")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>문의에서 집행까지 <span className="text-gold-grad">4단계.</span></>) : (<>Inquiry to launch — <span className="text-gold-grad">4 steps.</span></>)}
            </h2>
          </Reveal>
          <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-4">
            {process.map((p) => (
              <motion.div key={p.step} variants={staggerItem} className="card">
                <div className="text-2xl font-bold text-gold-grad">{p.step}</div>
                <h3 className="mt-3 font-semibold text-white">{L(p.title)}</h3>
                <p className="mt-2 text-sm text-gray-400">{L(p.desc)}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("자주 묻는 질문", "FAQ")}</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">FAQ</h2>
          </Reveal>
          <StaggerGrid className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <motion.div key={f.q.en} variants={staggerItem} className="card">
                <h3 className="font-semibold text-white">Q. {L(f.q)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{L(f.a)}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section bg-base-soft/40">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t("상담하기", "Contact")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>두바이에서 가장 강력한 위치에 <span className="text-gold-grad">브랜드를 올리세요.</span></>) : (<>Put your brand in <span className="text-gold-grad">Dubai's strongest spots.</span></>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "집행 시기와 예산만 알려주시면, 최적의 미디어 믹스와 견적을 제안합니다. 영업일 1일 내 회신드립니다.",
                "Tell us your timing and budget — we'll propose the optimal media mix and quote, with a reply within one business day."
              )}
            </p>
            <a href="mailto:business@goldensnow.ae" className="mt-8 inline-flex items-center gap-3 text-sm text-gray-300 hover:text-gold">
              <span className="text-gold">✉</span> business@goldensnow.ae
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <ContactForm defaultService="OOH" serviceOptions={serviceOptions} />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <Lightbox src={lb?.src ?? null} caption={lb?.cap} onClose={() => setLb(null)} />
    </div>
  );
}
