const messages = [
  "Are you sure?",
  "Really sure??",
  "Are you positive?",
  "Just think about it!",
  "If you say no, I will be really sad...",
  "I will be very sad...",
  "I will be very very very sad...",
  "Ok fine, I will stop asking...",
  "Just kidding, say Yes please! ❤️",
  "Did you press the wrong button? Try again! 😜",
  "Imagine how cute we would be together! 😍",
  "I promise I will buy you chocolate! 🍫",
  "Think of all the fun we will have! 🎉",
  "The universe wants you to say yes! ✨",
  "Even Google would say yes! 🧐",
  "Okay, final chance…😏",
  "Saying yes is free! No hidden fees! 😆",
  "You wouldn't break my heart… right? 💔",
  "Even your phone is telling you to say yes! 📱",
  "I will give you unlimited hugs! 🤗",
  "Think of all the cute couple photos we can take! 📸",
  "I heard saying yes brings good luck! 🍀",
  "Saying no will make the internet slower for you🌐😜",
  "I will sing you a love song… 🎶",
  "I will be your personal cheerleader forever! 📣",
  "Saying yes means you automatically win at life! 🏆",
  "Do not fight destiny… just say Yes! ✨",
  "Okay, last warning… press yes, or I’m asking again! 😏",
];

let messageIndex = 0;

/** ====== CONFIG: change these two ====== */
const TRACK_URL = "http://YOUR_SERVER_IP:5055/track"; // example: http://192.168.100.4:5055/track
const TRACK_KEY = "PUT_THE_SAME_SECRET_AS_TRACKER_API_KEY";
/** ====================================== */
function formatName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function getName() {
  const url = new URL(window.location.href);
  const nameFromUrl = (url.searchParams.get("name") || "").trim();
  const nameFromLS = (localStorage.getItem("valentine_name") || "").trim();

  return formatName(nameFromUrl || nameFromLS || "");
}

window.addEventListener("DOMContentLoaded", () => {
  const name = getName();
  const hello = document.getElementById("helloName");

  if (!hello) return;

  // Graceful fallback
  if (name) {
    hello.textContent = `Hey ${name}… 💙`;
  } else {
    hello.textContent = `Hey you… 💙`;
  }
});

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
        page: "landing",
        ...payload,
      }),
    });
  } catch {
    // silently ignore (don’t break the moment)
  }
}

function handleNoClick() {
  const noButton = document.querySelector(".no-button");
  noButton.textContent = messages[messageIndex];
  messageIndex = (messageIndex + 1) % messages.length;
}

async function handleYesClick() {
  const name = getName();

  if (!name) {
    alert("Type your name first 💙");
    return;
  }

  // store for yes page
  localStorage.setItem("valentine_name", name);

  // notify you
  await track("yes_clicked", { name });

  // go to yes page (also include name in URL)
  window.location.href = `yes_page.html?name=${encodeURIComponent(name)}`;
}
