lucide.createIcons();
function openMail() {
  hideAll();
  document.getElementById("mailPage").style.display = "flex";
}

function openFake() {
  hideAll();
  document.getElementById("fakePage").style.display = "grid";
  lucide.createIcons();
}

function openSMS() {
  hideAll();
  document.getElementById("smsPage").style.display = "flex";
}

function openCall() {
  hideAll();
  document.getElementById("callPage").style.display = "flex";
}

function openPerformed() {
  hideAll();
  document.getElementById("performedPage").style.display = "flex";
}

function openDashboard() {
  hideAll();
  document.getElementById("dashboardPage").style.display = "flex";
  lucide.createIcons(); // 🔥 маңызды
}

function openSettings() {
  hideAll();
  document.getElementById("settingsPage").style.display = "block";
  lucide.createIcons();
}

function openHelp() {
  hideAll();
  document.getElementById("helpPage").style.display = "grid";
  lucide.createIcons();
}
function hideAll() {
  document.getElementById("mailPage").style.display = "none";
  document.getElementById("fakePage").style.display = "none";
  document.getElementById("performedPage").style.display = "none";
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("settingsPage").style.display = "none";
  document.getElementById("helpPage").style.display = "none";

  document.getElementById("callPage").style.display = "none";
  document.getElementById("smsPage").style.display = "none";
  document.getElementById("smsTaskPage").style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const menuItems = document.querySelectorAll(".menu-list li");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});

/* 🔥 RESULT SHOW */
function showResult() {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("rightContent").style.display = "block";
}

/* SMS хабарламалар */
const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("click", showResult);
});

document.addEventListener("DOMContentLoaded", () => {
  const smsList = document.getElementById("smsList");

  const smsTasks = [
    {
      title: "Фишингтік хабарламаны анықтаңыз",
      desc: "SMS-хабарламаны мұқият оқып шығыңыз және оның фишингтік екенін анықтаңыз.",
      level: "Оңай",
      xp: 10,
    },
    {
      title: "Қауіпті сілтемені табыңыз",
      desc: "Берілген SMS-хабарламадағы қауіпті сілтемені анықтап, дұрыс таңдаңыз.",
      level: "Оңай",
      xp: 10,
    },
    {
      title: "Жеке деректерді сұрау",
      desc: "Хабарламада қандай жеке деректер сұралып тұрғанын анықтаңыз.",
      level: "Орташа",
      xp: 15,
    },
    {
      title: "Күмәнді белгілерді анықтаңыз",
      desc: "Қате жазылым, қысым көрсету сияқты белгілерді табыңыз.",
      level: "Орташа",
      xp: 15,
    },
    {
      title: "Қауіпті әрекетті анықтаңыз",
      desc: "Хабарламада қандай қауіпті әрекет сұралып тұрғанын анықтаңыз.",
      level: "Қиын",
      xp: 20,
    },
    {
      title: "Толық талдау жасаңыз",
      desc: "SMS-хабарламаны толық талдап, оның фишинг екенін дәлелдеңіз.",
      level: "Қиын",
      xp: 20,
    },
  ];

  smsTasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className = "sms-item";

    let badgeClass = "easy";
    if (task.level === "Орташа") badgeClass = "medium";
    if (task.level === "Қиын") badgeClass = "hard";

    item.innerHTML = `
      <div class="icon"></div>

      <div class="info">
        <h4>${index + 1}. ${task.title}</h4>
        <p>${task.desc}</p>
      </div>

      <span class="badge ${badgeClass}">${task.level}</span>
      <span class="xp">⭐ ${task.xp} XP</span>

      <button onclick="startTask(${index})">
        Тапсырманы бастау
      </button>
    `;

    smsList.appendChild(item);
  });
});

function startTask() {
  hideAll();
  document.getElementById("smsTaskPage").style.display = "grid"; // flex емес!
}

//sms хабарламалар 2
lucide.createIcons();
let currentIndex = 0;

// ӘР СЛАЙДҚА ЖЕКЕ ЧАТ
const chats = [[], [], [], []];

const messages = [
  `Kaspi: картаңыз бұғатталды.<br><br>
   <a href="#">kaspi-secure-login.xyz</a>`,

  `Kaspi: Сіздің шотыңыз тексерілуде.<br><br>
   <a href="#">secure-kaspi-check.com</a>`,

  `Kaspi: Бонус ұтып алдыңыз!<br><br>
   <a href="#">kaspi-bonus-free.xyz</a>`,

  `Kaspi: Қауіпсіздік үшін аккаунтты жаңартыңыз:<br><br>
   <a href="#">kaspi-update-login.net</a>`,
];

function renderChat() {
  const chat = document.getElementById("chatBox");

  // тек бірінші (Kaspi) хабарламаны қалдырамыз
  chat.innerHTML = `
    <div class="message">
      ${messages[currentIndex]}
    </div>
  `;

  // осы слайдтың барлық хабарларын шығарамыз
  chats[currentIndex].forEach((msg) => {
    let div = document.createElement("div");
    div.className = "message user-message";
    div.innerText = msg;
    chat.appendChild(div);
  });
}

// SEND
function sendMessage() {
  let input = document.getElementById("messageInput");
  let text = input.value.trim();

  if (text === "") return;

  // тек ағымдағы слайдқа сақталады
  chats[currentIndex].push(text);

  input.value = "";

  renderChat();
}

// СЛАЙД АУЫСТЫРУ
function updateSlide() {
  let dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");

  renderChat();
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= messages.length) currentIndex = 0;
  updateSlide();
}

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) currentIndex = messages.length - 1;
  updateSlide();
}

// БЕТ АШЫЛҒАНДА
window.onload = renderChat;
function goBackToList() {
  document.getElementById("smsTaskPage").style.display = "none";
  document.getElementById("smsPage").style.display = "block";
}
// SWITCH (қосып/өшіру)
document.querySelectorAll(".switch").forEach((sw) => {
  sw.addEventListener("click", () => {
    sw.classList.toggle("active");
  });
});

// BUTTONS
// Баптаулар бөліміндегі кнопкалар ғана
document.querySelectorAll(".settings .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.innerText.includes("Өшіру")) {
      alert("Аккаунт өшіріледі!");
    } else if (btn.innerText.includes("Жүктеу")) {
      alert("Деректер жүктелуде...");
    } else {
      alert("Өзгерту функциясы");
    }
  });
});
function showFakeResult() {
  document.querySelectorAll(".site-option").forEach((item) => {
    item.classList.add("result");
  });

  document.getElementById("emptyState2").style.display = "none";
  document.getElementById("rightContent2").style.display = "block";

  lucide.createIcons();
}
function showResult() {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("rightContent").style.display = "flex";
  lucide.createIcons();
}
function toggleHistory() {
  const list = document.getElementById("historyList");
  const hidden = document.getElementById("hiddenBox");
  const clearBtn = document.querySelector(".clear-history");

  if (list.style.display === "none") {
    list.style.display = "block";
    clearBtn.style.display = "block";
    hidden.style.display = "none";
  } else {
    list.style.display = "none";
    clearBtn.style.display = "none";
    hidden.style.display = "block";
  }

  lucide.createIcons();
}
