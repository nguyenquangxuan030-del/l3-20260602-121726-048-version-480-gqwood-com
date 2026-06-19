(function () {
    var header = document.querySelector(".site-header");
    var menu = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 20) {
            header.classList.add("is-solid");
        } else {
            header.classList.remove("is-solid");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menu && panel) {
        menu.addEventListener("click", function () {
            var open = panel.classList.toggle("open");
            menu.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var searchInput = document.getElementById("searchInput");
    var q = params.get("q") || "";
    if (searchInput && q) {
        searchInput.value = q;
    }

    var localFilter = document.querySelector(".local-filter");
    var yearFilter = document.querySelector(".year-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-grid .movie-card"));

    function cardText(card) {
        return [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-region") || "",
            card.textContent || ""
        ].join(" ").toLowerCase();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }
        var keyword = "";
        if (localFilter) {
            keyword = localFilter.value.trim().toLowerCase();
        }
        if (searchInput) {
            keyword = searchInput.value.trim().toLowerCase();
        }
        var year = yearFilter ? yearFilter.value : "";
        cards.forEach(function (card) {
            var text = cardText(card);
            var cardYear = card.getAttribute("data-year") || "";
            var keywordOk = !keyword || text.indexOf(keyword) !== -1;
            var yearOk = true;
            if (year) {
                if (year === "2020") {
                    yearOk = Number(cardYear) <= 2020;
                } else {
                    yearOk = cardYear === year;
                }
            }
            card.classList.toggle("is-hidden-card", !(keywordOk && yearOk));
        });
    }

    if (q && searchInput) {
        applyFilter();
    }
    if (localFilter) {
        localFilter.addEventListener("input", applyFilter);
    }
    if (searchInput) {
        searchInput.addEventListener("input", applyFilter);
    }
    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilter);
    }
}());
