document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var currentSlide = 0;
    var heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === currentSlide);
            slide.setAttribute("aria-hidden", i === currentSlide ? "false" : "true");
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    function startHero() {
        if (heroTimer) {
            clearInterval(heroTimer);
        }

        if (slides.length > 1) {
            heroTimer = setInterval(function () {
                showSlide(currentSlide + 1);
            }, 5200);
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startHero();
        });
    });

    startHero();

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));

    filterPanels.forEach(function (panel) {
        var section = panel.closest(".content-section") || document;
        var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));
        var input = panel.querySelector(".search-input");
        var typeFilter = panel.querySelector(".type-filter");
        var yearFilter = panel.querySelector(".year-filter");
        var empty = section.querySelector(".no-results");

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            var typeValue = typeFilter ? typeFilter.value : "";
            var yearValue = yearFilter ? yearFilter.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-title") || "").toLowerCase();
                var type = card.getAttribute("data-type") || "";
                var year = card.getAttribute("data-year") || "";
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchType = !typeValue || type === typeValue;
                var matchYear = !yearValue || year === yearValue;
                var matched = matchKeyword && matchType && matchYear;

                card.style.display = matched ? "" : "none";

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (typeFilter) {
            typeFilter.addEventListener("change", applyFilter);
        }

        if (yearFilter) {
            yearFilter.addEventListener("change", applyFilter);
        }
    });
});
