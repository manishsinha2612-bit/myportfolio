/* ==============================================================
   PRELOADER
   A tiny browser mockup builds itself from skeleton blocks into a
   designed UI — nav, hero, copy, button — then a cursor clicks the
   button and a "shipped" badge pops before it dissolves into the
   real site. Click anywhere on it to skip straight to the finish.
   ============================================================== */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wordEl = document.getElementById('loaderWord');
  const nav = document.getElementById('mNav');
  const hero = document.getElementById('mHero');
  const line1 = document.getElementById('mLine1');
  const line2 = document.getElementById('mLine2');
  const btn = document.getElementById('mBtn');
  const ripple = document.getElementById('mRipple');
  const cursor = document.getElementById('mockCursor');
  const badge = document.getElementById('mockBadge');
  let finished = false;

  function setWord(text) {
    wordEl.style.opacity = '0';
    setTimeout(() => {
      wordEl.textContent = text;
      wordEl.style.opacity = '1';
    }, 120);
  }

  function fill(el) {
    el.classList.remove('skeleton');
    el.classList.add('filled');
  }

  function finishLoading() {
    if (finished) return;
    finished = true;
    document.body.classList.remove('is-loading');
    preloader.classList.add('loader-exit');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 900);
  }

  // Build sequence: [delay ms, action] — tuned to run ~2.2s minimum
  const steps = [
    [150, () => setWord('Wireframing the layout')],
    [350, () => fill(nav)],
    [650, () => { setWord('Designing the hero'); fill(hero); }],
    [1000, () => { setWord('Writing the copy'); fill(line1); }],
    [1150, () => fill(line2)],
    [1350, () => { setWord('Styling the button'); fill(btn); }],
    [1500, () => cursor.classList.add('to-btn')],
    [1850, () => {
      cursor.classList.add('click');
      ripple.classList.add('go');
      setWord('Shipping it');
    }],
    [2000, () => badge.classList.add('show')],
    [2300, finishLoading]
  ];

  if (reduceMotion) {
    [nav, hero, line1, line2, btn].forEach(fill);
    setWord('Ready');
    setTimeout(finishLoading, 400);
  } else {
    const timers = steps.map(([delay, action]) => setTimeout(action, delay));
    // Let impatient visitors skip straight to the site
    preloader.addEventListener('click', () => {
      timers.forEach(clearTimeout);
      finishLoading();
    });
  }
})();

// Navbar scroll blur
const navbar = document.getElementById('navbar');
const navWrap = document.querySelector('.navbar-wrap');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
let mobileMenuOpen = false;

const setMenuState = (isOpen) => {
  mobileMenuOpen = isOpen;
  navLinks.classList.toggle('open', isOpen);
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Toggle menu');
};

menuToggle.addEventListener('click', () => {
  setMenuState(!mobileMenuOpen);
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuState(false)));

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    setMenuState(false);
  }
});

// Scroll spy for active nav link
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(sec => spyObserver.observe(sec));

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Cursor glow (desktop only)
const glow = document.getElementById('cursor-glow');
if (window.matchMedia('(min-width:1025px)').matches) {
  document.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
}

// Magnetic buttons (desktop only)
if (window.matchMedia('(min-width:1025px)').matches) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

// Button ripple
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// Resume button downloads the CV directly
document.getElementById('resumeBtn').addEventListener('click', () => {
  const isLocalServer = window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1';
  const resumePath = isLocalServer
    ? '/portfolio/public/assets/UI_UX_Resume_Manish_Kumar_Sinha.pdf'
    : '/public/assets/UI_UX_Resume_Manish_Kumar_Sinha.pdf';
  const downloadLink = document.createElement('a');
  downloadLink.href = resumePath;
  downloadLink.download = 'UI_UX_Resume_Manish_Kumar_Sinha.pdf';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
});

// Contact form submit — POST to FormSubmit AJAX endpoint
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  data.set('_replyto', data.get('email'));
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  fetch('https://formsubmit.co/ajax/manishsinha2612@gmail.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  }).then(async response => {
    const json = await response.json();
    if (!response.ok || (json.success !== 'true' && json.success !== true)) {
      throw new Error(json.message || 'Form submission failed');
    }
    return json;
  }).then(() => {
    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
    form.reset();
  }).catch(err => {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    alert(err.message || 'There was an error submitting the form. Please try again later.');
    console.error(err);
  });
});

// Case study dropdown toggle for Inkriti project
(function () {
  const toggleBtn = document.getElementById('inkriti-case-study-btn');
  const dropdown = document.getElementById('inkriti-dropdown');
  if (!toggleBtn || !dropdown) return;

  // Toggle dropdown visibility
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.classList.contains('show')) return;
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove('show');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      toggleBtn.focus();
    }
  });
})();