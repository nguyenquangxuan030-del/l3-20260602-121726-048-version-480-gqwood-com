(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupHeader() {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (header) {
      var sync = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 6);
      };
      sync();
      window.addEventListener('scroll', sync, { passive: true });
    }

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }
  }

  function setupSearchForms() {
    selectAll('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[type="search"]');
        var target = form.getAttribute('data-search-action') || form.getAttribute('action') || 'search.html';
        var query = input ? input.value.trim() : '';
        window.location.href = query ? target + '?q=' + encodeURIComponent(query) : target;
      });
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }

    var slides = selectAll('[data-hero-slide]', slider);
    var dots = selectAll('[data-hero-dot]', slider);
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer;

    if (slides.length < 2) {
      return;
    }

    function go(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        go(current + 1);
      }, 6200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        go(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        go(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        go(current + 1);
        restart();
      });
    }

    restart();
  }

  function setupFilters() {
    var list = document.querySelector('[data-card-list]');
    if (!list) {
      return;
    }

    var root = document.querySelector('[data-library]') || document;
    var textInput = root.querySelector('[data-filter-text]');
    var yearSelect = root.querySelector('[data-filter-year]');
    var categorySelect = root.querySelector('[data-filter-category]');
    var resetButton = root.querySelector('[data-filter-reset]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = selectAll('[data-card]', list);
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (textInput && initialQuery) {
      textInput.value = initialQuery;
    }

    function normalize(value) {
      return (value || '').toString().toLowerCase();
    }

    function apply() {
      var query = normalize(textInput ? textInput.value.trim() : '');
      var year = yearSelect ? yearSelect.value : '';
      var category = categorySelect ? categorySelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var matchCategory = !category || card.getAttribute('data-category') === category;
        var show = matchQuery && matchYear && matchCategory;

        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    [textInput, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (textInput) {
          textInput.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        if (categorySelect) {
          categorySelect.value = '';
        }
        apply();
      });
    }

    apply();
  }

  ready(function () {
    setupHeader();
    setupSearchForms();
    setupHero();
    setupFilters();
  });
})();
