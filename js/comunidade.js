(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-avatar").textContent = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR");

  const examples = [
    { name: "Ana Lima", activities: 9, note: "Consistência em movimento" },
    { name: "Lucas Martins", activities: 5, note: "Mais um passo hoje" },
    { name: "Joana Ribeiro", activities: 4, note: "No seu próprio ritmo" },
    { name: "Rafaela Costa", activities: 3, note: "Pequenos passos contam" }
  ];
  const rows = [...examples, { name: user.name, activities: 7, note: "Ritmo constante", isYou: true }]
    .sort((a, b) => b.activities - a.activities)
    .slice(0, 5);
  const list = document.getElementById("community-list");

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toLocaleUpperCase("pt-BR");
  }

  rows.forEach((person, index) => {
    const row = document.createElement("li");
    row.className = "community-row" + (person.isYou ? " community-row-you" : "");

    const rank = document.createElement("span");
    rank.className = "rank-number";
    rank.textContent = String(index + 1).padStart(2, "0");

    const avatar = document.createElement("span");
    avatar.className = "rank-avatar " + (index === 0 ? "rank-avatar-red" : person.isYou ? "rank-avatar-dark" : "rank-avatar-cream");
    avatar.textContent = initials(person.name);

    const detail = document.createElement("span");
    detail.className = "rank-person";
    const name = document.createElement("strong");
    name.textContent = person.name;
    if (person.isYou) {
      const marker = document.createElement("em");
      marker.textContent = "VOCÊ";
      name.append(" ", marker);
    }
    const note = document.createElement("small");
    note.textContent = person.note;
    detail.append(name, note);

    const count = document.createElement("span");
    count.className = "rank-count";
    const activityCount = document.createElement("strong");
    activityCount.textContent = String(person.activities);
    const activityLabel = document.createElement("small");
    activityLabel.textContent = "atividades";
    count.append(activityCount, activityLabel);

    row.append(rank, avatar, detail, count);
    list.append(row);
  });

  document.querySelectorAll(".logout-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      store.logout();
      window.location.assign("index.html");
    });
  });
})();
