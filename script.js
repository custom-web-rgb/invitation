/* ═══════════════════════════════════════════════════════
   LUXURY WEDDING — script.js
   Arjun & Priya | 21 February 2026
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroReveal();
    }, 1800);
  });

  document.body.style.overflow = 'hidden';
})();

/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  let mx = -100, my = -100;
  let gx = -100, gy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animateGlow);
  })();

  // Grow on hoverable elements
  const hoverTargets = 'a, button, .gallery-item, .event-card, .timeline-card-inner, .hero-btn, .form-submit, .location-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      glow.style.width  = '80px';
      glow.style.height = '80px';
      glow.style.opacity = '0.8';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      glow.style.width  = '40px';
      glow.style.height = '40px';
      glow.style.opacity = '1';
    }
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    glow.style.display = 'none';
    dot.style.display  = 'none';
    document.body.style.cursor = 'auto';
  }
})();

/* ─────────────────────────────────────────
   3. PARTICLE CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 2 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const progress = this.life / this.maxLife;
      const a = this.alpha * Math.sin(Math.PI * progress);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────────────────
   4. NAVIGATION
───────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('mainNav');
  const hamburger = document.getElementById('navHamburger');
  const overlay   = document.querySelector('.nav-mobile-overlay');

  // Scroll state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Hide scroll indicator
    const si = document.getElementById('scrollIndicator');
    if (si) si.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });

  // Mobile menu
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => overlay.classList.add('open'));

    const closeBtn = overlay.querySelector('.nav-mobile-close');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => overlay.classList.remove('open'));
    });
  }
})();

/* ─────────────────────────────────────────
   5. SMOOTH SCROLL
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   6. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────
   7. HERO REVEAL (after loader)
───────────────────────────────────────── */
function initHeroReveal() {
  // Trigger hero bg zoom
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.classList.add('loaded');

  // Stagger hero content animations
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 180);
  });
}

/* ─────────────────────────────────────────
   8. PARALLAX
───────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');

  function onScroll() {
    const sy = window.scrollY;
    if (heroBg && sy < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${sy * 0.25}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   9. MOUSE PARALLAX (Hero light leaks)
───────────────────────────────────────── */
(function initMouseParallax() {
  const leaks = document.querySelectorAll('.light-leak');
  if (!leaks.length) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    leaks.forEach((el, i) => {
      const depth = (i + 1) * 8;
      el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  });
})();

/* ─────────────────────────────────────────
   10. COUNTDOWN TIMER
───────────────────────────────────────── */
(function initCountdown() {
  const weddingDate = new Date('2026-02-21T10:30:00+05:30').getTime();

  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');
  if (!dEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function animateFlip(el, newVal) {
    if (el.textContent === newVal) return;
    el.style.transform = 'translateY(-8px)';
    el.style.opacity   = '0';
    setTimeout(() => {
      el.textContent   = newVal;
      el.style.transition = 'none';
      el.style.transform  = 'translateY(8px)';
      el.style.opacity    = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'all 0.35s ease';
          el.style.transform  = 'translateY(0)';
          el.style.opacity    = '1';
        });
      });
    }, 180);
  }

  function update() {
    const now  = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      [dEl, hEl, mEl, sEl].forEach(el => { el.textContent = '00'; });
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    animateFlip(dEl, pad(d));
    animateFlip(hEl, pad(h));
    animateFlip(mEl, pad(m));
    animateFlip(sEl, pad(s));
  }

  update();
  setInterval(update, 1000);
})();

/* ─────────────────────────────────────────
   11. GALLERY LIGHTBOX
───────────────────────────────────────── */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightboxImg');
  const lbCaption   = document.getElementById('lightboxCaption');
  const lbClose     = document.getElementById('lightboxClose');
  const lbPrev      = document.getElementById('lightboxPrev');
  const lbNext      = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!lightbox || !galleryItems.length) return;

  const images = [
    { bg: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85', caption: 'A Love Eternal' },
    { bg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85', caption: 'First Dance' },
    { bg: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=85', caption: 'Together Always' },
    { bg: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=85', caption: 'Our Beginning' },
    { bg: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=85', caption: 'Moments of Joy' },
    { bg: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85', caption: 'Forever & Always' },
  ];

  let current = 0;

  function open(idx) {
    current = idx;
    show();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show() {
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.style.backgroundImage = `url('${images[current].bg}')`;
      lbCaption.textContent = images[current].caption;
      lbImg.style.opacity = '1';
    }, 200);
  }

  function prev() { current = (current - 1 + images.length) % images.length; show(); }
  function next() { current = (current + 1) % images.length; show(); }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  });
})();

/* ─────────────────────────────────────────
   12. RSVP FORM
───────────────────────────────────────── */
(function initRSVP() {
  const form    = document.getElementById('rsvpForm');
  const wrap    = document.getElementById('rsvpFormWrap');
  const success = document.getElementById('rsvpSuccess');
  const nameOut = document.getElementById('successName');
  const btn     = document.getElementById('rsvpSubmit');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = document.getElementById('guestName');
    const email = document.getElementById('guestEmail');

    // Basic validation
    let valid = true;
    [name, email].forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderBottomColor = '#c0392b';
        valid = false;
      } else {
        inp.style.borderBottomColor = '';
      }
    });
    if (!valid) return;

    // Button loading state
    btn.disabled = true;
    btn.querySelector('.submit-text').textContent = 'Sending…';
    btn.querySelector('.submit-icon').textContent = '✦';

    setTimeout(() => {
      // Swap form → success
      if (nameOut) nameOut.textContent = name.value.trim();
      wrap.style.opacity = '0';
      wrap.style.transform = 'translateY(-20px)';
      wrap.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        wrap.style.display = 'none';
        success.classList.add('show');
        launchConfetti();
      }, 500);
    }, 1400);
  });

  // Live underline focus effect
  document.querySelectorAll('.form-input').forEach(inp => {
    inp.addEventListener('focus', () => {
      inp.style.borderBottomColor = 'var(--gold)';
    });
    inp.addEventListener('blur', () => {
      if (!inp.value.trim()) {
        inp.style.borderBottomColor = '';
      }
    });
  });
})();

/* ─────────────────────────────────────────
   13. CONFETTI (RSVP success)
───────────────────────────────────────── */
function launchConfetti() {
  const container = document.getElementById('successConfetti');
  if (!container) return;

  const colors = ['#c8a96e', '#e8d5a3', '#f0d5c8', '#fdf8f2', '#d4a090'];
  const count  = 60;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 8 + 4;
    dot.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      opacity: 0;
      animation: confettiFall ${1.5 + Math.random() * 2}s ease forwards ${Math.random() * 0.8}s;
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
    `;
    container.appendChild(dot);
  }

  // Inject keyframes once
  if (!document.getElementById('confettiStyles')) {
    const style = document.createElement('style');
    style.id = 'confettiStyles';
    style.textContent = `
      @keyframes confettiFall {
        0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
        100% { opacity: 0; transform: translateY(${window.innerHeight * 0.4}px) rotate(720deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────
   14. SECTION COUNTER ANIMATION
   (Numbers count up when in view)
───────────────────────────────────────── */
(function initCounters() {
  // Animate countdown numbers on first reveal
  const cdSection = document.querySelector('.countdown');
  if (!cdSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cdSection.querySelectorAll('.countdown-num').forEach(el => {
        el.style.textShadow = '0 0 60px rgba(200,169,110,0.6)';
        setTimeout(() => {
          el.style.textShadow = '0 0 40px rgba(200,169,110,0.4)';
        }, 1000);
      });
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(cdSection);
})();

/* ─────────────────────────────────────────
   15. HERO NAME LETTER SPLIT ANIMATION
───────────────────────────────────────── */
(function initNameSplit() {
  const nameEls = document.querySelectorAll('.name-a, .name-b');
  nameEls.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.display = 'inline-block';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease ${0.3 + i * 0.06}s, transform 0.6s ease ${0.3 + i * 0.06}s;
      `;
      el.appendChild(span);
    });
  });

  // Triggered after loader
  window._revealNames = function() {
    document.querySelectorAll('.name-a span, .name-b span').forEach(span => {
      span.style.opacity   = '1';
      span.style.transform = 'translateY(0)';
    });
  };
})();

/* ─────────────────────────────────────────
   16. MOBILE NAV OVERLAY BUILD
   (Inject overlay if not in HTML)
───────────────────────────────────────── */
(function buildMobileNav() {
  if (document.querySelector('.nav-mobile-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav-mobile-overlay';
  overlay.innerHTML = `
    <button class="nav-mobile-close" aria-label="Close menu">✕</button>
    <a href="#story">Our Story</a>
    <a href="#events">Events</a>
    <a href="#gallery">Gallery</a>
    <a href="#rsvp">RSVP</a>
    <a href="#location">Location</a>
  `;
  document.body.appendChild(overlay);

  const hamburger = document.getElementById('navHamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => overlay.classList.add('open'));
  }
  overlay.querySelector('.nav-mobile-close').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => overlay.classList.remove('open')));
})();

/* ─────────────────────────────────────────
   17. EVENT CARDS TILT EFFECT (desktop)
───────────────────────────────────────── */
(function initTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.event-card, .timeline-card-inner').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const rx     = ((e.clientY - cy) / (rect.height / 2)) * 4;
      const ry     = ((e.clientX - cx) / (rect.width  / 2)) * -4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────
   18. SCROLL PROGRESS BAR
───────────────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(to right, var(--gold-dark), var(--gold), var(--gold-light));
    z-index: 99998;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   19. LAZY IMAGE FADE-IN
───────────────────────────────────────── */
(function initLazyImages() {
  const bgEls = document.querySelectorAll('.timeline-img, .gallery-img');
  if (!bgEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  bgEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transition = 'opacity 0.8s ease';
    observer.observe(el);
  });
})();

/* ─────────────────────────────────────────
   20. FINAL INIT — tie name reveal to loader
───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    if (window._revealNames) window._revealNames();
  }, 2200);
});

/* ─────────────────────────────────────────
   21. RESIZE DEBOUNCE
───────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate anything layout-dependent here if needed
  }, 250);
});


startCountdown();



