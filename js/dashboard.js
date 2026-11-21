(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const number = (value, digits = 1) => Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  const initials = (name) => String(name || "TT").trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("pt-BR");

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
  }

  render(store.getProfile(user.email));
})();
