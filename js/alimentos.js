(() => {
  "use strict";

  const store = globalThis.TTFITDemoStore;
  if (!store) return;
  const user = store.getCurrentUser();
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const form = document.getElementById("food-search-form");
  const input = document.getElementById("alimento");
  const feedback = document.getElementById("food-feedback");
  const resultSection = document.getElementById("food-result");
  let foods = [];

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function format(value) {
    return Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  }

  function showFeedback(message, kind) {
    feedback.textContent = message;
    feedback.classList.toggle("is-error", kind === "error");
    feedback.classList.toggle("is-success", kind === "success");
  }

  function createNutrientRow(nutrient, index) {
    const row = document.createElement("div");
    row.className = "nutrient-row";

    const label = document.createElement("span");
    const bullet = document.createElement("span");
    bullet.className = "nutrient-bullet " + (index % 2 === 0 ? "nutrient-bullet-red" : "nutrient-bullet-dark");
    bullet.setAttribute("aria-hidden", "true");
    label.append(bullet, document.createTextNode(nutrient.label));

    const value = document.createElement("strong");
    if (nutrient.value === null || nutrient.value === undefined) {
      value.className = "nutrient-na";
      value.textContent = nutrient.note || "Não informado pela fonte";
    } else {
      value.append(document.createTextNode(format(nutrient.value) + " "));
      const unit = document.createElement("small");
      unit.textContent = nutrient.unit;
      value.append(unit);
    }
    row.append(label, value);

    const wrapper = document.createElement("div");
    wrapper.append(row);
    if (nutrient.note && nutrient.value !== null && nutrient.value !== undefined) {
      const note = document.createElement("p");
      note.className = "nutrient-note";
      note.textContent = nutrient.note;
      wrapper.append(note);
    }
    return wrapper;
  }

  function renderFood(food) {
    document.getElementById("result-title").textContent = food.name;
    document.getElementById("food-energy").replaceChildren(
      document.createTextNode(format(food.energyKcal) + " "),
      Object.assign(document.createElement("small"), { textContent: "kcal" })
    );

    const photo = document.getElementById("food-photo");
    const art = document.getElementById("food-art");
    const artLabel = document.getElementById("food-art-label");
    const caption = document.getElementById("photo-caption");
    art.dataset.art = food.art || "default";
    artLabel.textContent = food.name;
    if (food.image) {
      photo.src = food.image;
      photo.alt = food.name;
      photo.classList.remove("is-hidden");
      artLabel.classList.add("is-hidden");
      caption.textContent = food.art === "abacate" ? "ALIMENTO IN NATURA" : "PREPARAÇÃO DE REFERÊNCIA";
    } else {
      photo.removeAttribute("src");
      photo.classList.add("is-hidden");
      artLabel.classList.remove("is-hidden");
      caption.textContent = "PREPARAÇÃO DE REFERÊNCIA";
    }

    const list = document.getElementById("nutrient-list");
    list.replaceChildren(...food.nutrients.map(createNutrientRow));
    const sourceNote = document.getElementById("food-source-note");
    sourceNote.textContent = food.preparation + " " + food.source.shortName + ". " + food.source.citation + " " + food.sourceNote;
    const sourceLink = document.getElementById("food-source-link");
    sourceLink.href = food.source.url;
    sourceLink.textContent = "Consultar " + food.source.shortName + " ";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    sourceLink.append(arrow);
    resultSection.hidden = false;
    showFeedback("Resultado para 100 g da preparação indicada.", "success");
  }

  function findFood(query) {
    const normalized = normalize(query);
    if (!normalized) return null;
    return foods.find((food) => {
      const terms = [food.name, food.preparation, ...(food.aliases || [])].map(normalize);
      return terms.some((term) => term === normalized || term.includes(normalized) || normalized.includes(term));
    }) || null;
  }

  function search(query) {
    const value = String(query || "").trim();
    if (!value) {
      resultSection.hidden = true;
      showFeedback("Digite o nome de um alimento para pesquisar.", "error");
      input.focus();
      return;
    }
    const food = findFood(value);
    if (!food) {
      resultSection.hidden = true;
      showFeedback("Não encontramos esse alimento. Tente abacate, frango, arroz, feijão ou macarrão.", "error");
      return;
    }
    input.value = food.name;
    renderFood(food);
  }

  async function initialize() {
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-avatar").textContent = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR");
    try {
      const response = await fetch("food-data.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("Falha ao carregar o catálogo local.");
      const data = await response.json();
      foods = Array.isArray(data.items) ? data.items : [];
      const datalist = document.getElementById("food-suggestions");
      datalist.replaceChildren(...foods.map((food) => {
        const option = document.createElement("option");
        option.value = food.name;
        return option;
      }));
      if (foods.length === 0) throw new Error("O catálogo local está vazio.");
      const initial = new URLSearchParams(window.location.search).get("alimento") || "abacate";
      search(initial);
    } catch (_error) {
      resultSection.hidden = true;
      showFeedback("Não foi possível carregar os dados alimentares locais.", "error");
    }
  }

  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    search(input.value);
  });

  document.querySelectorAll("[data-food-query]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.foodQuery;
      search(input.value);
    });
  });

  document.querySelectorAll(".logout-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      store.logout();
      window.location.assign("index.html");
    });
  });

  initialize();
})();
