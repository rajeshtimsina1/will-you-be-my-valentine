import express from "express";

/* =========================
   Compatibility: fetch
========================= */
let fetchFn = global.fetch;
if (!fetchFn) {
  const { default: fetch } = await import("node-fetch");
  fetchFn = fetch;
}

/* =========================
   App setup
========================= */
const app = express();
app.use(express.json());

/* =========================
   CONFIG (ENV VARS)
========================= */
const PORT = process.env.PORT || 5055;
const API_KEY = process.env.TRACKER_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/* =========================
   ENV CHECK
========================= */
function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Missing env var: ${name}`);
    process.exit(1);
  }
}

requireEnv("TRACKER_API_KEY", API_KEY);
requireEnv("TELEGRAM_BOT_TOKEN", TELEGRAM_BOT_TOKEN);
requireEnv("TELEGRAM_CHAT_ID", TELEGRAM_CHAT_ID);

/* =========================
   CORS MIDDLEWARE
========================= */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_, res) => {
  res.json({ ok: true });
});

/* =========================
   TRACK ENDPOINT
========================= */
app.post("/track", async (req, res) => {
  try {
    const key = req.header("x-api-key");
    if (!key || key !== API_KEY) {
      return res.status(401).json({
        ok: false,
        error: "unauthorized",
      });
    }

    const { event, name, page } = req.body || {};
    if (!event) {
      return res.status(400).json({
        ok: false,
        error: "missing event",
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    const ua = (req.headers["user-agent"] || "unknown").slice(0, 120);

    const ts = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
    });

    const safeName = (name || "Unknown").toString().slice(0, 60);
    const safePage = (page || "unknown").toString().slice(0, 80);

    const message = `💙 Valentine Update
• Event: ${event}
• Name: ${safeName}
• Page: ${safePage}
• Time (NPT): ${ts}
• IP: ${ip}
• UA: ${ua}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const resp = await fetchFn(telegramUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Telegram error:", text);
      return res.status(500).json({
        ok: false,
        error: "telegram_failed",
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      ok: false,
      error: "server_error",
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`💌 Tracker running on http://0.0.0.0:${PORT}`);
});
