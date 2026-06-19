(function () {
  function select(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function selectAll(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var toggle = select('[data-menu-toggle]');
    var nav = select('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = select('[data-hero]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    var prev = select('[data-hero-prev]', root);
    var next = select('[data-hero-next]', root);
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        start();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initCatalogFilter() {
    selectAll('[data-filter-scope]').forEach(function (scope) {
      var input = select('[data-filter-input]', scope);
      var year = select('[data-filter-year]', scope);
      var type = select('[data-filter-type]', scope);
      var cards = selectAll('[data-movie-card]', scope);
      var empty = select('[data-empty-state]', scope);

      function apply() {
        var query = normalize(input && input.value);
        var yearValue = normalize(year && year.value);
        var typeValue = normalize(type && type.value);
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-card-title') + ' ' + card.getAttribute('data-card-meta'));
          var matchesQuery = !query || text.indexOf(query) !== -1;
          var matchesYear = !yearValue || text.indexOf(yearValue) !== -1;
          var matchesType = !typeValue || text.indexOf(typeValue) !== -1;
          var shouldShow = matchesQuery && matchesYear && matchesType;
          card.style.display = shouldShow ? '' : 'none';
          if (shouldShow) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [input, year, type].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function renderSearchItem(item) {
    return '<a class="search-result-item" href="' + item.url + '">' +
      '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
      '<span><strong>' + item.title + '</strong><span>' + item.meta + ' · ' + item.category + '</span></span>' +
      '</a>';
  }

  function initGlobalSearch() {
    var input = select('[data-global-search]');
    var panel = select('[data-search-results]');
    if (!input || !panel || typeof MOVIE_INDEX_DATA === 'undefined') {
      return;
    }

    function apply() {
      var query = normalize(input.value);
      if (!query) {
        panel.classList.remove('is-open');
        panel.innerHTML = '';
        return;
      }
      var results = MOVIE_INDEX_DATA.filter(function (item) {
        var text = normalize(item.title + ' ' + item.meta + ' ' + item.genre + ' ' + item.tags.join(' ') + ' ' + item.category);
        return text.indexOf(query) !== -1;
      }).slice(0, 8);
      if (!results.length) {
        panel.innerHTML = '<div class="search-result-item"><span><strong>暂无匹配影片</strong><span>换一个关键词试试</span></span></div>';
      } else {
        panel.innerHTML = results.map(renderSearchItem).join('') + '<a class="search-result-item" href="./search.html?q=' + encodeURIComponent(query) + '"><span><strong>查看全部结果</strong><span>' + query + '</span></span></a>';
      }
      panel.classList.add('is-open');
    }

    input.addEventListener('input', apply);
    document.addEventListener('click', function (event) {
      if (!event.target.closest('[data-search-box]')) {
        panel.classList.remove('is-open');
      }
    });
  }

  function initSearchPage() {
    var input = select('[data-search-page-input]');
    var scope = select('[data-search-page-scope]');
    if (!input || !scope) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
      input.value = query;
      input.dispatchEvent(new Event('input'));
      var localFilter = select('[data-filter-input]', scope);
      if (localFilter) {
        localFilter.value = query;
        localFilter.dispatchEvent(new Event('input'));
      }
    }
  }

  function initPlayer() {
    var video = select('[data-stream-url]');
    if (!video) {
      return;
    }
    var streamUrl = video.getAttribute('data-stream-url');
    var overlay = select('[data-player-action]');
    var hlsInstance = null;

    function attachStream() {
      if (!streamUrl) {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function playVideo() {
      if (!video.src && !hlsInstance) {
        attachStream();
      }
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    }

    attachStream();

    if (overlay) {
      overlay.addEventListener('click', function () {
        playVideo();
      });
      video.addEventListener('play', function () {
        overlay.hidden = true;
      });
      video.addEventListener('pause', function () {
        overlay.hidden = false;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initCatalogFilter();
    initGlobalSearch();
    initSearchPage();
    initPlayer();
  });
})();
