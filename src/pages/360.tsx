import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { Reveal, StaggerGrid, staggerItem } from "../components/motion";
import LazyVideo from "../components/LazyVideo";
import { useLang } from "../lib/i18n";

type Bi = { ko: string; en: string };

const industries: { img: string; title: Bi; desc: Bi }[] = [
  { img: "/assets/visuals/industries/real-estate.jpg", title: { ko: "부동산", en: "Real Estate" }, desc: { ko: "분양/임대 매물을 24시간 가상 투어로. 해외 바이어가 현장 방문 없이 공간을 경험합니다.", en: "24/7 virtual tours for sales & rentals — overseas buyers explore without a site visit." } },
  { img: "/assets/visuals/industries/hotel.jpg", title: { ko: "호텔 · 리조트", en: "Hospitality" }, desc: { ko: "객실·연회장·시설을 실측 기반 디지털 트윈으로. 예약 전환율을 높입니다.", en: "Rooms, ballrooms, and facilities as precise digital twins — lifting booking conversion." } },
  { img: "/assets/visuals/industries/retail.jpg", title: { ko: "리테일 · F&B", en: "Retail & F&B" }, desc: { ko: "매장 공간을 온라인 자산으로. 가맹 영업과 브랜드 경험을 동시에.", en: "Turn stores into online assets — for franchise sales and brand experience." } },
  { img: "/assets/visuals/industries/healthcare.jpg", title: { ko: "병원 · 클리닉", en: "Healthcare" }, desc: { ko: "의료 관광 고객에게 시설 신뢰도를 시각적으로 전달. 내원 전 안심을 제공합니다.", en: "Show medical-tourism clients your facilities visually — trust before they arrive." } },
  { img: "/assets/visuals/industries/education.jpg", title: { ko: "교육 · 뮤지엄", en: "Education & Museum" }, desc: { ko: "캠퍼스·전시·갤러리를 글로벌 관객에게 360°로. 유학·입학·전시 마케팅에 활용합니다.", en: "Campuses, exhibitions, and galleries in 360° for global audiences." } },
  { img: "/assets/visuals/industries/architecture.jpg", title: { ko: "건축 · 건설", en: "Architecture / Construction" }, desc: { ko: "현장 모니터링과 시공 기록 문서화. 원격으로 진행 상황을 공유하고 관리합니다.", en: "On-site monitoring and construction documentation — managed remotely." } },
];

const effects: { n: string; t: Bi; d: Bi }[] = [
  { n: "70%↓", t: { ko: "현장 방문 감소", en: "Fewer site visits" }, d: { ko: "원격으로 공간을 미리 확인 — 불필요한 방문과 출장 비용을 줄입니다.", en: "Preview spaces remotely — cut unnecessary visits and travel cost." } },
  { n: "3×", t: { ko: "마케팅 효과", en: "Marketing impact" }, d: { ko: "정적인 사진 대비 체류시간·문의 전환이 평균 3배까지 상승.", en: "Up to 3× dwell time and inquiry conversion vs. static photos." } },
  { n: "24/7", t: { ko: "글로벌 접근", en: "Global access" }, d: { ko: "시차·국경 없이 전 세계 누구나 언제든 공간을 탐험.", en: "Anyone, anywhere explores the space anytime — no borders, no time zones." } },
];

const process: { step: string; title: Bi; desc: Bi }[] = [
  { step: "01", title: { ko: "상담 · 현장 분석", en: "Consult & assess" }, desc: { ko: "공간 규모와 목적을 파악하고 촬영 범위를 설계합니다.", en: "We scope the space and goals, then plan the capture." } },
  { step: "02", title: { ko: "Matterport Pro3 촬영", en: "Matterport Pro3 scan" }, desc: { ko: "실측 기반 고정밀 3D 스캔으로 공간을 디지털화합니다.", en: "Centimeter-accurate 3D scanning digitizes the space." } },
  { step: "03", title: { ko: "디지털 트윈 제작", en: "Build digital twin" }, desc: { ko: "도면·태그·동선·브랜딩을 입혀 인터랙티브 자산으로 완성.", en: "Floor plans, tags, navigation, and branding make it interactive." } },
  { step: "04", title: { ko: "납품 · 운영 지원", en: "Deliver & support" }, desc: { ko: "웹/홈페이지 임베드, 공유 링크, 분석까지 연동 지원.", en: "Web embed, shareable links, and analytics — fully supported." } },
];

const features: Bi[] = [
  { ko: "실측 기반 정밀 3D — 도면·치수 자동 추출", en: "Precise measured 3D — auto floor plans & dimensions" },
  { ko: "공간 내 정보 태그 (제품·가격·설명) 삽입", en: "In-space info tags (products, prices, descriptions)" },
  { ko: "웹·모바일 어디서나 임베드, 별도 앱 불필요", en: "Embed anywhere on web & mobile — no app needed" },
  { ko: "VR 헤드셋 지원으로 몰입형 경험 제공", en: "VR headset support for immersive viewing" },
];

const demos = [
  "https://my.matterport.com/show/?m=2Atjh53SJdD&ss=11&sr=-.11",
  "https://my.matterport.com/show/?m=nUm8BPQmRnD",
];

export default function Landing360() {
  const { lang, t } = useLang();
  const L = <T extends Bi>(o: T) => o[lang];
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 160]);

  const serviceOptions = [
    { value: "360", label: "360° Digital Twin" },
    { value: "general", label: t("기타 문의", "Other inquiry") },
  ];

  return (
    <div className="bg-base">
      <Navbar />

      {/* HERO (parallax video) */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <LazyVideo
            src="/assets/visuals/hero/360-hero.mp4"
            poster="/assets/visuals/goldensnow_keyvisual.jpg"
            className="absolute inset-0 h-[115%] w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-base/78" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-base/55" />
        <motion.div
          className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-gold/15 blur-[120px]"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="container-x relative">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            360° Digital Twin · Matterport Pro3
          </motion.p>
          <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {(lang === "ko"
              ? ["두바이 진출,", "공간을 디지털 자산으로."]
              : ["Enter Dubai —", "space into a digital asset."]
            ).map((line, i) => (
              <motion.span key={i} className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                {i === 1 ? <span className="text-gold-grad glow">{line}</span> : line}
              </motion.span>
            ))}
          </h1>
          <motion.p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            {t(
              "현장에 가지 않아도 전 세계 어디서나 당신의 공간을 경험합니다. Matterport Pro3 실측 스캔으로 부동산·호텔·리테일·병원·교육 공간을 24시간 작동하는 디지털 트윈으로 만듭니다.",
              "Experience your space from anywhere. With Matterport Pro3 measured scanning, we turn real estate, hotels, retail, healthcare, and education spaces into 24/7 digital twins."
            )}
          </motion.p>
          <p className="mt-2 text-sm text-gray-500">"See it. Explore it. Experience it."</p>
          <motion.div className="mt-10 flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}>
            <a href="#contact" className="btn-gold">{t("무료 상담 신청", "Request a free consult")}</a>
            <Link to="/" className="btn-outline !text-white">{t("회사 소개 보기", "About us")}</Link>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">{t("360° Digital Twin 이란?", "What is 360° Digital Twin?")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>실제 공간을 그대로 옮긴 <span className="text-gold-grad">디지털 트윈.</span></>) : (<>A <span className="text-gold-grad">digital twin</span> of your real space.</>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "360° Digital Twin은 단순한 파노라마 사진이 아닙니다. 전문 장비 Matterport Pro3로 공간을 밀리미터 단위로 스캔해, 실제로 걸어다니듯 둘러보고 거리를 측정하며 정보를 확인할 수 있는 인터랙티브 3D 자산입니다.",
                "A 360° Digital Twin is not just a panorama. With the professional Matterport Pro3, we scan your space to millimeter accuracy, creating an interactive 3D asset you can walk through, measure, and explore."
              )}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-300">
              {features.map((f) => (
                <li key={f.en} className="flex gap-3"><span className="text-gold">✓</span> {L(f)}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-base-line">
              <img src="/assets/visuals/goldensnow_keyvisual_alt1.jpg" alt="360 Digital Twin" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* LIVE DEMOS */}
      <section className="section bg-base-soft/40">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("라이브 데모", "Live Demos")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {t("실제 제작 사례 — 직접 둘러보세요", "Real projects — explore them yourself")}
            </h2>
          </Reveal>
          <StaggerGrid className="mt-10 grid gap-6 lg:grid-cols-2">
            {demos.map((src, i) => (
              <motion.div key={src} variants={staggerItem} className="overflow-hidden rounded-2xl border border-base-line">
                <iframe title={`Matterport demo ${i + 1}`} src={src} className="aspect-video w-full" allow="fullscreen; xr-spatial-tracking" allowFullScreen />
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("적용 업종", "Industries")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>어떤 공간이든 <span className="text-gold-grad">자산이 됩니다.</span></>) : (<>Any space becomes <span className="text-gold-grad">an asset.</span></>)}
            </h2>
          </Reveal>
          <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <motion.div
                key={i.title.en}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-base-line"
              >
                <img src={i.img} alt={i.title.en} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/75 to-base/20" />
                <div className="relative p-6">
                  <h3 className="text-lg font-semibold text-white">{L(i.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-200">{L(i.desc)}</p>
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* EFFECTS */}
      <section className="section bg-base-soft/40">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("도입 효과", "Impact")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>숫자로 증명되는 <span className="text-gold-grad">변화.</span></>) : (<>Change, <span className="text-gold-grad">proven in numbers.</span></>)}
            </h2>
          </Reveal>
          <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-3">
            {effects.map((e) => (
              <motion.div key={e.t.en} variants={staggerItem} className="card text-center">
                <div className="text-4xl font-bold text-gold-grad glow">{e.n}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{L(e.t)}</h3>
                <p className="mt-2 text-sm text-gray-400">{L(e.d)}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t("진행 프로세스", "Process")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>상담부터 납품까지 <span className="text-gold-grad">4단계.</span></>) : (<>From consult to delivery — <span className="text-gold-grad">4 steps.</span></>)}
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

      {/* CONTACT */}
      <section id="contact" className="section bg-base-soft/40">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t("문의하기", "Contact")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              {lang === "ko" ? (<>공간을 자산으로 바꿀 <span className="text-gold-grad">준비가 되셨나요?</span></>) : (<>Ready to turn space <span className="text-gold-grad">into an asset?</span></>)}
            </h2>
            <p className="mt-6 leading-relaxed text-gray-300">
              {t(
                "두바이 진출을 준비 중인 한국 기업이라면, 360° Digital Twin이 가장 빠른 첫 걸음이 됩니다. 아래 폼을 남겨주시면 영업일 1일 내 회신드립니다.",
                "If you're a Korean company entering Dubai, the 360° Digital Twin is your fastest first step. Leave your details and we'll reply within one business day."
              )}
            </p>
            <a href="mailto:business@goldensnow.ae" className="mt-6 inline-flex items-center gap-3 text-sm text-gray-300 hover:text-gold">
              <span className="text-gold">✉</span> business@goldensnow.ae
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <ContactForm defaultService="360" serviceOptions={serviceOptions} />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
