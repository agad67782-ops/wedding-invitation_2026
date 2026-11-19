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
    if (audio.paused) startMusic(); else audio.pause();
  });

  // ===== Envelope =====
  function openEnvelope() {
    if (opened) return;
    opened = true;
    startMusic(); // الضغط على الظرف هو تفاعل الزائر، فالمتصفح بيسمح بالتشغيل
    envelope.classList.add('open');
    setTimeout(function () { envelope.classList.add('rise'); }, 750);
    setTimeout(function () { intro.classList.add('leave'); }, 2300);
    setTimeout(function () {
      intro.style.display = 'none';
      body.classList.remove('locked');
      body.classList.add('opened');
      invite.removeAttribute('aria-hidden');
      window.scrollTo(0, 0);
      initReveal();
    }, 3250);
  }
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  // ===== Reveal on scroll =====
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // ===== Countdown =====
  var elD = document.getElementById('cdDays');
  var elH = document.getElementById('cdHours');
  var elM = document.getElementById('cdMins');
  var elS = document.getElementById('cdSecs');
  var elGrid = document.getElementById('countdown');
  var elDone = document.getElementById('cdDone');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var diff = WEDDING - Date.now();
    if (diff <= 0) {
      elGrid.hidden = true;
      elDone.hidden = false;
      return false;
    }
    var s = Math.floor(diff / 1000);
    elD.textContent = Math.floor(s / 86400);
    elH.textContent = pad(Math.floor((s % 86400) / 3600));
    elM.textContent = pad(Math.floor((s % 3600) / 60));
    elS.textContent = pad(s % 60);
    return true;
  }
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }
})();
