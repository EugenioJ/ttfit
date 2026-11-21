(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const initials = String(user.name || "TT")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toLocaleUpperCase("pt-BR");

  const name = document.getElementById("user-name");
  const avatar = document.getElementById("user-avatar");
  if (name) name.textContent = user.name;
  if (avatar) avatar.textContent = initials;

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      store.logout();
      window.location.assign("index.html");
    });
  });
})();
