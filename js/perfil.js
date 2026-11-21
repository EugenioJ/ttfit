(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const form = document.getElementById("profile-form");
  const feedback = document.getElementById("profile-feedback");
  const profile = store.getProfile(user.email);
  const name = document.getElementById("profile-name");
  const email = document.getElementById("profile-email");
  const avatar = document.getElementById("profile-avatar");

  if (name) name.textContent = profile.name;
  if (email) email.textContent = user.email;
  if (avatar) avatar.textContent = String(profile.name || "TT").trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("pt-BR");

  form.elements.namedItem("peso").value = profile.weight;
  form.elements.namedItem("altura").value = profile.heightCm;
  form.elements.namedItem("idade").value = profile.age;
  form.elements.namedItem("foco").value = profile.focus;
  form.elements.namedItem("atividade").value = profile.activity;
  form.elements.namedItem("dias").value = profile.exerciseDays;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "";
    feedback.classList.remove("is-error", "is-success");
    if (!form.reportValidity()) return;

    const data = new FormData(form);
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

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    try {
      const saved = store.saveProfile(user.email, next);
      feedback.textContent = "Perfil atualizado.";
      feedback.classList.add("is-success");
      if (name) name.textContent = saved.name;
      if (avatar) avatar.textContent = String(saved.name || "TT").trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("pt-BR");
    } catch (error) {
      feedback.textContent = error.message || "Não foi possível atualizar o perfil.";
      feedback.classList.add("is-error");
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  });
})();
