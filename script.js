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
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

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
    window.location.href = './public/assets/UI_UX Design_Resume_Updated.pdf';
  });

  // Inkriti Case Study dropdown
  const inkritiBtn = document.getElementById('inkriti-case-study-btn');
  const inkritiDropdown = document.getElementById('inkriti-dropdown');
  
  if (inkritiBtn && inkritiDropdown) {
    inkritiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      inkritiDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!inkritiBtn.contains(e.target) && !inkritiDropdown.contains(e.target)) {
        inkritiDropdown.classList.remove('show');
      }
    });
  }

  // Contact form submit — POST to FormSubmit AJAX endpoint
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = this;
    const data = new FormData(form);
    
    // Add custom subject line
    data.append('_subject', 'New Message from Your Portfolio - ' + data.get('name'));
    
    fetch('https://formsubmit.co/ajax/manishsinha2612@gmail.com', {
      method: 'POST',
      body: data
    }).then(response => response.json())
    .then(json => {
      if (json.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
        form.reset();
      } else {
        alert('Error: ' + (json.message || 'Failed to send message'));
      }
    }).catch(err => {
      alert('There was an error submitting the form. Please try again later.');
      console.error(err);
    });
  });
