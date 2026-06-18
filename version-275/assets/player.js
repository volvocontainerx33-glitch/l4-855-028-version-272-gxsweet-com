function mountMoviePlayer(options) {
  var video = document.getElementById(options.videoId);
  var cover = document.getElementById(options.coverId);
  var button = document.getElementById(options.buttonId);
  var source = options.source;
  var ready = false;
  var hlsInstance = null;

  function prepare() {
    if (ready || !video || !source) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    }
    ready = true;
  }

  function start() {
    prepare();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    if (video) {
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }
  if (cover) {
    cover.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
