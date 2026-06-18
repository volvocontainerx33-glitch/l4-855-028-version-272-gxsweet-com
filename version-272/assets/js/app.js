(function() {
    var body = document.body;
    var root = body ? body.getAttribute("data-root") || "./" : "./";
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    var searchFormTop = document.querySelector(".top-search");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function() {
            nav.classList.toggle("is-open");
            if (searchFormTop) {
                searchFormTop.classList.toggle("is-open");
            }
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function(form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            var input = form.querySelector("input[name='q']");
            var query = input ? input.value.trim() : "";
            var target = root + "search.html";
            if (query) {
                target += "?q=" + encodeURIComponent(query);
            }
            window.location.href = target;
        });
    });

    var localSearchInput = document.querySelector("[data-local-search]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var empty = document.querySelector("[data-empty]");

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        var query = normalize(localSearchInput ? localSearchInput.value : "");
        var year = yearFilter ? yearFilter.value : "";
        var visible = 0;

        cards.forEach(function(card) {
            var text = normalize(card.getAttribute("data-text"));
            var cardYear = card.getAttribute("data-year") || "";
            var matchedQuery = !query || text.indexOf(query) !== -1;
            var matchedYear = !year || cardYear === year;
            var show = matchedQuery && matchedYear;

            card.style.display = show ? "" : "none";
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.style.display = visible ? "none" : "block";
        }
    }

    if (localSearchInput) {
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q") || "";
        if (queryValue && !localSearchInput.value) {
            localSearchInput.value = queryValue;
        }
        localSearchInput.addEventListener("input", applyFilters);
        applyFilters();
    }

    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
    }
})();
