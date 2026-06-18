(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero-slider]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        show(0);
        start();
    }

    function initSearch() {
        var input = document.querySelector(".site-search");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
        var empty = document.querySelector("[data-empty-state]");
        var selected = "";
        if (!input || !cards.length) {
            return;
        }
        function apply() {
            var query = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-filter") || card.textContent || "").toLowerCase();
                var matchedQuery = !query || text.indexOf(query) !== -1;
                var matchedChip = !selected || text.indexOf(selected.toLowerCase()) !== -1;
                var show = matchedQuery && matchedChip;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }
        input.addEventListener("input", apply);
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });
                chip.classList.add("active");
                selected = chip.getAttribute("data-filter-chip") || "";
                apply();
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initSearch();
    });
})();

function initVideoPlayer(sourceUrl) {
    var video = document.getElementById("videoPlayer");
    var cover = document.getElementById("playCover");
    var shell = document.getElementById("playerShell");
    var loaded = false;
    var hlsInstance = null;
    if (!video || !sourceUrl) {
        return;
    }
    function load() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
    }
    function play() {
        load();
        if (cover) {
            cover.classList.add("hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }
    if (cover) {
        cover.addEventListener("click", play);
    }
    if (shell) {
        shell.addEventListener("click", function (event) {
            if (event.target === video && video.paused) {
                play();
            }
        });
    }
    video.addEventListener("play", function () {
        if (cover) {
            cover.classList.add("hidden");
        }
    });
    video.addEventListener("emptied", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
        loaded = false;
    });
}
