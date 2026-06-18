
const params = new URLSearchParams(window.location.search);
const input = document.querySelector("#searchInput");
const resultBox = document.querySelector("#searchResults");
const countBox = document.querySelector("#searchCount");
const categorySelect = document.querySelector("#searchCategory");
const yearSelect = document.querySelector("#searchYear");
const initialQuery = params.get("q") || "";

if (input) {
  input.value = initialQuery;
}

const years = Array.from(new Set(SITE_MOVIES.map((item) => item.yearNum))).sort((a, b) => b - a);

years.forEach((year) => {
  const option = document.createElement("option");
  option.value = String(year);
  option.textContent = String(year);
  yearSelect?.appendChild(option);
});

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function movieCard(movie) {
  return `
    <article class="movie-card">
      <a class="poster-link" href="${escapeHtml(movie.url)}">
        <img src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy">
        <span class="score-badge">${escapeHtml(movie.score)}</span>
        <span class="type-badge">${escapeHtml(movie.category)}</span>
      </a>
      <div class="movie-card-body">
        <h2><a href="${escapeHtml(movie.url)}">${escapeHtml(movie.title)}</a></h2>
        <p>${escapeHtml(movie.oneLine)}</p>
        <div class="meta-line"><span>${escapeHtml(movie.year)}</span><span>${escapeHtml(movie.region)}</span><span>${escapeHtml(movie.type)}</span></div>
        <div class="tag-row"><span>${escapeHtml(movie.genre)}</span></div>
      </div>
    </article>
  `;
}

function runSearch() {
  const query = (input?.value || "").trim().toLowerCase();
  const category = categorySelect?.value || "";
  const year = yearSelect?.value || "";

  const matched = SITE_MOVIES.filter((movie) => {
    const text = [movie.title, movie.region, movie.type, movie.genre, movie.category, movie.oneLine, movie.year].join(" ").toLowerCase();
    const queryMatched = !query || text.includes(query);
    const categoryMatched = !category || movie.category === category;
    const yearMatched = !year || String(movie.yearNum) === year;
    return queryMatched && categoryMatched && yearMatched;
  }).slice(0, 120);

  if (countBox) {
    countBox.textContent = `找到 ${matched.length} 条结果`;
  }

  if (resultBox) {
    resultBox.innerHTML = matched.map(movieCard).join("");
    resultBox.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => image.classList.add("is-missing"));
    });
  }
}

input?.addEventListener("input", runSearch);
categorySelect?.addEventListener("change", runSearch);
yearSelect?.addEventListener("change", runSearch);
runSearch();
