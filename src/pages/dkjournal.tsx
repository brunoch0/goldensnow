import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import Lightbox from "../components/Lightbox";
import { Reveal, StaggerGrid, staggerItem, CountUp } from "../components/motion";
import { useLang } from "../lib/i18n";

type Bi = { ko: string; en: string };

const stats: { v: number; prefix?: string; suffix: string; t: Bi }[] = [
  { v: 17, suffix: "+", t: { ko: "2008년부터 이어온 역사 (년)", en: "Years of history since 2008" } },
  { v: 5000, suffix: "", t: { ko: "주간 발행 부수", en: "Copies printed weekly" } },
  { v: 6, suffix: "", t: { ko: "UAE 전역 배포 지역", en: "Distribution regions across UAE" } },
  { v: 2, suffix: "", t: { ko: "지면 + 온라인 동시 노출 채널", en: "Channels — print + online" } },
];

const regions = ["Dubai", "Abu Dhabi", "Al Ain", "Ras Al Khaimah", "Ruwais", "Barakah"];

const mediaPreviews: { img: string; name: Bi; desc: Bi }[] = [
  { img: "/assets/visuals/dkjournal/print-paper.jpg", name: { ko: "지면 신문", en: "Print Edition" }, desc: { ko: "주간 발행 · UAE 전역 6개 지역 배포", en: "Weekly print · distributed across 6 UAE regions" } },
  { img: "/assets/visuals/dkjournal/online-home.jpg", name: { ko: "온라인 — dkjournal.co.kr", en: "Online — dkjournal.co.kr" }, desc: { ko: "뉴스 · 커뮤니티 · 업체홍보 동시 노출", en: "News, community, and business listings" } },
  { img: "/assets/visuals/dkjournal/online-ads.jpg", name: { ko: "온라인 배너 광고", en: "Online Banner Ads" }, desc: { ko: "메인 배너 · 업체 페이지 광고 자리", en: "Main banners and business page placements" } },
];

const printProducts: { type: string; size: string; position: Bi }[] = [
  { type: "S1 Box", size: "57×44mm", position: { ko: "1면", en: "Page 1" } },
  { type: "S2 Box", size: "57×61mm", position: { ko: "15면", en: "Page 15" } },
  { type: "M Box", size: "106×54mm", position: { ko: "1면", en: "Page 1" } },
  { type: "Main 1 Box", size: "179×94mm", position: { ko: "15면", en: "Page 15" } },
  { type: "Main 2 Box", size: "300×135mm", position: { ko: "1면", en: "Page 1" } },
  { type: "1/8", size: "148×93mm", position: { ko: "전체면", en: "All pages" } },
  { type: "1/6", size: "148×125mm", position: { ko: "2~15면", en: "Pages 2–15" } },
  { type: "1/4", size: "148×190mm", position: { ko: "2~15면", en: "Pages 2–15" } },
  { type: "1/3", size: "300×125mm", position: { ko: "2~15면", en: "Pages 2–15" } },
  { type: "1/2", size: "300×190mm", position: { ko: "2~15면", en: "Pages 2–15" } },
  { type: "전면 / Full Page", size: "300×440mm", position: { ko: "커버", en: "Cover" } },
];

const onlineProducts: { type: Bi; size: string }[] = [
  { type: { ko: "메인 배너 상단", en: "Main banner — top" }, size: "468×60" },
  { type: { ko: "메인 배너 좌측", en: "Main banner — left" }, size: "160×200" },
  { type: { ko: "메인 배너 우측", en: "Main banner — right" }, size: "250×125" },
  { type: { ko: "메인 배너 중간", en: "Main banner — middle" }, size: "650×118 / 180×130" },
  { type: { ko: "업체 리스트 로고", en: "Business list logo" }, size: "180×130" },
  { type: { ko: "업체 페이지 로고", en: "Business page logo" }, size: "600×400" },
  { type: { ko: "업체 페이지 AD", en: "Business page AD" }, size: "800×500 / 800×∞" },
];

const process: { step: string; title: Bi; desc: Bi }[] = [
  { step: "01", title: { ko: "문의", en: "Inquiry" }, desc: { ko: "광고 목적과 예산을 공유해 주세요.", en: "Share your advertising goal and budget." } },
  { step: "02", title: { ko: "상품 제안", en: "Proposal" }, desc: { ko: "최적의 지면·온라인 믹스를 제안합니다.", en: "We propose the optimal print + online mix." } },
  { step: "03", title: { ko: "소재 제작", en: "Creative" }, desc: { ko: "필요시 Golden Snow가 디자인을 지원합니다.", en: "Golden Snow supports design when needed." } },
  { step: "04", title: { ko: "게재 및 리포트", en: "Run & report" }, desc: { ko: "게재 후 집행 결과를 리포트로 전달합니다.", en: "After publication, we deliver a results report." } },
];

function Pin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
      <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function LandingDKJournal() {
  const { lang, t } = useLang();
  const L = <T extends Bi>(o: T) => o[lang];
  const [lb, setLb] = useState<{ src: string; cap: string } | null>(null);
  const [failedImgs, setFailedImgs] = useState<Set<string>>(new Set());
  const visiblePreviews = mediaPreviews.filter((p) => !failedImgs.has(p.img));

  const serviceOptions = [
    { value: "DK Journal — Print", label: t("지면 광고", "Print ads") },
    { value: "DK Journal — Online", label: t("온라인 광고", "Online ads") },
    { value: "DK Journal — Print+Online", label: t("지면 + 온라인 둘다", "Print + Online") },
  ];

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 120]);

  return (
    <div className="bg-base">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        {/* typographic backdrop */}
        <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ y: heroY }}>
          <span className="select-none text-[28vw] font-bold leading-none tracking-tighter text-white/[0.03]">DK</span>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base/60" />
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
            DK Journal · {t("UAE 1위 한인신문", "UAE's No.1 Korean Newspaper")}
          </motion.p>
          <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {(lang === "ko"
              ? ["UAE 한인 커뮤니티에 닿는", "가장 확실한 길"]
              : ["The surest way to reach", "UAE's Korean community"]
            ).map((line, i) => (
              <motion.span key={i} className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                {i === 1 ? <span className="text-gold glow">{line}</span> : line}
              </motion.span>
            ))}
          </h1>
          <motion.p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            {t(
              "Since 2008 · UAE 1위 한인신문 DK Journal — Golden Snow가 광고 집행을 대행합니다.",
              "Since 2008 · DK Journal, UAE's leading Korean newspaper — ad placement managed by Golden Snow."
            )}
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}>
            <a href="#contact" className="btn-gold">{t("광고 문의하기", "Inquire about ads")}</a>
            <a href="#products" className="btn-outline">{t("광고 상품 보기", "View ad products")}</a>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-base-line bg-base-soft/30">
        <div className="container-x grid grid-cols-2 gap-8 py-16 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="text-4xl font-bold text-gold-grad glow sm:text-5xl">
                <CountUp value={s.v} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-gray-400">{L(s.t)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== ABOUT / DISTRIBUTION ===== */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">{t("매체 소개", "About the Media")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>17년간 UAE 한인이 <span className="text-gold-grad">매주 펼쳐온 신문.</span></>) : (<>The paper UAE Koreans have <span className="text-gold-grad">opened weekly for 17 years.</span></>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "DK Journal은 2008년 창간 이래 UAE 한인 커뮤니티의 소식과 생활 정보를 전해온 1위 한인신문입니다. 주간 5,000부가 UAE 전역 6개 지역에 배포되며, 온라인(dkjournal.co.kr)에서 뉴스·커뮤니티·업체홍보로 동시 노출됩니다.",
                "Founded in 2008, DK Journal is the leading Korean newspaper in the UAE. 5,000 copies are distributed weekly across 6 regions, with simultaneous online exposure at dkjournal.co.kr — news, community, and business listings."
              )}
            </p>
            <a href="https://dkjournal.co.kr" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-gold hover:underline">
              dkjournal.co.kr ↗
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><Pin /> {t("배포 지역", "Distribution Regions")}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {regions.map((r) => (
                  <div key={r} className="rounded-xl border border-base-line bg-base/60 px-4 py-3 text-sm text-gray-200">
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== MEDIA PREVIEW (print + online) ===== */}
      {visiblePreviews.length > 0 && (
        <section className="section bg-base-soft/40">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow">{t("매체 미리보기", "Media Preview")}</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
                {lang === "ko" ? (<>광고가 노출되는 <span className="text-gold-grad">지면과 온라인.</span></>) : (<>Where your ad appears — <span className="text-gold-grad">print and online.</span></>)}
              </h2>
            </Reveal>
            <StaggerGrid className={`mt-12 grid gap-6 ${visiblePreviews.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-xl"}`}>
              {visiblePreviews.map((p) => (
                <motion.div key={p.img} variants={staggerItem}>
                  <button
                    onClick={() => setLb({ src: p.img, cap: L(p.name) })}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-base-line bg-white/[0.02] text-left transition-colors hover:border-gold/60"
                  >
                    <img
                      src={p.img}
                      alt={L(p.name)}
                      loading="lazy"
                      onError={() => setFailedImgs((s) => new Set(s).add(p.img))}
                      className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-3 right-4 text-xs text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {t("클릭하여 확대", "Click to enlarge")}
                    </span>
                  </button>
                  <h3 className="mt-4 font-semibold text-white">{L(p.name)}</h3>
                  <p className="mt-1 text-sm text-gray-400">{L(p.desc)}</p>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* ===== PRINT PRODUCTS ===== */}
      <section id="products" className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("지면 광고 상품", "Print Ad Products")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>지면에서 <span className="text-gold-grad">가장 눈에 띄는 자리.</span></>) : (<>The most visible <span className="text-gold-grad">spots in print.</span></>)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-base-line">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-base-line bg-base/60 text-gold">
                    <th className="px-5 py-4 font-semibold">{t("광고 유형", "Ad type")}</th>
                    <th className="px-5 py-4 font-semibold">{t("사이즈", "Size")}</th>
                    <th className="px-5 py-4 font-semibold">{t("위치", "Position")}</th>
                  </tr>
                </thead>
                <tbody>
                  {printProducts.map((p) => (
                    <tr key={p.type} className="border-b border-base-line/60 text-gray-300 transition-colors last:border-0 hover:bg-gold/5">
                      <td className="px-5 py-3.5 font-medium text-white">{p.type}</td>
                      <td className="px-5 py-3.5">{p.size}</td>
                      <td className="px-5 py-3.5">{L(p.position)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== ONLINE PRODUCTS ===== */}
      <section className="section bg-base-soft/40">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("온라인 광고 상품", "Online Ad Products")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>dkjournal.co.kr에서 <span className="text-gold-grad">한 번 더 노출.</span></>) : (<>One more exposure <span className="text-gold-grad">on dkjournal.co.kr.</span></>)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-base-line">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-base-line bg-base/60 text-gold">
                    <th className="px-5 py-4 font-semibold">{t("광고 유형", "Ad type")}</th>
                    <th className="px-5 py-4 font-semibold">{t("사이즈 (px)", "Size (px)")}</th>
                  </tr>
                </thead>
                <tbody>
                  {onlineProducts.map((p) => (
                    <tr key={p.type.en} className="border-b border-base-line/60 text-gray-300 transition-colors last:border-0 hover:bg-gold/5">
                      <td className="px-5 py-3.5 font-medium text-white">{L(p.type)}</td>
                      <td className="px-5 py-3.5">{p.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="card mx-auto max-w-3xl text-center">
              <p className="eyebrow">{t("가격 안내", "Pricing")}</p>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                {lang === "ko" ? (<>광고 위치와 기간에 따라 <span className="text-gold-grad">견적이 달라집니다.</span></>) : (<>Quotes vary by <span className="text-gold-grad">placement and duration.</span></>)}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-300">
                {t(
                  "문의 주시면 1영업일 내 맞춤 견적을 보내드립니다.",
                  "Reach out and we'll send a tailored quote within one business day."
                )}
              </p>
              <a href="#contact" className="btn-gold mt-8 inline-flex">{t("맞춤 견적 받기", "Get a custom quote")}</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="section bg-base-soft/40">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("진행 프로세스", "Process")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>문의에서 게재까지 <span className="text-gold-grad">4단계.</span></>) : (<>Inquiry to publication — <span className="text-gold-grad">4 steps.</span></>)}
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

      {/* ===== CREATIVE SUBMISSION GUIDE ===== */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="card mx-auto max-w-3xl border-dashed text-center">
              <p className="eyebrow">{t("소재 제출 가이드", "Creative Submission Guide")}</p>
              <p className="mt-4 text-lg font-medium text-white">
                {t(
                  "광고 소재 제출 양식 및 가이드라인은 곧 업데이트됩니다.",
                  "Creative submission forms and guidelines are coming soon."
                )}
              </p>
              <p className="mt-3 text-sm text-gray-400">
                {t(
                  "그 전까지는 문의 시 담당자가 직접 안내해 드립니다.",
                  "Until then, our team will guide you directly when you inquire."
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section bg-base-soft/40">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t("광고 문의", "Contact")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>UAE 한인 커뮤니티에 <span className="text-gold-grad">브랜드를 알리세요.</span></>) : (<>Put your brand in front of <span className="text-gold-grad">UAE's Korean community.</span></>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "광고 목적과 예산을 알려주시면, 최적의 지면·온라인 믹스와 견적을 제안드립니다.",
                "Tell us your goal and budget — we'll propose the optimal print + online mix and quote."
              )}
            </p>
            <a href="mailto:business@goldensnow.ae" className="mt-8 inline-flex items-center gap-3 text-sm text-gray-300 hover:text-gold">
              <span className="text-gold">✉</span> business@goldensnow.ae
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <ContactForm defaultService="DK Journal — Print+Online" serviceOptions={serviceOptions} />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <Lightbox src={lb?.src ?? null} caption={lb?.cap} onClose={() => setLb(null)} />
    </div>
  );
}
