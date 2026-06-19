(function () {
  var shell = document.querySelector('[data-video-shell]');
  var video = document.querySelector('[data-video]');
  var button = document.querySelector('[data-play-button]');
  if (!shell || !video || !button) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hlsInstance = null;

  function loadSource() {
    if (!source) {
      return Promise.reject(new Error('empty source'));
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 60
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      }
      return Promise.resolve();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', source);
      }
      return Promise.resolve();
    }
    video.setAttribute('src', source);
    return Promise.resolve();
  }

  function playVideo() {
    loadSource().then(function () {
      shell.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }).catch(function () {
      shell.classList.remove('is-playing');
    });
  }

  button.addEventListener('click', playVideo);
  shell.addEventListener('click', function (event) {
    if (event.target === video) {
      return;
    }
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('is-playing');
  });
  video.addEventListener('pause', function () {
    shell.classList.remove('is-playing');
  });
})();
