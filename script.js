const art = [
  "url('assets/tv-stack.jpeg')",
  "url('assets/sony-monitor.jpeg')",
  "url('assets/late-night-vibes.jpg')",
  "url('assets/music-collage.jpg')",
  "url('assets/earbuds-glow.jpg')",
  "url('assets/microphone.jpeg')",
  "linear-gradient(135deg,#f32162,#36164f 58%,#101010)",
  "linear-gradient(135deg,#43e97b,#38f9d7 54%,#07231e)"
];

const beats = [
  ["Neon Bounce", "Zara Keys", "$39 license", "Afrobeat", art[0]],
  ["Basement Soul", "Musa Wave", "$49 license", "Trap Soul", art[1]],
  ["Afterglow Drill", "808 Harbor", "$59 license", "Drill", art[2]],
  ["Velvet Run", "The Loop Room", "$35 license", "R&B", art[3]],
  ["Rift City", "Kato North", "$45 license", "Trap Soul", art[4]],
  ["Midnight Amp", "June Static", "$69 exclusive", "Rock Flip", art[5]]
];

const producers = [
  ["Nova K", "Top seller", "", "", art[5]],
  ["Musa Wave", "Afro fusion", "", "", art[0]],
  ["808 Harbor", "Featured", "", "", art[1]],
  ["Lena Vox", "R&B kits", "", "", art[2]],
  ["Kato North", "Trap soul", "", "", art[4]],
  ["June Static", "Rock flips", "", "", art[3]]
];

const packs = [
  ["Studio Smoke", "24 loops, 12 drums", "$29 pack", "Pack", art[2]],
  ["Sunset Tempo", "Afrobeat construction kit", "$34 pack", "Pack", art[1]],
  ["Chrome Choir", "Vocal chops and pads", "$27 pack", "Pack", art[5]],
  ["Low End Theory", "Bass and 808 tools", "$22 pack", "Pack", art[0]],
  ["Indie Sparks", "Guitar starter pack", "$31 pack", "Pack", art[3]]
];

const radio = [
  ["Afro Swing", "With Musa Wave, Zara Keys, Kato North", "AS", "", art[0]],
  ["Trap Soul", "With 808 Harbor, Nova K, Lena Vox", "TS", "", art[1]],
  ["Rock Flip Lab", "With June Static and Studio Smoke", "RF", "", art[5]],
  ["R&B Rooms", "With Lena Vox, Zara Keys, Nova K", "RB", "", art[2]],
  ["Drill Focus", "With Kato North and 808 Harbor", "DF", "", art[4]]
];

const charts = [
  ["Top Beats Global", "Weekly marketplace chart", "GLOBAL", "", "linear-gradient(135deg,#7b3ab8,#a744ff)"],
  ["Top Beats USA", "Weekly marketplace chart", "USA", "", "linear-gradient(135deg,#ff174f,#ff4f78)"],
  ["Top Free Downloads", "Updated daily", "FREE", "", "linear-gradient(135deg,#30cfd0,#330867)"],
  ["Top Exclusive Sales", "Updated daily", "EXCL", "", "linear-gradient(135deg,#1ed760,#0f5130)"]
];

const catalog = [
  ...beats,
  ["Blue Hour Keys", "Lena Vox", "$42 license", "R&B", art[1]],
  ["Static Crown", "June Static", "$55 license", "Rock Flip", art[0]],
  ["Market Run", "Kato North", "$32 license", "Drill", art[4]],
  ["Soft Threat", "Nova K", "$38 license", "Trap Soul", art[2]],
  ["Palm Wine Bass", "Musa Wave", "$44 license", "Afrobeat", art[3]],
  ["Signal Choir", "The Loop Room", "$61 exclusive", "R&B", art[5]],
  ["City Motion", "808 Harbor", "$36 license", "Drill", art[0]],
  ["Warm Tape", "Zara Keys", "$29 license", "Afrobeat", art[1]],
  ["Velour 808", "Nova K", "$47 license", "Trap Soul", art[4]],
  ["Stage Light", "June Static", "$58 license", "Rock Flip", art[5]],
  ["Window Seat", "Lena Vox", "$33 license", "R&B", art[2]],
  ["Green Room", "Musa Wave", "$52 exclusive", "Afrobeat", art[3]]
];

function imageFor(item, index) {
  return item[4] || art[index % art.length];
}

function cardTemplate(item, index, type = "cover") {
  const [title, byline, meta, label] = item;
  const imageClass = type === "producer" ? "avatar" : type === "radio" ? "radio-cover" : type === "chart" ? "chart-cover" : "cover";
  const featured = index === 2 && type === "producer" ? " featured" : "";
  const visibleLabel = type === "producer" ? "" : `<span>${label}</span>`;

  return `
    <article class="card${featured}" style="--art:${imageFor(item, index)}">
      <div class="${imageClass}">${visibleLabel}</div>
      <button class="play" aria-label="Play ${title}"></button>
      <h3>${title}</h3>
      <p>${byline}</p>
      ${meta ? `<span class="price">${meta}</span>` : ""}
    </article>
  `;
}

function render(selector, data, type) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = data.map((item, index) => cardTemplate(item, index, type)).join("");
}

function bindPlayButtons(scope = document) {
  scope.querySelectorAll(".play").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const title = card.querySelector("h3").textContent;
      button.classList.toggle("is-playing");
      card.classList.toggle("featured");
      button.setAttribute("aria-label", `${button.classList.contains("is-playing") ? "Pause" : "Play"} ${title}`);
    });
  });
}

render("#beats", beats, "cover");
render("#producers", producers, "producer");
render("#packs-grid", packs, "cover");
render("#radio", radio, "radio");
render("#charts", charts, "chart");
bindPlayButtons();

const catalogGrid = document.querySelector("#beat-catalog");
const pageNumbers = document.querySelector("#page-numbers");
const pageStatus = document.querySelector("#page-status");
const prevPage = document.querySelector("#prev-page");
const nextPage = document.querySelector("#next-page");
const filters = document.querySelectorAll(".filter");
const sortSelect = document.querySelector("#beat-sort");
const perPage = 8;
let currentPage = 1;
let activeFilter = "All";

function filteredCatalog() {
  const data = activeFilter === "All" ? [...catalog] : catalog.filter((item) => item[3] === activeFilter);
  const sortMode = sortSelect ? sortSelect.value : "Trending";

  if (sortMode === "Newest") return data.reverse();
  if (sortMode === "Lowest price") {
    return data.sort((a, b) => Number(a[2].match(/\d+/)[0]) - Number(b[2].match(/\d+/)[0]));
  }
  if (sortMode === "Exclusive") {
    return data.sort((a, b) => Number(b[2].includes("exclusive")) - Number(a[2].includes("exclusive")));
  }

  return data;
}

function renderCatalog() {
  if (!catalogGrid) return;

  const data = filteredCatalog();
  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * perPage;
  const pageItems = data.slice(start, start + perPage);

  catalogGrid.innerHTML = pageItems.map((item, index) => cardTemplate(item, start + index, "cover")).join("");
  bindPlayButtons(catalogGrid);

  pageStatus.textContent = `Showing page ${currentPage} of ${totalPages}`;
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;

  pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="page-number${page === currentPage ? " active" : ""}" data-page="${page}">${page}</button>`;
  }).join("");

  pageNumbers.querySelectorAll(".page-number").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = Number(button.dataset.page);
      renderCatalog();
    });
  });
}

if (catalogGrid) {
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      filter.classList.add("active");
      activeFilter = filter.textContent.trim();
      currentPage = 1;
      renderCatalog();
    });
  });

  prevPage.addEventListener("click", () => {
    currentPage -= 1;
    renderCatalog();
  });

  nextPage.addEventListener("click", () => {
    currentPage += 1;
    renderCatalog();
  });

  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderCatalog();
  });

  renderCatalog();
}

const slider = document.querySelector(".slider");
const sliderNav = document.querySelector(".nav");

if (slider && sliderNav) {
  sliderNav.addEventListener("click", (event) => {
    const button = event.target.closest(".btn");
    if (!button) return;

    const items = slider.querySelectorAll(".item");
    if (button.classList.contains("next")) {
      slider.append(items[0]);
    }

    if (button.classList.contains("prev")) {
      slider.prepend(items[items.length - 1]);
    }
  });
}
// ── Mobile menu ───────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileNavOverlay');
  const nav = document.getElementById('mobileNav');

  if (!toggle || !overlay || !nav) return;

  function openMenu() {
    toggle.classList.add('active');
    overlay.classList.add('open');
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    overlay.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Handle mobile login/join buttons
  nav.querySelectorAll('.mobile-join, .mobile-login').forEach(function(btn) {
    btn.addEventListener('click', function() {
      closeMenu();
      // Trigger the desktop login button if it's the login button
      if (btn.classList.contains('mobile-login')) {
        const desktopLogin = document.querySelector('.pill-button');
        if (desktopLogin) desktopLogin.click();
      }
    });
  });
})();