import { searchIndex } from './search-index.js';

var form = document.getElementById('search-page-form');
var input = document.getElementById('search-page-input');
var results = document.getElementById('search-results');

function getQuery() {
  return new URLSearchParams(window.location.search).get('q') || '';
}

function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

function render(items) {
  if (!results) {
    return;
  }
  if (!items.length) {
    results.innerHTML = '<div class="empty-state">没有找到匹配的影片</div>';
    return;
  }
  results.innerHTML = items.slice(0, 120).map(function (item) {
    return [
      '<article class="movie-card">',
      '  <a href="' + item.url + '" class="card-image">',
      '    <img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span>' + escapeHtml(item.category) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
      '    <p>' + escapeHtml(item.oneLine) + '</p>',
      '    <div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }).join('');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function search(query) {
  var normalized = normalize(query);
  if (!normalized) {
    render(searchIndex.slice(0, 48));
    return;
  }
  var words = normalized.split(/\s+/).filter(Boolean);
  var matches = searchIndex.filter(function (item) {
    var haystack = normalize([
      item.title,
      item.year,
      item.region,
      item.type,
      item.category,
      item.genre,
      item.tags.join(' '),
      item.oneLine
    ].join(' '));
    return words.every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  });
  render(matches);
}

var initialQuery = getQuery();
if (input) {
  input.value = initialQuery;
}
search(initialQuery);

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = input ? input.value.trim() : '';
    var nextUrl = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
    window.history.replaceState(null, '', nextUrl);
    search(query);
  });
}
