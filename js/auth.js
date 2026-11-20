(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function showMessage(element, message, kind) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-error", kind === "error");
    element.classList.toggle("is-success", kind === "success");
  }

  function normalizeEmailField(input) {
    input.value = input.value.trim().toLocaleLowerCase("pt-BR");
    return input.value;
  }

  if (loginForm && store) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const emailInput = loginForm.elements.namedItem("email");
      const passwordInput = loginForm.elements.namedItem("password");
      const message = document.getElementById("login-message");
      showMessage(message, "", "");
      normalizeEmailField(emailInput);
      if (!loginForm.reportValidity()) return;

      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      try {
        const result = await store.signIn(
          emailInput.value,
          passwordInput.value,
          loginForm.elements.namedItem("remember").checked
        );
        if (!result.ok) {
          showMessage(message, result.message, "error");
          return;
        }
        window.location.assign("dashboard.html");
      } catch (error) {
        showMessage(message, error.message || "Não foi possível entrar neste navegador.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    });
  }

  const signupDetails = document.getElementById("signup-details");
  const signupLink = document.getElementById("open-signup-link");
  const signupName = document.getElementById("full-name");

  function openSignup() {
    if (!signupDetails) return;
    signupDetails.open = true;
    window.history.replaceState(null, "", "#cadastro");
    document.getElementById("cadastro").scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => signupName && signupName.focus({ preventScroll: true }), 180);
  }

  if (signupLink) signupLink.addEventListener("click", (event) => {
    event.preventDefault();
    openSignup();
  });
  if (window.location.hash === "#cadastro" && signupDetails) signupDetails.open = true;

  if (signupForm && store) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = document.getElementById("signup-message");
      showMessage(message, "", "");
      const emailInput = signupForm.elements.namedItem("email");
      normalizeEmailField(emailInput);
      if (!signupForm.reportValidity()) return;

      const data = new FormData(signupForm);
      const account = {
        name: String(data.get("nome")).trim(),
        email: emailInput.value,
        password: String(data.get("senha")),
        profile: {
          name: String(data.get("nome")).trim(),
          age: Number(data.get("idade")),
          weight: Number(data.get("peso")),
          heightCm: Number(data.get("altura")),
          activity: String(data.get("atividade")),
          focus: String(data.get("foco")),
          exerciseDays: Number(data.get("dias"))
        }
      };

      const submitButton = signupForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      try {
        const result = await store.register(account);
        if (!result.ok) {
          showMessage(message, result.message, "error");
          return;
        }
        window.location.assign("dashboard.html");
      } catch (error) {
        showMessage(message, error.message || "Não foi possível salvar o perfil neste navegador.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    });
  }

  const recoveryForm = document.getElementById("recovery-form");
  if (recoveryForm) {
    recoveryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = recoveryForm.elements.namedItem("email");
      email.value = email.value.trim();
      if (!recoveryForm.reportValidity()) return;
      showMessage(
        document.getElementById("recovery-message"),
        "A recuperação por e-mail não está disponível nesta versão. Use a conta de apresentação ou crie um perfil local.",
        "error"
      );
    });
  }
})();
