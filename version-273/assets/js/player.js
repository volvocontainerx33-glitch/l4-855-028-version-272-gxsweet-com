(function () {
  window.initializePlayer = function (videoId, streamUrl) {
    var video = document.getElementById(videoId);
    if (!video) {
      return;
    }

    var frame = video.closest(".player-wrap");
    var overlay = frame ? frame.querySelector(".player-overlay") : null;
    var playButton = frame ? frame.querySelector(".player-play") : null;
    var message = frame ? frame.querySelector(".player-message") : null;
    var hls = null;
    var prepared = false;

    function showMessage(value) {
      if (!message) {
        return;
      }
      message.textContent = value;
      message.classList.add("is-visible");
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频暂时无法播放");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        showMessage("视频暂时无法播放");
      }
    }

    function play() {
      prepare();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.controls = true;
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  };
})();
