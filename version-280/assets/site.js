(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-menu-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("nav-open");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        show(0);
        if (slides.length > 1) {
            setInterval(function () {
                show(current + 1);
            }, 5200);
        }
    }

    function initSearch() {
        var input = document.querySelector("[data-page-search]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        var empty = document.querySelector("[data-empty-state]");
        if (!input || !cards.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
            input.value = query;
        }
        function apply() {
            var q = normalize(input.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-meta") + " " + card.textContent);
                var hit = !q || text.indexOf(q) !== -1;
                card.style.display = hit ? "" : "none";
                if (hit) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }
        input.addEventListener("input", apply);
        apply();
    }

    ready(function () {
        initMenu();
        initHero();
        initSearch();
    });

    window.initVideoPlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var cover = document.getElementById(options.coverId);
        var loaded = false;
        var hlsInstance = null;
        if (!video) {
            return;
        }
        function setSource() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(options.source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = options.source;
            }
        }
        function start() {
            setSource();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }
        if (button) {
            button.addEventListener("click", start);
        }
        if (cover && cover !== button) {
            cover.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                start();
            }
        });
        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
