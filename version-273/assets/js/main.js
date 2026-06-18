(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("site-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var opened = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var searchPage = document.querySelector("[data-search-page]");
    if (!searchPage) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var input = document.getElementById("movie-search-input");
    var category = document.getElementById("movie-category-select");
    var year = document.getElementById("movie-year-select");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-card"));
    var empty = document.querySelector(".empty-result");

    if (input && params.get("q")) {
      input.value = params.get("q");
    }

    function filterCards() {
      var keyword = normalize(input ? input.value : "");
      var selectedCategory = category ? category.value : "";
      var selectedYear = year ? year.value : "";
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute("data-search"));
        var cardCategory = card.getAttribute("data-category") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = !selectedCategory || cardCategory === selectedCategory;
        var matchYear = !selectedYear || cardYear === selectedYear;
        var visible = matchKeyword && matchCategory && matchYear;

        card.classList.toggle("hidden-card", !visible);
        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", shown === 0);
      }
    }

    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });

    filterCards();
  });
})();
