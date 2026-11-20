(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const profileForm = document.getElementById("profile-form");
  const feedback = document.getElementById("profile-feedback");
  const number = (value, digits = 1) => Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  const initials = (name) => String(name || "TT").trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("pt-BR");

  function showMessage(message, kind) {
    feedback.textContent = message;
    feedback.classList.toggle("is-error", kind === "error");
    feedback.classList.toggle("is-success", kind === "success");
  }

  function render(profile) {
    const firstName = profile.name.trim().split(/\s+/)[0] || "Olá";
    document.getElementById("user-name").textContent = profile.name;
    document.getElementById("user-avatar").textContent = initials(profile.name);
    document.getElementById("greeting-name").textContent = firstName;
    document.getElementById("profile-weight").textContent = number(profile.weight);
    document.getElementById("profile-height").textContent = number(profile.heightCm / 100, 2);
    document.getElementById("profile-age").textContent = String(profile.age);
    document.getElementById("profile-focus").textContent = profile.focus;
    document.getElementById("profile-days").textContent = String(profile.exerciseDays);
    document.getElementById("rank-user-name").textContent = profile.name;
    document.getElementById("rank-avatar-user").textContent = initials(profile.name);

    if (profileForm) {
      profileForm.elements.namedItem("peso").value = profile.weight;
      profileForm.elements.namedItem("altura").value = profile.heightCm;
      profileForm.elements.namedItem("idade").value = profile.age;
      profileForm.elements.namedItem("foco").value = profile.focus;
      profileForm.elements.namedItem("atividade").value = profile.activity;
      profileForm.elements.namedItem("dias").value = profile.exerciseDays;
    }
  }

  render(store.getProfile(user.email));

  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showMessage("", "");
      if (!profileForm.reportValidity()) return;

      const data = new FormData(profileForm);
      const current = store.getProfile(user.email);
      const next = {
        ...current,
        weight: Number(data.get("peso")),
        heightCm: Number(data.get("altura")),
        age: Number(data.get("idade")),
        focus: String(data.get("foco")),
        activity: String(data.get("atividade")),
        exerciseDays: Number(data.get("dias"))
      };
      try {
        const saved = store.saveProfile(user.email, next);
        render(saved);
        showMessage("Perfil atualizado neste navegador.", "success");
      } catch (error) {
        showMessage(error.message || "Não foi possível atualizar o perfil.", "error");
      }
    });
  }

  document.querySelectorAll(".logout-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      store.logout();
      window.location.assign("index.html");
    });
  });
})();
