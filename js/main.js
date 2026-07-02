/* Aspicito — interactions */
(function () {
  'use strict';

  /* ---- Header scroll state + progress bar ---- */
  const header = document.querySelector('.header');
  const progress = document.querySelector('.scroll-progress');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 12);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      const open = document.body.classList.contains('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1500;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Accordion ---- */
  document.querySelectorAll('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      const item = head.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');
      // close siblings within same accordion
      const acc = item.closest('.accordion');
      acc.querySelectorAll('.acc-item.open').forEach(function (o) {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.acc-body').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = null;
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc-item.open .acc-body').forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  });

  /* ---- Contact form (front-end only) ---- */
  const form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const name = form.querySelector('[name="name"]').value.trim();
      if (status) {
        status.textContent = 'Thank you' + (name ? ', ' + name : '') + '! Your message is ready — we\u2019ll reach out at the earliest.';
        status.classList.add('ok');
      }
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Subtle hero parallax ---- */
  const blobs = document.querySelectorAll('.blob');
  if (blobs.length && window.matchMedia('(min-width: 760px)').matches) {
    window.addEventListener('pointermove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach(function (b, i) {
        const f = (i + 1) * 14;
        b.style.transform = 'translate(' + (x * f) + 'px,' + (y * f) + 'px)';
      });
    }, { passive: true });
  }
})();
