const SHOWS_URL = "data/shows.json";

let allShows = [];

const listEl = document.getElementById("shows-list");
const emptyMessageEl = document.getElementById("empty-message");
const filterStartEl = document.getElementById("filter-start");
const filterEndEl = document.getElementById("filter-end");
const filterClearBtn = document.getElementById("filter-clear");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function formatDate(isoDate) {
  if (!isoDate) return "Data a confirmar";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function isTicketLink(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function renderShows(shows) {
  listEl.innerHTML = "";

  if (shows.length === 0) {
    emptyMessageEl.hidden = false;
    return;
  }
  emptyMessageEl.hidden = true;

  for (const show of shows) {
    const card = document.createElement("article");
    card.className = "show-card";

    const ticketHtml = isTicketLink(show.link_ingresso)
      ? `<a href="${escapeHtml(show.link_ingresso)}" target="_blank" rel="noopener noreferrer">Comprar ingresso</a>`
      : `<span class="tba">${escapeHtml(show.link_ingresso || "Ingresso a confirmar")}</span>`;

    card.innerHTML = `
      <img src="${escapeHtml(show.logo_url)}" alt="Logo da banda ${escapeHtml(show.banda)}" loading="lazy" />
      <div class="show-card-body">
        <h2>${escapeHtml(show.banda)}</h2>
        <div class="show-date">${formatDate(show.data)}</div>
        <div class="show-local">${escapeHtml(show.local || "Local a confirmar")}</div>
        <div class="show-ticket">${ticketHtml}</div>
      </div>
    `;

    listEl.appendChild(card);
  }
}

function applyFilters() {
  const start = filterStartEl.value;
  const end = filterEndEl.value;

  const filtered = allShows.filter((show) => {
    if (!show.data) return true;
    if (start && show.data < start) return false;
    if (end && show.data > end) return false;
    return true;
  });

  renderShows(filtered);
}

function sortByDate(shows) {
  return [...shows].sort((a, b) => {
    if (!a.data) return 1;
    if (!b.data) return -1;
    return a.data.localeCompare(b.data);
  });
}

async function loadShows() {
  try {
    const response = await fetch(SHOWS_URL);
    const data = await response.json();
    allShows = sortByDate(data);
    renderShows(allShows);
  } catch (error) {
    listEl.innerHTML = "";
    emptyMessageEl.hidden = false;
    emptyMessageEl.textContent = "Erro ao carregar os shows. Verifique data/shows.json.";
    console.error("Falha ao carregar shows:", error);
  }
}

filterStartEl.addEventListener("change", applyFilters);
filterEndEl.addEventListener("change", applyFilters);
filterClearBtn.addEventListener("click", () => {
  filterStartEl.value = "";
  filterEndEl.value = "";
  applyFilters();
});

loadShows();
