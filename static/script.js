lucide.createIcons();
const savedUsername = localStorage.getItem("savedUsername");

if (savedUsername) {
  document.getElementById("email").value = savedUsername;
  document.getElementById("rememberMe").checked = true;
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Логин мен құпия сөзді енгізіңіз");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (data.success) {
        const rememberMe = document.getElementById("rememberMe").checked;

        localStorage.setItem("user", JSON.stringify(data.user));

        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
        } else {
          localStorage.removeItem("savedUsername");
        }

        window.location.href = "/SIMULIATOR";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Сервер қатесі: " + error.message);
      console.error(error);
    }
  });

function tryFree() {
  localStorage.setItem(
    "user",
    JSON.stringify({
      name: "Қонақ",
      mode: "free",
    }),
  );

  window.location.href = "/SIMULIATOR";
}

function showRegister() {
  document.querySelector(".form-box").innerHTML = `
          <h2>Тіркелу</h2>
          <p class="subtitle">
            Жаңа аккаунт құрып, симуляторды пайдалана бастаңыз
          </p>

          <form id="registerForm">
            <label>Аты-жөніңіз</label>
            <div class="input-box">
              <i data-lucide="user"></i>
              <input id="fullname" type="text" placeholder="Мысалы: Иррада Бақытжанқызы" />
            </div>

            <label>Логин (пайдаланушы аты)</label>
            <div class="input-box">
              <i data-lucide="user"></i>
              <input id="regUsername" type="text" placeholder="Логин енгізіңіз" />
            </div>

            <label>Email</label>
            <div class="input-box">
              <i data-lucide="mail"></i>
              <input id="regEmail" type="email" placeholder="Email енгізіңіз" />
            </div>

            <label>Құпия сөз</label>
            <div class="input-box">
              <i data-lucide="lock"></i>
              <input id="regPassword" type="password" placeholder="Құпия сөз енгізіңіз" />
              <i data-lucide="eye-off" class="toggle-password"></i>
            </div>

            <label>Құпия сөзді қайталаңыз</label>
            <div class="input-box">
              <i data-lucide="lock"></i>
              <input id="confirmPassword" type="password" placeholder="Құпия сөзді қайта енгізіңіз" />
              <i data-lucide="eye-off" class="toggle-password"></i>
            </div>

            <div class="options">
              <label class="remember">
                <input id="rememberMe" type="checkbox" />
                <span>Мен <a href="terms.html">пайдаланушы келісіміне</a> және <a href="terms.html">құпиялық саясатымен</a> келісемін</span>
              </label>
            </div>

            <button type="submit" class="login-btn">
              <i data-lucide="user-plus"></i>
              Тіркелу
            </button>
          </form>

          <div class="divider">
            <span></span>
            <p>немесе</p>
            <span></span>
          </div>

          <p class="register">
            Аккаунтыңыз бар ма?
            <a href="#" onclick="location.reload()">Кіру</a>
          </p>
        `;

  lucide.createIcons();

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();

      if (!fullname || !username || !email || !password || !confirmPassword) {
        alert("Барлық жолдарды толтырыңыз");
        return;
      }

      if (password !== confirmPassword) {
        alert("Құпия сөздер сәйкес емес");
        return;
      }
      const agree = document.getElementById("agree").checked;

      if (!agree) {
        alert("Пайдаланушы келісімі мен құпиялық саясатымен келісуіңіз керек");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: fullname,
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        location.reload();
      } else {
        alert(data.message);
      }
    });
}
document.addEventListener("click", function (e) {
  if (e.target.closest(".toggle-password")) {
    const eye = e.target.closest(".toggle-password");
    const input = eye.parentElement.querySelector("input");

    if (input.type === "password") {
      input.type = "text";
      eye.setAttribute("data-lucide", "eye"); // ашық көз
    } else {
      input.type = "password";
      eye.setAttribute("data-lucide", "eye-off"); // жабық көз
    }

    lucide.createIcons();
    // иконканы жаңарту
  }
});
