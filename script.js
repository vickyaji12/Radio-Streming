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

// Untuk Gen FM & Jak FM (pakai HLS)
setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_genfm/genfm/playlist.m3u8",
  "genfm"
);
setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8",
  "jakfm"
);
setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_kisfm/kisfm/playlist.m3u8",
  "kisfm"
);

// ============================
// BLOKIR DEVTOOLS & INSPECT
// ============================

// Blok klik kanan
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Blok F12, Ctrl+Shift+I/J/C dan Ctrl+U
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

// Deteksi jika DevTools dibuka (via ukuran jendela)
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
