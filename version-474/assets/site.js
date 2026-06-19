(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previews = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-preview]'));
    var current = 0;
    var timer = null;

    function setHero(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
      previews.forEach(function (preview, i) {
        preview.classList.toggle('is-active', i === current);
      });
    }

    function restartHero() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        setHero(current + 1);
      }, 5200);
    }

    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');
    if (next) {
      next.addEventListener('click', function () {
        setHero(current + 1);
        restartHero();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        setHero(current - 1);
        restartHero();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setHero(Number(dot.getAttribute('data-hero-dot') || 0));
        restartHero();
      });
    });
    previews.forEach(function (preview) {
      preview.addEventListener('mouseenter', function () {
        setHero(Number(preview.getAttribute('data-hero-preview') || 0));
        restartHero();
      });
    });
    restartHero();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
  forms.forEach(function (form) {
    var scope = document.querySelector(form.getAttribute('data-filter-form')) || document;
    var keyword = form.querySelector('[data-filter-keyword]');
    var year = form.querySelector('[data-filter-year]');
    var type = form.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

    function applyFilter() {
      var key = keyword ? keyword.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      cards.forEach(function (card) {
        var text = card.getAttribute('data-title') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var show = true;
        if (key && text.indexOf(key) === -1) {
          show = false;
        }
        if (yearValue && cardYear !== yearValue) {
          show = false;
        }
        if (typeValue && cardType !== typeValue) {
          show = false;
        }
        card.classList.toggle('hidden-card', !show);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
    [keyword, year, type].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilter);
        input.addEventListener('change', applyFilter);
      }
    });
  });
})();
