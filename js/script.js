'use strict';

/* ============================================================
   HEADER — scroll shadow + active nav link
   ============================================================ */
const header   = document.getElementById('header');
const navLinks = document.querySelectorAll('.header__nav a');

const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Highlight nav link based on scroll position
const sections = document.querySelectorAll('main section[id]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => io.observe(s));


/* ============================================================
   MOBILE NAV
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close on link click
mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    mainNav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// Poznámka: plynulý scroll na kotvy (#sekce) i odsazení pod fixní
// hlavičku řeší prohlížeč nativně přes CSS (scroll-behavior: smooth
// a scroll-margin-top). Standardní #kotvy v URL tak zůstávají zachovány.


/* ============================================================
   BOOKING MODAL
   ============================================================ */
const bookingModal   = document.getElementById('booking-modal');
const openBtns       = document.querySelectorAll('[data-open-modal]');
const closeTriggers  = document.querySelectorAll('[data-close-modal]');

function openModal() {
  bookingModal.classList.add('is-open');
  bookingModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus first option for accessibility
  const first = bookingModal.querySelector('.modal__option');
  if (first) requestAnimationFrame(() => first.focus());
}

function closeModal() {
  bookingModal.classList.remove('is-open');
  bookingModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openBtns.forEach(b => b.addEventListener('click', openModal));
closeTriggers.forEach(el => el.addEventListener('click', closeModal));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeLightbox();
  }
});


/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbClose   = document.getElementById('lb-close');
const lbOverlay = document.getElementById('lb-overlay');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

const allItems     = Array.from(document.querySelectorAll('.gallery__item'));
const lbCounter    = document.getElementById('lb-counter');
let currentIndex   = 0;

// Aktuálně viditelné položky (dle filtru) — jen v nich lightbox naviguje
function visibleItems() {
  return allItems.filter(el => !el.hidden);
}

function renderLightbox() {
  const items = visibleItems();
  const item  = items[currentIndex];
  if (!item) return;
  lbImg.src = item.dataset.src;
  lbImg.alt = item.dataset.alt || '';
  if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${items.length}`;
}

function openLightbox(item) {
  const items = visibleItems();
  currentIndex = items.indexOf(item);
  if (currentIndex < 0) currentIndex = 0;
  renderLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lbImg.src = '';
}

function showPrev() {
  const items = visibleItems();
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  renderLightbox();
}

function showNext() {
  const items = visibleItems();
  currentIndex = (currentIndex + 1) % items.length;
  renderLightbox();
}

allItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

/* ---- Filtry galerie ---- */
const galleryFilters = document.querySelectorAll('.gallery-filter');
galleryFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    galleryFilters.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active);
    });
    allItems.forEach(item => {
      item.hidden = !(filter === 'all' || item.dataset.category === filter);
    });
  });
});

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Touch/swipe support for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
}, { passive: true });


/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer   = btn.nextElementSibling;

    // Close all others
    document.querySelectorAll('.faq-item__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.hidden = true;
    });

    // Toggle current
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObs.observe(el));


/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
