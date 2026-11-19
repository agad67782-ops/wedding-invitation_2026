(function () {
  'use strict';

  // ===== Wedding date: Friday 11 Dec 2026, 8:00 PM Cairo time (EET, UTC+2 in December) =====
  var WEDDING = new Date('2026-12-11T20:00:00+02:00').getTime();

  var body = document.body;
  var intro = document.getElementById('intro');
  var envelope = document.getElementById('envelope');
  var invite = document.getElementById('invite');
  var audio = document.getElementById('bgm');
  var musicBtn = document.getElementById('musicBtn');
  var opened = false;

  // ===== Music: starts when the visitor taps the envelope (or the music button) =====
  var audioOk = true;
  var source = audio.querySelector('source');
  function audioFailed() { audioOk = false; musicBtn.hidden = true; }
  if (source) source.addEventListener('error', audioFailed);
  audio.addEventListener('error', audioFailed);

  function setPlaying(on) {
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', on ? 'إيقاف الموسيقى · Pause music' : 'تشغيل الموسيقى · Play music');
  }
  audio.addEventListener('playing', function () { setPlaying(true); });
  audio.addEventListener('pause', function () { setPlaying(false); });

  function startMusic() {
    if (!audioOk) return;
    audio.volume = 0.7;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setPlaying(false); });
  }

  musicBtn.addEventListener('click', function () {
    if (!audioOk) return;
