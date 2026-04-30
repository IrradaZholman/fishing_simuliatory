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

function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

async function saveProfile() {
  const user = getCurrentUser();

  const updatedUser = {
    id: user.id,
    fullname: document.getElementById("editFio").value.trim(),
    username: document.getElementById("editUsername").value.trim(),
    nickname: document.getElementById("editNickname").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    avatar: user.avatar || "",
  };

  if (!updatedUser.id) {
    alert("Алдымен аккаунтқа кіріңіз");
    return;
  }

  if (
    !updatedUser.fullname ||
    !updatedUser.username ||
    !updatedUser.nickname ||
    !updatedUser.email
  ) {
    alert("Барлық жолдарды толтырыңыз");
    return;
  }

  const res = await fetch("/api/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });

  const data = await res.json();

  if (data.success) {
    setCurrentUser(data.user);
    loadProfileFromStorage();
    cancelProfileEdit();
    alert(data.message);
  } else {
    alert(data.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadProfileFromStorage();

  const avatarInput = document.getElementById("avatarInput");

  if (avatarInput) {
    avatarInput.addEventListener("change", async function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        const user = getCurrentUser();
        user.avatar = e.target.result;
        setCurrentUser(user);

        document.getElementById("profileAvatar").style.backgroundImage =
          `url("${user.avatar}")`;
      };

      reader.readAsDataURL(file);
    });
  }
});
function loadHeaderProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.avatar) {
    document.getElementById("headerAvatar").style.backgroundImage =
      `url("${user.avatar}")`;
  }
}
function loadWelcome() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.username) {
    document.getElementById("welcomeText").innerText =
      "Сәлем, " + user.username + "! 👋";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  loadWelcome();
});

function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function editProfile() {
  loadProfileFromStorage();

  const form = document.getElementById("profileForm");
  if (form) {
    form.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfileFromStorage();

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

function loadProfileFromStorage() {
  const user = getCurrentUser();

  const username = user.username || "Қонақ";
  const fullname = user.fullname || user.name || "";
  const email = user.email || "Email жоқ";
  const createdAt = user.created_at || "Тіркелген уақыты жоқ";
  const avatar = user.avatar || "";

  // 🔥 username (үлкен)
  document.getElementById("profileName").innerText = username;

  // fullname (төменде)
  document.getElementById("profileFullname").innerText = fullname;

  document.getElementById("profileEmail").innerText = email;
  document.getElementById("profileCreatedAt").innerText = createdAt;

  // 🔥 аватар
  if (avatar) {
    document.getElementById("profileAvatar").style.backgroundImage =
      `url("${avatar}")`;
  }

  // form
  document.getElementById("editFio").value = fullname;
  document.getElementById("editUsername").value = username;
  document.getElementById("editEmail").value = email;
}

function cancelProfileEdit() {
  document.getElementById("profileForm").classList.remove("active");
}

function saveProfile() {
  const user = getCurrentUser();

  user.fullname = document.getElementById("editFio").value.trim();
  user.name = user.fullname;
  user.username = document.getElementById("editUsername").value.trim();
  user.email = document.getElementById("editEmail").value.trim();

  setCurrentUser(user);

  loadProfileFromStorage();
  cancelProfileEdit();

  alert("Профиль сақталды!");
}

// 🔥 СУРЕТ САҚТАУ
document.getElementById("avatarInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const user = getCurrentUser();

    user.avatar = e.target.result;

    setCurrentUser(user);
    loadProfileFromStorage();
  };

  reader.readAsDataURL(file);
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfileFromStorage();
});
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function loadProfileFromStorage() {
  const user = getCurrentUser();

  const username = user.username || "Қонақ";
  const fullname = user.fullname || user.name || "";
  const email = user.email || "Email жоқ";
  const createdAt = user.created_at || "Тіркелген уақыты жоқ";
  const avatar = user.avatar || "";

  document.getElementById("profileName").innerText = username;
  document.getElementById("profileFullname").innerText = fullname;
  document.getElementById("profileEmail").innerText = email;
  document.getElementById("profileCreatedAt").innerText = createdAt;

  if (avatar) {
    document.getElementById("profileAvatar").style.backgroundImage =
      `url("${avatar}")`;
  }

  document.getElementById("editFio").value = fullname;
  document.getElementById("editUsername").value = username;
  document.getElementById("editEmail").value = email;
}

function editProfile() {
  loadProfileFromStorage();
  document.getElementById("profileForm").classList.add("active");
}

function cancelProfileEdit() {
  document.getElementById("profileForm").classList.remove("active");
}

function saveProfile() {
  const user = getCurrentUser();

  user.fullname = document.getElementById("editFio").value.trim();
  user.name = user.fullname;
  user.username = document.getElementById("editUsername").value.trim();
  user.email = document.getElementById("editEmail").value.trim();

  setCurrentUser(user);
  loadProfileFromStorage();
  cancelProfileEdit();

  alert("Профиль сақталды!");
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfileFromStorage();

  const avatarInput = document.getElementById("avatarInput");
  if (avatarInput) {
    avatarInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        const user = getCurrentUser();
        user.avatar = e.target.result;
        setCurrentUser(user);
        loadProfileFromStorage();
      };

      reader.readAsDataURL(file);
    });
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});
let mailTasks = [];
let currentMailTaskIndex = 0;
let correctMailAnswers = 0;

async function loadDailyMailTasks() {
  const res = await fetch("/api/mail/tasks");
  const data = await res.json();

  if (!data.success) {
    alert("Пошта тапсырмалары жүктелмеді");
    return;
  }

  mailTasks = data.tasks;
  currentMailTaskIndex = 0;
  correctMailAnswers = 0;

  showMailTask(0);
  updateMailProgress();
}

function showMailTask(index) {
  const task = mailTasks[index];
  if (!task) return;

  document.getElementById("mailSituationTitle").innerText = task.situationTitle;
  document.getElementById("mailDate").innerText = task.date;
  document.getElementById("mailLevel").innerText = task.level;

  document.getElementById("mailSenderName").innerText = task.senderName;
  document.getElementById("mailSenderEmail").innerText = task.senderEmail;
  document.getElementById("mailTime").innerText = task.time;

  document.getElementById("mailTitle").innerText = task.title;

  document.getElementById("mailBody").innerHTML =
    "Кімге: сіз<br><br>" + task.body.replace(/\n/g, "<br>");

  document.getElementById("mailLink").innerText = task.link;
  document.getElementById("mailLink").href = "#";

  document.getElementById("mailFooter").innerText = task.footer;

  document.getElementById("emptyState").style.display = "flex";
  document.getElementById("rightContent").style.display = "none";

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function checkMailAnswer(answer) {
  const task = mailTasks[currentMailTaskIndex];
  if (!task) return;

  document.getElementById("emptyState").style.display = "none";
  document.getElementById("rightContent").style.display = "flex";

  document.getElementById("mailExplanationList").innerHTML =
    task.explanation.map(item => `<li>🔎 ${item}</li>`).join("");

  document.getElementById("mailAdviceList").innerHTML =
    task.advice.map(item => `<li>✔ ${item}</li>`).join("");

  if (answer === task.correct) {
    correctMailAnswers++;
  }

  currentMailTaskIndex++;
  updateMailProgress();

  if (currentMailTaskIndex < mailTasks.length) {
    setTimeout(() => {
      showMailTask(currentMailTaskIndex);
    }, 3500);
  }
}

function updateMailProgress() {
  const total = 5;
  const percent = Math.round((correctMailAnswers / total) * 100);
  const left = Math.max(total - currentMailTaskIndex, 0);

  document.getElementById("mailProgressPercent").innerText = percent + "%";
  document.getElementById("mailCorrectCount").innerText =
    correctMailAnswers + " / " + total;

  document.getElementById("mailProgressFill").style.width = percent + "%";
  document.getElementById("mailLeftText").innerText =
    left > 0 ? `Әлі ${left} тапсырма қалды` : "Бүгінгі тапсырмалар аяқталды";
}

document.addEventListener("DOMContentLoaded", () => {
  loadDailyMailTasks();
});
//ЖИ генерация
let mailTasks = [];
let currentMailTaskIndex = 0;
let correctMailAnswers = 0;

async function loadDailyMailTasks() {
  const res = await fetch("/api/mail/tasks");
  const data = await res.json();

  if (!data.success) {
    alert("Пошта тапсырмалары жүктелмеді");
    return;
  }

  mailTasks = data.tasks;
  currentMailTaskIndex = 0;
  correctMailAnswers = 0;

  showMailTask(0);
  updateMailProgress();
}

function showMailTask(index) {
  const task = mailTasks[index];
  if (!task) return;

  document.getElementById("mailSituationTitle").innerText = task.situationTitle;
  document.getElementById("mailDate").innerText = task.date;
  document.getElementById("mailLevel").innerText = task.level;

  document.getElementById("mailLogo").src = task.logo;
  document.getElementById("mailSenderName").innerText = task.senderName;
  document.getElementById("mailSenderEmail").innerText = task.senderEmail;
  document.getElementById("mailTime").innerText = task.time;

  document.getElementById("mailTitle").innerText = task.title;

  document.getElementById("mailBody").innerHTML =
    "Кімге: сіз<br><br>" + task.body.replace(/\n/g, "<br>");

  document.getElementById("mailLink").innerText = task.link;
  document.getElementById("mailLink").href = "#";
  document.getElementById("mailFooter").innerText = task.footer;

  renderMailOptions(task.options);

  document.getElementById("emptyState").style.display = "flex";
  document.getElementById("rightContent").style.display = "none";

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function renderMailOptions(options) {
  const colors = ["red", "blue", "green", "purple"];
  const icons = ["x-circle", "check-circle", "shield-check", "clock"];

  const box = document.getElementById("mailActions");
  box.innerHTML = "";

  options.forEach((option, index) => {
    const div = document.createElement("div");
    div.className = `btn ${colors[index]}`;
    div.onclick = () => checkMailAnswer(option.key);

    div.innerHTML = `
      <i data-lucide="${icons[index]}"></i>
      ${option.text}
    `;

    box.appendChild(div);
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

