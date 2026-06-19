(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function connectPlayer(block) {
    var video = block.querySelector("[data-player-video]");
    var mask = block.querySelector("[data-player-mask]");
    var playUrl = block.getAttribute("data-play");
    var started = false;
    var hls = null;

    if (!video || !playUrl) {
      return;
    }

    function begin() {
      if (mask) {
        mask.classList.add("is-hidden");
      }
      video.setAttribute("controls", "controls");

      if (!started) {
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = playUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(playUrl);
          hls.attachMedia(video);
        } else {
          video.src = playUrl;
        }
      }

      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {});
      }
    }

    if (mask) {
      mask.addEventListener("click", begin);
    }
    video.addEventListener("click", function () {
      if (!started) {
        begin();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-movie-player]")).forEach(connectPlayer);
  });
})();
