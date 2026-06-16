// ============================
// SETUP STREAMING HLS
// ============================

function setupHLSPlayer(url, elementId) {
  const audio = document.getElementById(elementId);
  if (!audio) return;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(audio);
  } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
    audio.src = url;
  }
}

setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8",
  "jakfm",
);

// ============================
// NOTICE MODAL
// ============================

const noticeModal = document.getElementById("noticeModal");
const noticeClose = document.getElementById("noticeClose");

function openNoticeModal() {
  noticeModal.hidden = false;
  document.body.style.overflow = "hidden";
  noticeClose.focus();
}

function closeNoticeModal() {
  noticeModal.hidden = true;
  document.body.style.overflow = "";
  sessionStorage.setItem("noticeDismissed", "1");
}

noticeClose.addEventListener("click", closeNoticeModal);

noticeModal.addEventListener("click", (e) => {
  if (e.target === noticeModal) closeNoticeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !noticeModal.hidden) closeNoticeModal();
});

// Tampilkan selalu setiap reload halaman (tanpa cache sessionStorage)
openNoticeModal();

// ============================
// CUSTOM PLAYER CONTROLS
// ============================

let currentlyPlaying = null;

const nowPlayingBar = document.getElementById("nowPlayingBar");
const npStation = document.getElementById("npStation");
const npIcon = document.getElementById("npIcon");
const npStop = document.getElementById("npStop");

function getCardForAudio(audio) {
  return audio.closest(".radio-card");
}

function setPlayingState(audio, playing) {
  const card = getCardForAudio(audio);
  if (!card) return;

  card.classList.toggle("is-playing", playing);

  if (playing) {
    currentlyPlaying = audio;
    const name = card.querySelector(".station-name").textContent;
    const icon = card.querySelector(".station-icon").textContent;
    npStation.textContent = name;
    npIcon.textContent = icon;
    nowPlayingBar.hidden = false;
  } else if (currentlyPlaying === audio) {
    currentlyPlaying = null;
    nowPlayingBar.hidden = true;
  }
}

function stopAllExcept(exceptAudio) {
  document.querySelectorAll(".radio-card audio").forEach((a) => {
    if (a !== exceptAudio && !a.paused) {
      a.pause();
      setPlayingState(a, false);
    }
  });
}

document.querySelectorAll(".btn-play").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".radio-card");
    if (card?.dataset.available === "false") return;

    const audio = document.getElementById(btn.dataset.target);
    if (!audio) return;

    if (audio.paused) {
      stopAllExcept(audio);
      audio.volume = parseFloat(
        btn.closest(".player-controls").querySelector(".volume-slider").value,
      );
      audio.play().catch(() => {});
      setPlayingState(audio, true);
    } else {
      audio.pause();
      setPlayingState(audio, false);
    }
  });
});

document.querySelectorAll(".volume-slider").forEach((slider) => {
  slider.addEventListener("input", () => {
    const audio = slider.closest(".radio-card").querySelector("audio");
    audio.volume = parseFloat(slider.value);
  });
});

document.querySelectorAll(".radio-card audio").forEach((audio) => {
  audio.volume = 0.8;

  audio.addEventListener("play", () => setPlayingState(audio, true));
  audio.addEventListener("pause", () => setPlayingState(audio, false));
  audio.addEventListener("ended", () => setPlayingState(audio, false));
});

npStop.addEventListener("click", () => {
  if (currentlyPlaying) {
    currentlyPlaying.pause();
    setPlayingState(currentlyPlaying, false);
  }
});

// ============================
// BLOKIR DEVTOOLS & INSPECT
// ============================

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();
  }
});

const threshold = 160;
let devtoolsOpen = false;

setInterval(function () {
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;

  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true;
      alert("Developer tools terdeteksi! Akses dibatasi.");
      window.location.href = "about:blank";
    }
  } else {
    devtoolsOpen = false;
  }
}, 1000);
