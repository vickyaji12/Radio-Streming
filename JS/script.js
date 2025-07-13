function setupHLSPlayer(url, elementId) {
  const audio = document.getElementById(elementId);
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(audio);
  } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
    audio.src = url;
  }
}

setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_genfm/genfm/playlist.m3u8",
  "genfm"
);
setupHLSPlayer(
  "https://wz.mari.co.id:1936/web_jakfm/jakfm/playlist.m3u8",
  "jakfm"
);
