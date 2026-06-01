import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const ALLOWED_CHAT = Deno.env.get("TELEGRAM_ALLOWED_CHAT_ID") ?? "283159746";
const WEBHOOK_SECRET = Deno.env.get("TELEGRAM_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const BASE_SYSTEM =
  "You are Bruno's mobile AI assistant for Growtoday Holdings — an AI-first solo venture studio in Dubai bridging Korea and the Middle East (Revenue First, lean automation). " +
  "Help with marketing, sales, strategy, copywriting, and quick decisions. Be concise and actionable. Reply in Korean unless the user writes in another language.";

const VENTURES: Record<string, { name: string; ctx: string }> = {
  gs: {
    name: "Goldensnow Media Group",
    ctx: "Goldensnow Media Group — Dubai creative production house. Services: 360 Digital Twin, OOH advertising, brand films, Dubai37 festival. Target: Korean companies entering Dubai / the Middle East. Contact business@goldensnow.ae.",
  },
  dt: {
    name: "DubaiToday",
    ctx: "DubaiToday — Dubai food & lifestyle media platform (dubaitoday_eat Instagram automation). Restaurant/lifestyle content for the Dubai market.",
  },
  drive: {
    name: "DubaiDrive",
    ctx: "DubaiDrive — Dubai rental-car aggregator (dubai-drive.lovable.app). Compares and aggregates rental cars across Dubai.",
  },
  "37": {
    name: "Dubai 37 Film Festival",
    ctx: "Dubai 37 Sec Film Festival by Goldensnow — a 37-second short-film festival. Theme 'Dubai, My Life is...', Grand Prize 5,000 AED, Open Call March 7 2026, dubai37.com.",
  },
};

const HELP =
  "🤖 Growtoday OS 봇\n\n" +
  "/status — 전체 프로젝트 현황\n" +
  "/gs [질문] — Goldensnow 작업\n" +
  "/dt [질문] — DubaiToday 작업\n" +
  "/drive [질문] — DubaiDrive 작업\n" +
  "/37 [질문] — Dubai37 작업\n" +
  "/help — 명령어 목록\n\n" +
  "💬 명령어 없이 자유롭게 질문해도 Claude가 답합니다.";

async function tg(method: string, body: unknown): Promise<void> {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function askClaude(text: string, extraCtx = ""): Promise<string> {
  const system = extraCtx ? `${BASE_SYSTEM}\n\nFocus venture context:\n${extraCtx}` : BASE_SYSTEM;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: text }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return `⚠️ Claude API 오류 (${res.status}): ${err.slice(0, 200)}`;
  }
  const data = await res.json();
  return data?.content?.[0]?.text ?? "응답을 생성하지 못했습니다.";
}

async function leadCount(): Promise<string> {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/goldensnow_leads?select=id`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: "count=exact" },
    });
    const range = r.headers.get("content-range");
    return range?.split("/")?.[1] ?? "?";
  } catch {
    return "?";
  }
}

async function statusReport(): Promise<string> {
  const leads = await leadCount();
  return (
    "📊 Growtoday OS 현황\n\n" +
    "🏢 활성 벤처\n" +
    "• Goldensnow — Dubai 크리에이티브 프로덕션  /gs\n" +
    "• DubaiToday — 맛집·라이프스타일 미디어  /dt\n" +
    "• DubaiDrive — 렌터카 애그리게이터  /drive\n" +
    "• Dubai37 — 37초 필름 페스티벌  /37\n\n" +
    `📥 Goldensnow 문의 누적: ${leads}건\n\n` +
    "💡 자세한 작업은 각 명령어 뒤에 질문을 붙이세요. 예) /gs 이번주 영업 우선순위 3개"
  );
}

Deno.serve(async (req: Request) => {
  if (WEBHOOK_SECRET) {
    const got = req.headers.get("x-telegram-bot-api-secret-token");
    if (got !== WEBHOOK_SECRET) return new Response("forbidden", { status: 401 });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return new Response("ok");
  }

  const msg = update?.message ?? update?.edited_message;
  const chatId = msg?.chat?.id ? String(msg.chat.id) : "";
  const raw = (msg?.text ?? "").trim();
  if (!chatId || !raw) return new Response("ok");

  if (chatId !== ALLOWED_CHAT) {
    await tg("sendMessage", { chat_id: chatId, text: "🔒 이 봇은 비공개입니다." });
    return new Response("ok");
  }

  // Parse command
  const firstWord = raw.split(/\s+/)[0];
  const rest = raw.slice(firstWord.length).trim();
  const cmd = firstWord.startsWith("/") ? firstWord.slice(1).split("@")[0].toLowerCase() : "";

  let reply: string;

  if (cmd === "start" || cmd === "help") {
    reply = HELP;
  } else if (cmd === "status") {
    reply = await statusReport();
  } else if (cmd in VENTURES) {
    const v = VENTURES[cmd];
    if (!rest) {
      reply = `🏷️ ${v.name}\n\n무엇을 도와드릴까요? 명령어 뒤에 질문을 붙여주세요.\n예) /${cmd} 이번주 할 일 / 콜드메일 초안 / 콘텐츠 아이디어`;
    } else {
      await tg("sendChatAction", { chat_id: chatId, action: "typing" });
      reply = await askClaude(rest, v.ctx);
    }
  } else {
    // Free conversation
    await tg("sendChatAction", { chat_id: chatId, action: "typing" });
    reply = await askClaude(raw);
  }

  await tg("sendMessage", { chat_id: chatId, text: reply.slice(0, 4000) });
  return new Response("ok");
});
