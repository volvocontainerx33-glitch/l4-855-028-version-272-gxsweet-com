
const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobilePanel.hidden = expanded;
  });
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
  });
});

const categoryInput = document.querySelector(".category-filter-input");
const categoryYear = document.querySelector(".category-year-filter");
const categoryRegion = document.querySelector(".category-region-filter");
const categoryCards = Array.from(document.querySelectorAll(".category-movie-grid .movie-card"));

function filterCategoryCards() {
  const query = (categoryInput?.value || "").trim().toLowerCase();
  const year = categoryYear?.value || "";
  const region = categoryRegion?.value || "";

  categoryCards.forEach((card) => {
    const text = [
      card.dataset.title,
      card.dataset.region,
      card.dataset.genre,
      card.dataset.year
    ].join(" ").toLowerCase();
    const yearMatched = !year || card.dataset.year === year;
    const regionMatched = !region || card.dataset.region === region;
    const queryMatched = !query || text.includes(query);
    card.classList.toggle("is-hidden", !(yearMatched && regionMatched && queryMatched));
  });
}

[categoryInput, categoryYear, categoryRegion].forEach((control) => {
  control?.addEventListener("input", filterCategoryCards);
  control?.addEventListener("change", filterCategoryCards);
});

const player = document.querySelector("#movie-player[data-stream]");

if (player) {
  const shell = player.closest(".video-shell");
  const playButton = shell?.querySelector(".video-play-button");
  const message = shell?.querySelector(".video-message");
  const stream = player.getAttribute("data-stream");

  async function attachStream() {
    if (!stream) {
      if (message) {
        message.textContent = "视频源暂不可用";
      }
      return;
    }

    if (player.canPlayType("application/vnd.apple.mpegurl")) {
      player.src = stream;
      return;
    }

    try {
      const module = await import("./hls-dru42stk.js");
      const Hls = module.H;
      if (Hls && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(stream);
        hls.attachMedia(player);
      } else {
        player.src = stream;
      }
    } catch (error) {
      player.src = stream;
      if (message) {
        message.textContent = "视频加载中，请稍后重试";
      }
    }
  }

  attachStream();

  playButton?.addEventListener("click", async () => {
    try {
      await player.play();
      shell?.classList.add("is-playing");
    } catch (error) {
      if (message) {
        message.textContent = "点击播放器控件可继续播放";
      }
    }
  });

  player.addEventListener("play", () => shell?.classList.add("is-playing"));
  player.addEventListener("pause", () => shell?.classList.remove("is-playing"));
}
