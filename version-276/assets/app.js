
(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function schedule() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        schedule();
      });
    }

    show(0);
    schedule();
  }

  function initSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-local-search]'));
    forms.forEach(function (form) {
      var input = form.querySelector('input[type="search"]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
      if (!input || cards.length === 0) {
        return;
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });

      input.addEventListener('input', function () {
        var value = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          card.classList.toggle('hidden-by-search', value && text.indexOf(value) === -1);
        });
      });
    });
  }

  window.setupPlayer = function (videoId, buttonId, coverId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var cover = document.getElementById(coverId);
    var prepared = false;
    var hls = null;

    if (!video || !button || !cover || !sourceUrl) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = sourceUrl;
    }

    function start() {
      prepare();
      cover.classList.add('is-hidden');
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    button.addEventListener('click', start);
    cover.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
}());
