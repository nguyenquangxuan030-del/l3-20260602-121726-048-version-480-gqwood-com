(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initializePlayer(root) {
    var video = root.querySelector('video');
    var overlay = root.querySelector('[data-player-overlay]');
    var button = root.querySelector('[data-play-button]');
    var stream = root.getAttribute('data-stream');
    var hlsInstance = null;
    var loaded = false;

    if (!video || !stream) {
      return;
    }

    function loadStream() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      }
    }

    function begin() {
      loadStream();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', begin);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        begin();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        begin();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initializePlayer);
  });
})();
