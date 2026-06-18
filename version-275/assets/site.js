(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var input = root.querySelector('.filter-input');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-filter-value]'));
    var chipValue = '';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' '));
        var queryMatched = !query || haystack.indexOf(query) !== -1;
        var chipMatched = !chipValue || haystack.indexOf(normalize(chipValue)) !== -1;
        card.style.display = queryMatched && chipMatched ? '' : 'none';
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        chipValue = button.getAttribute('data-filter-value') || '';
        applyFilter();
      });
    });
  });
})();
