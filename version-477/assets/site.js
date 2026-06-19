const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.hero-dots button'));
let heroIndex = 0;

function showHeroSlide(index) {
  if (!slides.length) {
    return;
  }
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === heroIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === heroIndex);
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showHeroSlide(index));
});

if (slides.length > 1) {
  setInterval(() => showHeroSlide(heroIndex + 1), 5200);
}

const searchBox = document.querySelector('[data-search-input]');
const yearFilter = document.querySelector('[data-year-filter]');
const genreFilter = document.querySelector('[data-genre-filter]');
const movieCards = Array.from(document.querySelectorAll('.movie-card'));

function filterCards() {
  const q = searchBox ? searchBox.value.trim().toLowerCase() : '';
  const y = yearFilter ? yearFilter.value : '';
  const g = genreFilter ? genreFilter.value : '';
  movieCards.forEach((card) => {
    const title = (card.dataset.title || '').toLowerCase();
    const year = card.dataset.year || '';
    const genre = card.dataset.genre || '';
    const okTitle = !q || title.includes(q);
    const okYear = !y || year === y;
    const okGenre = !g || genre.includes(g);
    card.style.display = okTitle && okYear && okGenre ? '' : 'none';
  });
}

[searchBox, yearFilter, genreFilter].forEach((el) => {
  if (el) {
    el.addEventListener('input', filterCards);
    el.addEventListener('change', filterCards);
  }
});

function startPlayer(shell) {
  const video = shell.querySelector('video');
  const cover = shell.querySelector('.player-cover');
  const src = shell.dataset.stream || '';
  if (!video || !src) {
    return;
  }
  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });
  } else {
    video.src = src;
    video.play().catch(() => {});
  }
  if (cover) {
    cover.classList.add('hidden');
  }
}

document.querySelectorAll('.player-shell').forEach((shell) => {
  const cover = shell.querySelector('.player-cover');
  const button = shell.querySelector('.big-play');
  if (cover) {
    cover.addEventListener('click', () => startPlayer(shell));
  }
  if (button) {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      startPlayer(shell);
    });
  }
});
