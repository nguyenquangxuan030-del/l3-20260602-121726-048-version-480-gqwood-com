(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function updateHeader(header) {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    var toggle = document.querySelector("[data-menu-toggle]");
    if (!header) {
      return;
    }
    updateHeader(header);
    window.addEventListener("scroll", function () {
      updateHeader(header);
    });
    if (toggle) {
      toggle.addEventListener("click", function () {
        header.classList.toggle("is-open");
      });
    }
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function getQueryValue() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function setupFilters() {
    var searchInput = document.querySelector("[data-page-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-button]"));
    var currentFilter = "all";

    if (!cards.length) {
      return;
    }

    function normalize(value) {
      return String(value || "").toLowerCase();
    }

    function apply() {
      var query = searchInput ? normalize(searchInput.value.trim()) : "";
      cards.forEach(function (card) {
        var target = normalize(card.getAttribute("data-search"));
        var category = card.getAttribute("data-filter") || "";
        var matchesText = !query || target.indexOf(query) !== -1;
        var matchesFilter = currentFilter === "all" || category === currentFilter;
        card.classList.toggle("is-hidden-by-filter", !(matchesText && matchesFilter));
      });
    }

    if (searchInput) {
      var initial = getQueryValue();
      if (initial) {
        searchInput.value = initial;
      }
      searchInput.addEventListener("input", apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentFilter = button.getAttribute("data-filter-button") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        apply();
      });
    });

    apply();
  }

  ready(function () {
    setupHeader();
    setupHero();
    setupFilters();
  });
})();
