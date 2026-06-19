(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    let active = 0;
    const show = function (index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 5200);
  }

  const panels = Array.from(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    const scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
    const keyword = panel.querySelector('[data-filter-keyword]');
    const type = panel.querySelector('[data-filter-type]');
    const year = panel.querySelector('[data-filter-year]');
    const cards = Array.from(scope.querySelectorAll('[data-title]'));
    const empty = scope.querySelector('[data-empty-result]');
    const apply = function () {
      const q = (keyword && keyword.value ? keyword.value : '').trim().toLowerCase();
      const t = type && type.value ? type.value : '';
      const y = year && year.value ? year.value : '';
      let visible = 0;
      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        const matched = (!q || haystack.indexOf(q) !== -1) && (!t || card.getAttribute('data-type') === t) && (!y || card.getAttribute('data-year') === y);
        card.style.display = matched ? '' : 'none';
        if (matched) visible += 1;
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    [keyword, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  });
})();

function initMoviePlayer(playlist) {
  const video = document.getElementById('movieVideo');
  const cover = document.getElementById('playerCover');
  const button = document.getElementById('playButton');
  if (!video || !cover || !button || !playlist) {
    return;
  }
  let prepared = false;
  let hlsInstance = null;
  const attach = function () {
    if (prepared) {
      return Promise.resolve();
    }
    prepared = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playlist;
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(playlist);
      hlsInstance.attachMedia(video);
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
      script.onload = function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(playlist);
          hlsInstance.attachMedia(video);
        } else {
          video.src = playlist;
        }
        resolve();
      };
      script.onerror = function () {
        video.src = playlist;
        resolve();
      };
      document.head.appendChild(script);
    });
  };
  const start = function () {
    attach().then(function () {
      cover.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      const playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
    });
  };
  button.addEventListener('click', start);
  cover.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (!prepared) {
      start();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
