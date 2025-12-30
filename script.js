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
    "Okay, last warning… press yes, or I’m asking again! 😏"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}