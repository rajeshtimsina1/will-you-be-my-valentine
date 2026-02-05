import { butterfliesBackground } from "https://unpkg.com/threejs-toys@0.0.7/build/threejs-toys.module.cdn.min.js";

const app = document.getElementById("app");

/** ====== CONFIG (same as landing) ====== */
const TRACK_URL = "http://YOUR_SERVER_IP:5055/track";
const TRACK_KEY = "PUT_THE_SAME_SECRET_AS_TRACKER_API_KEY";
/** ====================================== */

function getName() {
  const url = new URL(window.location.href);
  const nameFromUrl = (url.searchParams.get("name") || "").trim();
  const nameFromLS = (localStorage.getItem("valentine_name") || "").trim();
  return nameFromUrl || nameFromLS || "Unknown";
}

async function track(event, payload = {}) {
  try {
    await fetch(TRACK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": TRACK_KEY,
      },
      body: JSON.stringify({
        event,
        page: "yes_page",
        ...payload,
      }),
    });
  } catch {
    // ignore
  }
}

/* Butterflies — force LIGHT background */
butterfliesBackground({
  el: app,
  eventsEl: document.body,
  gpgpuSize: 46,
  background: 0xffffff,
  material: "basic",
  materialParams: { transparent: true, alphaTest: 0.5 },
  texture: "https://assets.codepen.io/33787/butterflies.png",
  textureCount: 4,
  wingsScale: [1, 1, 1],
  wingsWidthSegments: 8,
  wingsHeightSegments: 8,
  wingsSpeed: 0.9,
  wingsDisplacementScale: 1.28,
  noiseCoordScale: 0.01,
  noiseTimeCoef: 0.00055,
  noiseIntensity: 0.0029,
  attractionRadius1: 100,
  attractionRadius2: 160,
  maxVelocity: 0.12,
});

/* Track that she reached the YES page */
track("yes_page_view", { name: getName() });

/* Envelope controls — OPEN ONLY by button */
const envelope = document.getElementById("envelope");
const btnOpen = document.getElementById("open");
const btnClose = document.getElementById("reset");

function openEnvelope() {
  envelope.classList.add("open");
  envelope.classList.remove("close");

  // notify you beautifully :)
  track("letter_opened", { name: getName() });
}

function closeEnvelope() {
  envelope.classList.add("close");
  envelope.classList.remove("open");
}

/* disable opening via envelope click */
envelope.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

btnOpen.addEventListener("click", openEnvelope);
btnClose.addEventListener("click", closeEnvelope);

closeEnvelope();
