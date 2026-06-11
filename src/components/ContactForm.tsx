import { useState, FormEvent } from "react";
import { submitLead } from "../lib/supabase";
import { useLang } from "../lib/i18n";

interface Props {
  defaultService?: string;
  serviceOptions?: { value: string; label: string }[];
}

const COPY = {
  ko: {
    name: "이름 *",
    company: "회사명",
    email: "이메일 *",
    phone: "연락처",
    msgPlaceholder: "어떤 프로젝트를 준비 중이신지 간단히 적어주세요…",
    submit: "문의 보내기",
    sending: "전송 중…",
    success: "감사합니다. 영업일 기준 1일 내 회신드리겠습니다.",
    error: "오류가 발생했습니다. business@goldensnow.ae 로 직접 문의해 주세요.",
  },
  en: {
    name: "Name *",
    company: "Company",
    email: "Email *",
    phone: "Phone",
    msgPlaceholder: "Tell us briefly what you're looking for…",
    submit: "Send Inquiry",
    sending: "Sending…",
    success: "Thank you. We'll get back to you within 1 business day.",
    error: "Something went wrong. Please email business@goldensnow.ae directly.",
  },
};

export default function ContactForm({ defaultService = "general", serviceOptions }: Props) {
  const { lang, t } = useLang();
  const c = COPY[lang];
  const options =
    serviceOptions ?? [
      { value: "general", label: t("일반 문의", "General inquiry") },
      { value: "360", label: "360° Digital Twin" },
      { value: "OOH", label: t("OOH 옥외광고", "OOH Advertising") },
      { value: "creative", label: t("크리에이티브 프로덕션", "Creative Production") },
      { value: "dubai37", label: "Dubai 37 Festival" },
    ];

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service_type: defaultService,
    message: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    const { error } = await submitLead(form);
    if (error) {
      console.error("Lead submit error:", error.message);
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", service_type: defaultService, message: "" });
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-3xl">✅</div>
        <p className="font-medium text-white">{c.success}</p>
        <a href="mailto:business@goldensnow.ae" className="text-sm text-gold hover:underline">
          business@goldensnow.ae
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="input" placeholder={c.name} value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input className="input" placeholder={c.company} value={form.company} onChange={(e) => update("company", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="email" className="input" placeholder={c.email} value={form.email} onChange={(e) => update("email", e.target.value)} required />
        <input className="input" placeholder={c.phone} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>
      <select className="input" value={form.service_type} onChange={(e) => update("service_type", e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-base">
            {o.label}
          </option>
        ))}
      </select>
      <textarea
        className="input min-h-[120px] resize-y"
        placeholder={c.msgPlaceholder}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
      />
      {status === "error" && <p className="text-sm text-red-400">{c.error}</p>}
      <button type="submit" className="btn-gold w-full" disabled={status === "loading"}>
        {status === "loading" ? c.sending : c.submit}
      </button>
    </form>
  );
}
