(function() {
    var players = document.querySelectorAll("[data-video]");

    players.forEach(function(player) {
        var video = player.querySelector("video");
        var button = player.querySelector("[data-play]");
        var source = player.getAttribute("data-video");
        var ready = false;
        var hls = null;

        function start() {
            if (!video || !source) {
                return;
            }

            if (!ready) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
                ready = true;
            }

            player.classList.add("is-playing");
            video.setAttribute("controls", "controls");

            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function() {});
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function() {
                if (!ready || video.paused) {
                    start();
                } else {
                    video.pause();
                }
            });

            video.addEventListener("play", function() {
                player.classList.add("is-playing");
            });

            video.addEventListener("ended", function() {
                player.classList.remove("is-playing");
            });
        }

        window.addEventListener("beforeunload", function() {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
