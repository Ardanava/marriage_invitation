/* =========================================================
   WEDDING INVITATION – app.js
   ========================================================= */

/* ─── 1. PARSE URL PARAMETER (nama tamu) ─── */
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  // Mendukung: ?name=Ahmad&to=Ahmad&tamu=Ahmad
  const raw = params.get('name') || params.get('to') || params.get('tamu') || '';
  return raw.trim() ? decodeURIComponent(raw.replace(/\+/g, ' ')) : 'Tamu Undangan';
}

const guestName = getGuestName();

/* ─── GOOGLE APPS SCRIPT URL ─── */
// GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_JM4zSNa4FLNE6iFMpYDKp4X-nndFoumfY-AaZsGlYKTdQipG1NBIutDAGLCbHicL/exec';


/* ─── 2. LOADING SCREEN ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  // Set guest name sebelum loading selesai
  const guestEl = document.getElementById('guest-name-display');
  if (guestEl) {
    guestEl.textContent = guestName;
    // Animasi typing jika nama spesifik
    if (guestName !== 'Tamu Undangan') {
      typeText(guestEl, guestName);
    }
  }

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 800);
  }, 2000);
});

/* Efek typing text */
function typeText(el, text, delay = 80) {
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, delay);
    }
  }
  setTimeout(type, 600);
}

/* ─── 3. BUKA UNDANGAN ─── */
const openBtn = document.getElementById('open-invitation-btn');
const coverSection = document.getElementById('cover-section');
const mainContent = document.getElementById('main-content');

let isOpened = false;

openBtn?.addEventListener('click', () => {
  if (isOpened) return;
  isOpened = true;

  // Animasi GSAP pada tombol
  gsap.to(openBtn, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      // Slide out cover
      coverSection.classList.add('slide-out');
      // Show main content
      mainContent.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Fade in main content
      gsap.fromTo(mainContent,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            document.body.style.overflow = '';
            // Init semua fitur setelah konten tampil
            initAll();
          }
        }
      );
    }
  });
});

/* ─── 4. INIT ALL FEATURES ─── */
function initAll() {
  initAOS();
  initCountdown();
  initTiltGallery();   // new 3D tilt gallery
  initParticles();
  initGSAPHero();
  initAudioPlayer();
  scrollTopOnOpen();
  fetchWishes();       // Load data dari Google Sheets
}

/* ─── 5. AOS – Animate on Scroll ─── */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });
}

/* ─── 6. COUNTDOWN TIMER ─── */
const WEDDING_DATE = new Date('2026-08-15T08:00:00+07:00');

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setCountdown('cd-days', days);
  setCountdown('cd-hours', hours);
  setCountdown('cd-minutes', minutes);
  setCountdown('cd-seconds', seconds);
}

function setCountdown(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const formatted = String(val).padStart(2, '0');
  if (el.textContent !== formatted) {
    el.style.transform = 'translateY(-4px)';
    el.style.opacity = '0.5';
    el.textContent = formatted;
    setTimeout(() => {
      el.style.transform = '';
      el.style.opacity = '';
    }, 200);
  }
}

/* ─── 7. SWIPER GALLERY ─── */
function initSwiper() {
  new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    breakpoints: {
      640: { slidesPerView: 1 },
      900: { slidesPerView: 1 },
    }
  });
}

/* ─── 8. PARTICLES.JS ─── */
const particlesConfig = (color = '#c9a84c', opacity = 0.4, count = 60) => ({
  particles: {
    number: { value: count, density: { enable: true, value_area: 800 } },
    color: { value: color },
    shape: { type: 'circle' },
    opacity: {
      value: opacity,
      random: true,
      anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false }
    },
    size: {
      value: 2.5,
      random: true,
      anim: { enable: true, speed: 1, size_min: 0.3, sync: false }
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'bubble' },
      onclick: { enable: false },
      resize: true
    },
    modes: {
      bubble: { distance: 80, size: 4, duration: 2, opacity: 0.7, speed: 3 }
    }
  },
  retina_detect: true
});

function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  if (document.getElementById('particles-hero')) {
    particlesJS('particles-hero', particlesConfig('#c9a84c', 0.35, 70));
  }
  if (document.getElementById('particles-closing')) {
    particlesJS('particles-closing', particlesConfig('#ffffff', 0.2, 50));
  }
}

/* Cover particles */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-cover')) {
    particlesJS('particles-cover', particlesConfig('#c9a84c', 0.3, 80));
  }
});

/* ─── 9. LIGHTBOX ─── */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.querySelector('.gallery-overlay')?.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img?.src, img?.alt);
    });
  });
}

function openLightbox(src, alt = '') {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (!modal || !img) return;
  img.src = src;
  img.alt = alt;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  gsap.fromTo('#lightbox-img',
    { scale: 0.85, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
  );
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  gsap.to('#lightbox-img', {
    scale: 0.9, opacity: 0, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ─── 10. GSAP HERO ANIMATIONS ─── */
function initGSAPHero() {
  gsap.registerPlugin(ScrollTrigger);

  // Parallax pada hero background
  gsap.to('.hero-bg img', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Hero couple names stagger
  gsap.from('.hero-name', {
    opacity: 0,
    y: 40,
    stagger: 0.3,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5,
  });

  // Floating gold ornament animation
  gsap.to('.and-ornament', {
    y: -6,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: 0.5,
  });
}

/* ─── 11. AUDIO PLAYER ─── */
function initAudioPlayer() {
  const btn = document.getElementById('audio-toggle-btn');
  const audio = document.getElementById('bg-audio');
  const icon = document.getElementById('audio-icon');

  if (!btn || !audio) return;

  // Jika tidak ada sumber audio, sembunyikan tombol
  if (!audio.src && audio.children.length === 0) {
    // Biarkan tetap tampil (user bisa tambah audio sendiri)
    btn.title = 'Tambahkan file audio di bg-audio element';
    return;
  }

  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      icon.classList.remove('playing');
      icon.className = 'fas fa-music';
    } else {
      audio.play().catch(() => { });
      icon.className = 'fas fa-pause playing';
    }
    isPlaying = !isPlaying;
    gsap.from(btn, { scale: 0.8, duration: 0.3, ease: 'back.out(2)' });
  });
}

/* ─── 12. RSVP FORM & GOOGLE SHEETS INTEGRATION ─── */

async function fetchWishes() {
  const list = document.getElementById('wishes-list');
  const loading = document.getElementById('wishes-loading');
  const empty = document.getElementById('wishes-empty');

  if (!list) return;

  try {
    const response = await fetch(SCRIPT_URL + '?action=get');
    const result = await response.json();

    if (loading) loading.remove();

    if (result.status === 'success' && result.data && result.data.length > 0) {
      if (empty) empty.classList.add('hidden');
      result.data.forEach(wish => {
        addWishToDOM(wish.name, wish.attend, wish.message, wish.timestamp);
      });
    } else {
      if (empty) empty.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error fetching wishes:', error);
    if (loading) loading.innerHTML = '<p>Gagal memuat ucapan. Pastikan SCRIPT_URL sudah benar.</p>';
  }
}

async function handleRSVP(e) {
  e.preventDefault();

  const name = document.getElementById('rsvp-name')?.value.trim();
  const attend = document.getElementById('rsvp-attend')?.value;
  const guests = document.getElementById('rsvp-guests')?.value;
  const message = document.getElementById('rsvp-message')?.value.trim();
  const btn = document.getElementById('rsvp-submit-btn');

  if (!name || !attend) {
    showToast('⚠️ Harap isi nama dan status kehadiran.');
    return;
  }

  // Disable form sementara
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Mengirim...</span>';

  // Siapkan data untuk dikirim
  const formData = new FormData();
  formData.append('action', 'post');
  formData.append('name', name);
  formData.append('attend', attend);
  formData.append('guests', guests || '1');
  formData.append('message', message || '');

  try {
    const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
    const result = await response.json();

    if (result.status === 'success') {
      showToast('✅ Terima kasih! Konfirmasi Anda telah kami terima.');
      document.getElementById('rsvp-form').reset();

      // Tambahkan langsung ke UI tanpa perlu reload
      const empty = document.getElementById('wishes-empty');
      if (empty) empty.classList.add('hidden');
      addWishToDOM(name, attend, message, new Date().toLocaleString('id-ID'));
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    showToast('❌ Gagal mengirim. Pastikan Anda sudah mengatur SCRIPT_URL yang valid.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Kirim Konfirmasi</span>';
  }
}

/* Tambah ucapan ke DOM */
function addWishToDOM(name, attend, message, timestamp) {
  const list = document.getElementById('wishes-list');
  if (!list) return;

  const initial = name.charAt(0).toUpperCase();
  const attendLabel = attend === 'hadir'
    ? '<span class="wish-attend hadir">✅ Hadir</span>'
    : attend === 'tidak_hadir'
      ? '<span class="wish-attend tidak">❌ Tidak Hadir</span>'
      : '<span class="wish-attend" style="background:rgba(251,191,36,.15);color:#fbbf24;border:1px solid rgba(251,191,36,.3)">🤔 Belum Pasti</span>';

  const msgHtml = message
    ? `<p>${escapeHtml(message)}</p>`
    : '<p><em style="opacity:.5">Tidak ada pesan</em></p>';

  const timeHtml = timestamp
    ? `<small style="display:block; opacity:0.5; font-size:0.75rem; margin-top:8px;">${escapeHtml(timestamp)}</small>`
    : '';

  const item = document.createElement('div');
  item.className = 'wish-item';
  item.innerHTML = `
    <div class="wish-avatar">${initial}</div>
    <div class="wish-content">
      <strong>${escapeHtml(name)}</strong>
      ${attendLabel}
      ${msgHtml}
      ${timeHtml}
    </div>
  `;

  list.insertBefore(item, list.firstChild);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ─── 13. TOAST NOTIFICATION ─── */
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─── 14. SCROLL TO TOP AFTER OPEN ─── */
function scrollTopOnOpen() {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ─── 15. SMOOTH NAV LINKS ─── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ═══════════════════════════════════════════════════
   16. 3D TILT GALLERY
═══════════════════════════════════════════════════ */
const TILT_PHOTOS = [
  { src: 'assets/foto1.jpg', caption: 'Foto 1 dari 4' },
  { src: 'assets/foto2.jpg', caption: 'Foto 2 dari 4' },
  { src: 'assets/foto3.jpg', caption: 'Foto 3 dari 4' },
  { src: 'assets/foto4.jpg', caption: 'Foto 4 dari 4' },
];

let tiltCurrentIdx = 0;
let tiltIsAnimating = false;

function initTiltGallery() {
  const card = document.getElementById('tilt-card-inner');
  const shine = document.getElementById('tilt-shine');
  if (!card) return;

  /* ── Mouse tilt ── */
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);  // -1 → +1
    const dy = (e.clientY - cy) / (rect.height / 2);

    const rotY = dx * 18;   // max ±18°
    const rotX = -dy * 12;   // max ±12°

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      duration: .25,
      ease: 'power2.out',
      transformPerspective: 1200,
    });

    /* Shine follows cursor */
    const shineX = 50 + dx * 30;
    const shineY = 50 + dy * 30;
    shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%,
      rgba(255,255,255,.22) 0%, transparent 55%)`;
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: .6,
      ease: 'elastic.out(1, .5)',
    });
    shine.style.background =
      'radial-gradient(circle at 30% 25%, rgba(255,255,255,.16) 0%, transparent 55%)';
  });

  /* ── Touch tilt (mobile) ── */
  let touchStartX = 0;
  card.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  card.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) tiltNav(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') tiltNav(1);
    if (e.key === 'ArrowLeft') tiltNav(-1);
  });
}

/* ── Switch photo ── */
function setTiltPhoto(idx, thumbEl) {
  if (tiltIsAnimating || idx === tiltCurrentIdx) return;
  tiltIsAnimating = true;
  tiltCurrentIdx = idx;

  const img = document.getElementById('tilt-main-img');
  const caption = document.getElementById('tilt-caption')?.querySelector('span');
  const inner = document.getElementById('tilt-card-inner');

  /* Crossfade */
  gsap.to(img, {
    opacity: 0,
    scale: 1.06,
    duration: .3,
    ease: 'power2.in',
    onComplete: () => {
      img.src = TILT_PHOTOS[idx].src;
      if (caption) caption.textContent = TILT_PHOTOS[idx].caption;
      gsap.fromTo(img,
        { opacity: 0, scale: .96 },
        {
          opacity: 1, scale: 1, duration: .45, ease: 'power2.out',
          onComplete: () => { tiltIsAnimating = false; }
        }
      );
    }
  });

  /* Card flip hint */
  gsap.fromTo(inner,
    { rotateY: idx > tiltCurrentIdx - 1 ? -12 : 12 },
    { rotateY: 0, duration: .6, ease: 'elastic.out(1, .55)' }
  );

  /* Update thumbnails */
  document.querySelectorAll('.tilt-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

/* ── Arrow navigation ── */
function tiltNav(dir) {
  const next = (tiltCurrentIdx + dir + TILT_PHOTOS.length) % TILT_PHOTOS.length;
  setTiltPhoto(next, null);
}
