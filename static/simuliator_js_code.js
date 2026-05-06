/* =========================
   CYBERSAQSHY SIMULIATOR JS
========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  setupMenuActive();
  setupSettingsButtons();
  setupAvatarUpload();
  setupMailButtons();
  loadProfileFromStorage();
  loadHeaderProfile();
  loadWelcome();
  renderSmsTasks();

  if (document.getElementById("chatBox")) {
    renderChat();
  }

  if (document.getElementById("aiInput")) {
    document.getElementById("aiInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendAIMessage();
      }
    });
  }

  if (document.getElementById("smsList")) {
    renderSmsTasks();
  }

  if (document.getElementById("mailSituationTitle")) {
    loadDailyMailTasks();
  }
});


/* =========================
   SAFE ELEMENT HELPER
========================= */

function el(id) {
  return document.getElementById(id);
}

function setDisplay(id, display) {
  const item = el(id);
  if (item) item.style.display = display;
}


/* =========================
   PAGE NAVIGATION
========================= */

function hideAll() {
  const pages = [
    "mailPage",
    "fakePage",
    "performedPage",
    "dashboardPage",
    "settingsPage",
    "helpPage",
    "callPage",
    "smsPage",
    "smsTaskPage"
  ];

  pages.forEach((id) => {
    const page = el(id);
    if (page) page.style.display = "none";
  });
}

function openDashboard() {
  hideAll();
  setDisplay("dashboardPage", "flex");
  refreshIcons();
}

function openMail() {
  hideAll();
  setDisplay("mailPage", "flex");
  refreshIcons();
}

function openFake() {
  hideAll();
  setDisplay("fakePage", "grid");
  refreshIcons();
}

function openSMS() {
  hideAll();
  setDisplay("smsPage", "flex");
  refreshIcons();
}

function openCall() {
  hideAll();
  setDisplay("callPage", "flex");
  refreshIcons();
}

function openPerformed() {
  hideAll();
  setDisplay("performedPage", "flex");
  refreshIcons();
}

function openSettings() {
  hideAll();
  setDisplay("settingsPage", "block");
  refreshIcons();
}

function openHelp() {
  hideAll();
  setDisplay("helpPage", "grid");
  refreshIcons();
}

function refreshIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function setupMenuActive() {
  const menuItems = document.querySelectorAll(".menu-list li");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}


/* =========================
   MAIL TASK RESULT
========================= */

function setupMailButtons() {
  document.querySelectorAll(".actions .btn").forEach((btn) => {
    btn.addEventListener("click", showResult);
  });
}

function showResult() {
  setDisplay("emptyState", "none");
  setDisplay("rightContent", "flex");
  refreshIcons();
}

function showFakeResult() {
  document.querySelectorAll(".site-option").forEach((item) => {
    item.classList.add("result");
  });

  setDisplay("emptyState2", "none");
  setDisplay("rightContent2", "block");
  refreshIcons();
}


/* =========================
   AI ASSISTANT
========================= */

async function sendAIMessage() {
  const input = el("aiInput");
  const messages = el("aiMessages");

  if (!input || !messages) {
    alert("AI input немесе messages блогы табылмады!");
    return;
  }

  const text = input.value.trim();

  if (!text) return;

  addAIMessage("user", text);
  input.value = "";

  const loadingId = "ai-loading-" + Date.now();

  messages.insertAdjacentHTML(
    "beforeend",
    `
    <div class="ai-msg" id="${loadingId}">
      Жауап жазылуда...
    </div>
    `
  );

  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await res.json();
    const loading = el(loadingId);

    if (!loading) return;

    if (data.success) {
      loading.innerHTML = formatAIText(data.answer);
      saveAIHistory(text, data.answer);
    } else {
      loading.innerHTML = "Қате: " + escapeHTML(data.message || "AI жауап бермеді");
    }
  } catch (error) {
    const loading = el(loadingId);
    if (loading) {
      loading.innerHTML = "Сервермен байланыс қатесі. Render deploy және OPENAI_API_KEY тексеріңіз.";
    }
  }

  messages.scrollTop = messages.scrollHeight;
}

function addAIMessage(type, text) {
  const messages = el("aiMessages");
  if (!messages) return;

  const className = type === "user" ? "user-msg" : "ai-msg";

  messages.insertAdjacentHTML(
    "beforeend",
    `
    <div class="${className}">
      ${formatAIText(text)}
    </div>
    `
  );

  messages.scrollTop = messages.scrollHeight;
}

function formatAIText(text) {
  if (!text) return "";

  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveAIHistory(question, answer) {
  const history = JSON.parse(localStorage.getItem("aiHistory") || "[]");

  history.unshift({
    question,
    answer,
    time: new Date().toLocaleTimeString("kk-KZ", {
      hour: "2-digit",
      minute: "2-digit"
    })
  });

  localStorage.setItem("aiHistory", JSON.stringify(history.slice(0, 20)));
  renderAIHistory();
}

function renderAIHistory() {
  const historyList = el("historyList");
  if (!historyList) return;

  const history = JSON.parse(localStorage.getItem("aiHistory") || "[]");

  historyList.innerHTML = "";

  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <i data-lucide="message-square"></i>
      <div>
        <b>${escapeHTML(item.question).slice(0, 35)}...</b>
        <p>${escapeHTML(item.answer).slice(0, 45)}...</p>
      </div>
      <span>${item.time}</span>
      <button type="button" onclick="deleteAIHistoryItem('${item.time}')">
        <i data-lucide="trash-2"></i>
      </button>
    `;

    historyList.appendChild(div);
  });

  refreshIcons();
}

function deleteAIHistoryItem(time) {
  let history = JSON.parse(localStorage.getItem("aiHistory") || "[]");
  history = history.filter((item) => item.time !== time);
  localStorage.setItem("aiHistory", JSON.stringify(history));
  renderAIHistory();
}

function clearAIHistory() {
  localStorage.removeItem("aiHistory");
  renderAIHistory();
}

function toggleHistory() {
  const list = el("historyList");
  const hidden = el("hiddenBox");
  const clearBtn = document.querySelector(".clear-history");

  if (!list || !hidden) return;

  if (list.style.display === "none") {
    list.style.display = "block";
    hidden.style.display = "none";
    if (clearBtn) clearBtn.style.display = "block";
  } else {
    list.style.display = "none";
    hidden.style.display = "block";
    if (clearBtn) clearBtn.style.display = "none";
  }

  refreshIcons();
}


/* =========================
   SMS TASK LIST
========================= */

const smsTasks = [
  {
    title: "Фишингтік хабарламаны анықтаңыз",
    desc: "SMS-хабарламаны мұқият оқып шығыңыз және оның фишингтік екенін анықтаңыз.",
    level: "Оңай",
    xp: 10
  },
  {
    title: "Қауіпті сілтемені табыңыз",
    desc: "Берілген SMS-хабарламадағы қауіпті сілтемені анықтап, дұрыс таңдаңыз.",
    level: "Оңай",
    xp: 10
  },
  {
    title: "Жеке деректерді сұрау",
    desc: "Хабарламада қандай жеке деректер сұралып тұрғанын анықтаңыз.",
    level: "Орташа",
    xp: 15
  },
  {
    title: "Күмәнді белгілерді анықтаңыз",
    desc: "Қате жазылым, қысым көрсету сияқты белгілерді табыңыз.",
    level: "Орташа",
    xp: 15
  },
  {
    title: "Қауіпті әрекетті анықтаңыз",
    desc: "Хабарламада қандай қауіпті әрекет сұралып тұрғанын анықтаңыз.",
    level: "Қиын",
    xp: 20
  },
  {
    title: "Толық талдау жасаңыз",
    desc: "SMS-хабарламаны толық талдап, оның фишинг екенін дәлелдеңіз.",
    level: "Қиын",
    xp: 20
  }
];

function renderSmsTasks() {
  const smsList = el("smsList");
  if (!smsList) return;

  smsList.innerHTML = "";

  smsTasks.forEach((task, index) => {
    let badgeClass = "easy";
    if (task.level === "Орташа") badgeClass = "medium";
    if (task.level === "Қиын") badgeClass = "hard";

    const item = document.createElement("div");
    item.className = "sms-item";

    item.innerHTML = `
      <div class="icon">
        <i data-lucide="message-square-text"></i>
      </div>

      <div class="info">
        <h4>${index + 1}. ${task.title}</h4>
        <p>${task.desc}</p>
      </div>

      <span class="badge ${badgeClass}">${task.level}</span>
      <span class="xp">⭐ ${task.xp} XP</span>

      <button type="button" onclick="startTask(${index})">
        Тапсырманы бастау
      </button>
    `;

    smsList.appendChild(item);
  });

  refreshIcons();
}

function startTask(index) {
  hideAll();
  setDisplay("smsTaskPage", "grid");
  refreshIcons();
}

function goBackToList() {
  setDisplay("smsTaskPage", "none");
  setDisplay("smsPage", "flex");
}


/* =========================
   SMS PHONE CHAT SLIDER
========================= */

let currentIndex = 0;

const chats = [[], [], [], []];

const messages = [
  `Kaspi: картаңыз бұғатталды.<br><br><a href="#">kaspi-secure-login.xyz</a>`,
  `Kaspi: Сіздің шотыңыз тексерілуде.<br><br><a href="#">secure-kaspi-check.com</a>`,
  `Kaspi: Бонус ұтып алдыңыз!<br><br><a href="#">kaspi-bonus-free.xyz</a>`,
  `Kaspi: Қауіпсіздік үшін аккаунтты жаңартыңыз:<br><br><a href="#">kaspi-update-login.net</a>`
];

function renderChat() {
  const chat = el("chatBox");
  if (!chat) return;

  chat.innerHTML = `
    <div class="message">
      ${messages[currentIndex]}
    </div>
  `;

  chats[currentIndex].forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message user-message";
    div.innerText = msg;
    chat.appendChild(div);
  });
}

function sendMessage() {
  const input = el("messageInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  chats[currentIndex].push(text);
  input.value = "";

  renderChat();
}

function updateSlide() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot) => dot.classList.remove("active"));

  if (dots[currentIndex]) {
    dots[currentIndex].classList.add("active");
  }

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


/* =========================
   SETTINGS
========================= */

function setupSettingsButtons() {
  document.querySelectorAll(".switch").forEach((sw) => {
    sw.addEventListener("click", () => {
      sw.classList.toggle("active");
    });
  });

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
}


/* =========================
   USER PROFILE
========================= */

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
  const nickname = user.nickname || "";
  const email = user.email || "Email жоқ";
  const createdAt = user.created_at || "Тіркелген уақыты жоқ";
  const avatar = user.avatar || "";

  if (el("profileName")) el("profileName").innerText = username;
  if (el("profileFullname")) el("profileFullname").innerText = fullname;
  if (el("profileEmail")) el("profileEmail").innerText = email;
  if (el("profileCreatedAt")) el("profileCreatedAt").innerText = createdAt;

  if (avatar && el("profileAvatar")) {
    el("profileAvatar").style.backgroundImage = `url("${avatar}")`;
  }

  if (el("editFio")) el("editFio").value = fullname;
  if (el("editUsername")) el("editUsername").value = username;
  if (el("editNickname")) el("editNickname").value = nickname;
  if (el("editEmail")) el("editEmail").value = email;
}

function loadHeaderProfile() {
  const user = getCurrentUser();

  if (user.avatar && el("headerAvatar")) {
    el("headerAvatar").style.backgroundImage = `url("${user.avatar}")`;
  }
}

function loadWelcome() {
  const user = getCurrentUser();

  if (user.username && el("welcomeText")) {
    el("welcomeText").innerText = "Сәлем, " + user.username + "! 👋";
  }
}

function editProfile() {
  loadProfileFromStorage();

  const form = el("profileForm");
  if (form) form.classList.add("active");
}

function cancelProfileEdit() {
  const form = el("profileForm");
  if (form) form.classList.remove("active");
}

async function saveProfile() {
  const user = getCurrentUser();

  const updatedUser = {
    id: user.id,
    fullname: el("editFio") ? el("editFio").value.trim() : "",
    username: el("editUsername") ? el("editUsername").value.trim() : "",
    nickname: el("editNickname") ? el("editNickname").value.trim() : user.nickname || "",
    email: el("editEmail") ? el("editEmail").value.trim() : "",
    avatar: user.avatar || ""
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

  try {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    });

    const data = await res.json();

    if (data.success) {
      setCurrentUser(data.user);
      loadProfileFromStorage();
      loadHeaderProfile();
      loadWelcome();
      cancelProfileEdit();
      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Сервер қатесі. Профиль сақталмады.");
  }
}

function setupAvatarUpload() {
  const avatarInput = el("avatarInput");

  if (!avatarInput) return;

  avatarInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const user = getCurrentUser();
      user.avatar = e.target.result;

      setCurrentUser(user);
      loadProfileFromStorage();
      loadHeaderProfile();
    };

    reader.readAsDataURL(file);
  });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}


/* =========================
   DAILY MAIL TASKS FROM API
========================= */

let mailTasks = [];
let currentMailTaskIndex = 0;
let correctMailAnswers = 0;

async function loadDailyMailTasks() {
  try {
    const res = await fetch("/api/mail/tasks");
    const data = await res.json();

    if (!data.success) {
      console.log("Пошта тапсырмалары жүктелмеді");
      return;
    }

    mailTasks = data.tasks || [];
    currentMailTaskIndex = 0;
    correctMailAnswers = 0;

    showMailTask(0);
    updateMailProgress();
  } catch (error) {
    console.log("Mail task API жоқ немесе қосылмаған");
  }
}

function showMailTask(index) {
  const task = mailTasks[index];
  if (!task) return;

  if (el("mailSituationTitle")) el("mailSituationTitle").innerText = task.situationTitle;
  if (el("mailDate")) el("mailDate").innerText = task.date;
  if (el("mailLevel")) el("mailLevel").innerText = task.level;

  if (el("mailSenderName")) el("mailSenderName").innerText = task.senderName;
  if (el("mailSenderEmail")) el("mailSenderEmail").innerText = task.senderEmail;
  if (el("mailTime")) el("mailTime").innerText = task.time;

  if (el("mailTitle")) el("mailTitle").innerText = task.title;

  if (el("mailBody")) {
    el("mailBody").innerHTML =
      "Кімге: сіз<br><br>" + String(task.body || "").replace(/\n/g, "<br>");
  }

  if (el("mailLink")) {
    el("mailLink").innerText = task.link;
    el("mailLink").href = "#";
  }

  if (el("mailFooter")) el("mailFooter").innerText = task.footer;

  setDisplay("emptyState", "flex");
  setDisplay("rightContent", "none");

  refreshIcons();
}

function checkMailAnswer(answer) {
  const task = mailTasks[currentMailTaskIndex];
  if (!task) return;

  setDisplay("emptyState", "none");
  setDisplay("rightContent", "flex");

  if (el("mailExplanationList")) {
    el("mailExplanationList").innerHTML =
      (task.explanation || []).map((item) => `<li>🔎 ${escapeHTML(item)}</li>`).join("");
  }

  if (el("mailAdviceList")) {
    el("mailAdviceList").innerHTML =
      (task.advice || []).map((item) => `<li>✔ ${escapeHTML(item)}</li>`).join("");
  }

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
  const total = mailTasks.length || 5;
  const percent = Math.round((correctMailAnswers / total) * 100);
  const left = Math.max(total - currentMailTaskIndex, 0);

  if (el("mailProgressPercent")) {
    el("mailProgressPercent").innerText = percent + "%";
  }

  if (el("mailCorrectCount")) {
    el("mailCorrectCount").innerText = correctMailAnswers + " / " + total;
  }

  if (el("mailProgressFill")) {
    el("mailProgressFill").style.width = percent + "%";
  }

  if (el("mailLeftText")) {
    el("mailLeftText").innerText =
      left > 0 ? `Әлі ${left} тапсырма қалды` : "Бүгінгі тапсырмалар аяқталды";
  }
}
async function sendAIMessage() {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const text = input.value.trim();

  if (!text) return;

  const time = new Date().toLocaleTimeString(
    "kk-KZ",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );

  messages.innerHTML += `
    <div class="message user">

      <p>${escapeHTML(text)}</p>

      <span>${time} ✓✓</span>

    </div>
  `;

  input.value = "";

  const loadingId =
    "loading-" + Date.now();

  messages.innerHTML += `
    <div
      class="message bot"
      id="${loadingId}"
    >

      <i data-lucide="bot"></i>

      <div>
        <p>Жауап жазылуда...</p>
        <span>${time}</span>
      </div>

    </div>
  `;

  messages.scrollTop =
    messages.scrollHeight;

  lucide.createIcons();

  try {
    const res = await fetch(
      "/api/ai-chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          user_id: user.id || null,
          message: text
        })
      }
    );

    const data = await res.json();

    const loading =
      document.getElementById(
        loadingId
      );

    if (data.success) {
      loading.innerHTML = `
        <i data-lucide="bot"></i>

        <div>

          <p>
            ${formatAIAnswer(
              data.answer
            )}
          </p>

          <span>
            ${data.chat.time}
          </span>

        </div>
      `;

      loadAIHistory();

    } else {
      loading.innerHTML = `
        <i data-lucide="bot"></i>

        <div>
          <p>
            ${escapeHTML(
              data.message
            )}
          </p>

          <span>${time}</span>
        </div>
      `;
    }

  } catch (error) {

    document.getElementById(
      loadingId
    ).innerHTML = `
      <i data-lucide="bot"></i>

      <div>
        <p>
          Сервер қатесі
        </p>

        <span>${time}</span>
      </div>
    `;
  }

  lucide.createIcons();

  messages.scrollTop =
    messages.scrollHeight;
}

async function loadAIHistory() {

  const historyList =
    document.getElementById(
      "historyList"
    );

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  try {

    const res = await fetch(
      "/api/ai-history",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          user_id: user.id || null
        })
      }
    );

    const data = await res.json();

    if (!data.success) return;

    historyList.innerHTML = "";

    data.history.forEach((item) => {

      historyList.innerHTML += `
        <div class="history-item">

          <i
            data-lucide="message-square"
          ></i>

          <div>

            <b>
              ${escapeHTML(
                item.question
              ).slice(0, 30)}...
            </b>

            <p>
              ${escapeHTML(
                item.answer
              ).slice(0, 40)}...
            </p>

          </div>

          <span>
            ${item.time}
          </span>

        </div>
      `;
    });

    lucide.createIcons();

  } catch (error) {
    console.log(error);
  }
}

async function clearAIHistory() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (
    !confirm(
      "Тарихты өшіресіз бе?"
    )
  ) return;

  try {

    const res = await fetch(
      "/api/ai-history/clear",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          user_id: user.id || null
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      document.getElementById(
        "historyList"
      ).innerHTML = "";

    } else {
      alert(data.message);
    }

  } catch (error) {
    alert("Қате шықты");
  }
}

function toggleHistory() {

  const list =
    document.getElementById(
      "historyList"
    );

  const hidden =
    document.getElementById(
      "hiddenBox"
    );

  const clearBtn =
    document.querySelector(
      ".clear-history"
    );

  if (
    list.style.display ===
    "none"
  ) {

    list.style.display =
      "block";

    hidden.style.display =
      "none";

    clearBtn.style.display =
      "flex";

  } else {

    list.style.display =
      "none";

    hidden.style.display =
      "block";

    clearBtn.style.display =
      "none";
  }
}

function formatAIAnswer(text) {

  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(
      /\*\*(.*?)\*\*/g,
      "<b>$1</b>"
    );
}

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadAIHistory();

    const input =
      document.getElementById(
        "aiInput"
      );

    if (input) {

      input.addEventListener(
        "keydown",
        (e) => {

          if (
            e.key === "Enter"
          ) {

            e.preventDefault();

            sendAIMessage();
          }
        }
      );
    }
  }
);
