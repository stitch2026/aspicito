/* ============================================================
   Aspicito — Premium Interactions
   Canvas particles · Magnetic elements · 3D tilt · Word-split reveal
   Testimonial carousel · Draggable marquee · Portfolio filters
   Counters · Preloader · Active section nav · Parallax
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ──────────────────────────────────────────────
     Preloader — staggered character rise
  ────────────────────────────────────────────── */
  var preloader = document.getElementById('preloader') || document.querySelector('.preloader');
  var preChars  = preloader ? preloader.querySelectorAll('.pre-word span') : [];

  preChars.forEach(function (s, i) { s.style.setProperty('--i', i); });

  function killPreloader() {
    if (!preloader) return;
    preloader.classList.add('done');
    setTimeout(function () {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 700);
  }

  if (preloader) {
    window.addEventListener('load', function () { setTimeout(killPreloader, 1200); });
    setTimeout(killPreloader, 2800);
  }

  /* ──────────────────────────────────────────────
     Header — scroll state, progress bar, hide/show
  ────────────────────────────────────────────── */
  var header   = document.querySelector('.header');
  var progress = document.querySelector('.scroll-progress');
  var toTop    = document.querySelector('.to-top');
  var lastY    = 0;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) {
      header.classList.toggle('scrolled', y > 12);
      if (y > 500 && y > lastY) header.classList.add('hide');
      else header.classList.remove('hide');
    }
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('show', y > 700);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
     Mobile nav
  ────────────────────────────────────────────── */
  var burger   = document.querySelector('.burger');
  var navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ──────────────────────────────────────────────
     Custom cursor
  ────────────────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    var dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(ringLoop);
    })();

    var hoverSel = 'a, button, .card, .work, .filter-btn, .acc-head, input, textarea, select, .testi, .feature, .hl-item, .sv-card, .vertical-card, .client-logo, .sticker';
    document.querySelectorAll(hoverSel).forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
    document.addEventListener('mouseleave', function () { dot.style.opacity = ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = ring.style.opacity = '1'; });
  }

  /* ──────────────────────────────────────────────
     Magnetic elements
  ────────────────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width  / 2);
        var y = e.clientY - (r.top  + r.height / 2);
        el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.transform  = '';
        setTimeout(function () { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ──────────────────────────────────────────────
     3D tilt on cards
  ────────────────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = 7;
      el.addEventListener('mousemove', function (e) {
        var r  = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top)  / r.height;
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max) + 'deg) rotateY(' + ((px - 0.5) * max) + 'deg) translateY(-6px)';
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform  = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ──────────────────────────────────────────────
     Word-split hero title reveal
  ────────────────────────────────────────────── */
  function splitHeroTitle() {
    var title = document.querySelector('[data-split]');
    if (!title || reduceMotion) {
      if (title) { title.style.opacity = 1; }
      return;
    }

    var rawHTML = title.innerHTML;
    var lines   = rawHTML.split(/<br\s*\/?>/i);
    var delay   = 0;

    title.innerHTML = lines.map(function (line, li) {
      var parts = line.trim().split(/(\s+)/);
      return parts.map(function (part) {
        if (/^\s+$/.test(part)) return part;
        var wrapped = '<span class="word-wrap"><span class="word" style="transition-delay:' + delay.toFixed(2) + 's">' + part + '</span></span>';
        delay += 0.055;
        return wrapped;
      }).join('');
    }).join('<br />');
  }
  splitHeroTitle();

  /* ──────────────────────────────────────────────
     Scroll reveal — generic + split lines
  ────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-lines, .step');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ──────────────────────────────────────────────
     Animated counters
  ────────────────────────────────────────────── */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el     = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var dur    = 1800;
        var start  = performance.now();
        function tick(now) {
          var p     = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val   = target * eased;
          el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ──────────────────────────────────────────────
     Hero canvas — particle network
  ────────────────────────────────────────────── */
  function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -999, y: -999 };
    var COUNT = 55;
    var raf;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        o: Math.random() * 0.35 + 0.08
      });
    }

    window.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var len = particles.length;

      for (var i = 0; i < len; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;

        /* gentle mouse repulsion */
        var dx = mouse.x - p.x, dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.025;
          p.y -= dy * 0.025;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,16,46,' + p.o + ')';
        ctx.fill();

        /* connect nearby particles */
        for (var j = i + 1; j < len; j++) {
          var q  = particles[j];
          var dx2 = p.x - q.x, dy2 = p.y - q.y;
          var d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(12,27,58,' + (0.09 * (1 - d2 / 120)) + ')';
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    /* Pause canvas when not visible (performance) */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { draw(); }
    });
  }
  initHeroCanvas();

  /* ──────────────────────────────────────────────
     Draggable marquees
  ────────────────────────────────────────────── */
  document.querySelectorAll('.marquee').forEach(function (m) {
    var track = m.querySelector('.marquee-track');
    if (!track) return;
    var down = false, startX = 0, base = 0, drag = 0;
    m.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; base = drag;
      track.style.animationPlayState = 'paused';
      m.setPointerCapture(e.pointerId);
    });
    m.addEventListener('pointermove', function (e) {
      if (!down) return;
      drag = base + (e.clientX - startX);
      track.style.transform = 'translateX(' + drag + 'px)';
    });
    m.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      track.style.transition = 'transform .55s cubic-bezier(0.22,1,0.36,1)';
      track.style.transform  = '';
      drag = 0;
      setTimeout(function () {
        track.style.transition = '';
        track.style.animationPlayState = '';
      }, 550);
    });
  });

  /* ──────────────────────────────────────────────
     Portfolio filters
  ────────────────────────────────────────────── */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var works = document.querySelectorAll('.works-grid .work');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      works.forEach(function (w) {
        var cats = (w.getAttribute('data-cat') || '').split(' ');
        var show = (f === 'all') || (cats.indexOf(f) !== -1);
        w.classList.toggle('hide', !show);
        if (!show) {
          w.style.transition = 'opacity .3s ease, transform .3s ease';
          w.style.opacity    = '0';
          w.style.transform  = 'scale(.96)';
          setTimeout(function () { w.classList.add('hide'); }, 280);
        } else {
          w.classList.remove('hide');
          requestAnimationFrame(function () {
            w.style.opacity   = '1';
            w.style.transform = '';
          });
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     Accordion
  ────────────────────────────────────────────── */
  document.querySelectorAll('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item  = head.closest('.acc-item');
      var body  = item.querySelector('.acc-body');
      var isOpen = item.classList.contains('open');
      var acc   = item.closest('.accordion');
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

  /* ──────────────────────────────────────────────
     Testimonial carousel
  ────────────────────────────────────────────── */
  function initTestiCarousel() {
    var track = document.getElementById('testiTrack');
    if (!track) return;
    var dots  = document.querySelectorAll('.testi-dot');
    var prev  = document.querySelector('.testi-prev');
    var next  = document.querySelector('.testi-next');
    var items = track.querySelectorAll('.testi');
    var total = items.length;
    var cur   = 0;
    var autoTimer;
    var isDragging = false, dragStartX = 0, dragScrollLeft = 0;

    function go(i) {
      cur = ((i % total) + total) % total;
      var itemW = items[cur].offsetWidth + 24;
      track.scrollTo({ left: cur * itemW, behavior: 'smooth' });
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === cur); });
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { go(cur + 1); }, 5200);
    }

    if (prev) prev.addEventListener('click', function () { go(cur - 1); startAuto(); });
    if (next) next.addEventListener('click', function () { go(cur + 1); startAuto(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-i'))); startAuto(); });
    });

    /* Touch/drag swipe on carousel */
    track.addEventListener('pointerdown', function (e) {
      isDragging    = true;
      dragStartX    = e.clientX;
      dragScrollLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      track.scrollLeft = dragScrollLeft - (e.clientX - dragStartX);
    });
    track.addEventListener('pointerup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var delta = dragStartX - e.clientX;
      if (Math.abs(delta) > 60) { go(delta > 0 ? cur + 1 : cur - 1); startAuto(); }
    });

    startAuto();
  }
  initTestiCarousel();

  /* ──────────────────────────────────────────────
     Contact form (front-end only)
  ────────────────────────────────────────────── */
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var name   = ((form.querySelector('[name="name"]') || {}).value || '').trim();
      if (status) {
        status.textContent = 'Thank you' + (name ? ', ' + name : '') + '! Your message is ready — we\u2019ll reach out at the earliest.';
        status.classList.add('ok');
      }
      form.reset();
    });
  }

  /* ──────────────────────────────────────────────
     Footer year
  ────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ──────────────────────────────────────────────
     Hero parallax — blobs & stickers on pointermove
  ────────────────────────────────────────────── */
  var parallaxEls = document.querySelectorAll('.blob, [data-parallax]');
  if (parallaxEls.length && finePointer && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      var x = (e.clientX / window.innerWidth  - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      parallaxEls.forEach(function (b, i) {
        var f = parseFloat(b.getAttribute('data-parallax')) || (i + 1) * 10;
        b.style.transform = 'translate(' + (x * f) + 'px,' + (y * f) + 'px)';
      });
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     Sticker parallax (independent, faster)
  ────────────────────────────────────────────── */
  var stickers = document.querySelectorAll('.sticker');
  if (stickers.length && finePointer && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      var x = (e.clientX / window.innerWidth  - 0.5);
      var y = (e.clientY / window.innerHeight - 0.5);
      stickers.forEach(function (s, i) {
        var f = (i % 2 === 0 ? 18 : -14);
        s.style.transform = 'translate(' + (x * f) + 'px,' + (y * f * 0.6) + 'px) rotate(-2deg)';
      });
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     Active section detection → nav highlight
  ────────────────────────────────────────────── */
  (function () {
    var sections = document.querySelectorAll('section[id]');
    var navAs    = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    if (!sections.length || !navAs.length) return;

    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        navAs.forEach(function (a) {
          var href  = a.getAttribute('href') || '';
          var match = href.includes('#' + id) || (id === 'hero' && (href === 'index.html' || href === './'));
          a.classList.toggle('section-active', match);
        });
      });
    }, { threshold: 0.3 });

    sections.forEach(function (s) { sio.observe(s); });
  })();

  /* ──────────────────────────────────────────────
     Smooth hover-lift for client logos
  ────────────────────────────────────────────── */
  document.querySelectorAll('.client-logo').forEach(function (el, i) {
    el.addEventListener('mouseenter', function () {
      el.style.transform = 'translateY(-4px)';
      el.style.opacity   = '1';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
      el.style.opacity   = '';
    });
  });

  /* ──────────────────────────────────────────────
     Card spotlight glow on mousemove
  ────────────────────────────────────────────── */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      var py = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', px + '%');
      card.style.setProperty('--my', py + '%');
    });
  });

  /* ──────────────────────────────────────────────
     Split-text reveal (for non-hero elements)
  ────────────────────────────────────────────── */
  document.querySelectorAll('[data-split]:not(.hero-title)').forEach(function (el) {
    if (reduceMotion) { el.style.opacity = 1; return; }
    var html  = el.innerHTML;
    var lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(function (l) {
      return '<span class="line-mask"><span>' + l + '</span></span>';
    }).join('');
    el.classList.add('reveal-lines');
  });

  /* ──────────────────────────────────────────────
     Step dots — intersection-driven
  ────────────────────────────────────────────── */
  var stepEls = document.querySelectorAll('.step');
  if ('IntersectionObserver' in window && stepEls.length) {
    var sio2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); sio2.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    stepEls.forEach(function (el) { sio2.observe(el); });
  }

})();
