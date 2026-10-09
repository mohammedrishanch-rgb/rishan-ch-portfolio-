/* ==========================================================================
   MOHAMMED RISHAN C.H. - PORTFOLIO INTERACTIVE LOGIC (VIBRANT & AESTHETIC REVISION)
   Features: Particle Canvas Backdrop, Intersection Scroll Reveal, 3D Card Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Floating Neon Particle Background Canvas --- */
  const canvas = document.getElementById('bg-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 60);

    const colors = ['rgba(0, 242, 254, ', 'rgba(127, 0, 255, ', 'rgba(255, 0, 127, '];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.5 + 0.2;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.baseAlpha + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.colorPrefix + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* --- 2. Sticky Navbar & Scrollspy --- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --- 3. Scroll Reveal Observer --- */
  const revealElements = document.querySelectorAll('.glass-card, .section-header, .hero-content, .hero-visual');
  revealElements.forEach(el => el.classList.add('reveal-up'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --- 4. Mobile Navigation Toggle --- */
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  mobileNavToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('mobile-open');
    const icon = mobileNavToggle.querySelector('i');
    if (navLinksContainer.classList.contains('mobile-open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('mobile-open');
      const icon = mobileNavToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  /* --- 5. Dark / Light Theme Toggle --- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('rishan-portfolio-theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('rishan-portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'light') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#ffb703';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '';
    }
  }

  /* --- 6. Skill Category Filter & Bar Animation --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Animate skill progress bars when visible
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-progress-fill');
        if (fillBar) {
          const targetWidth = fillBar.getAttribute('style').match(/width:\s*(\d+%)/);
          if (targetWidth) {
            fillBar.style.width = targetWidth[1];
          }
        }
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillObserver.observe(card));

  /* --- 7. Project Details Modal --- */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBodyContent = document.getElementById('modal-body-content');
  const projectDetailBtns = document.querySelectorAll('.btn-detail');

  const projectData = {
    'iot-system': {
      title: 'Smart IoT Home Automation System',
      badge: '🥇 State Level 1st Rank Winner',
      image: 'assets/smart-iot.png',
      description: 'An award-winning hardware engineering project developed by Mohammed Rishan C.H. that won First Rank in the State Electronics Competition. The system integrates microcontrollers, multi-sensor environmental telemetry, relays, and a custom wireless command interface.',
      features: [
        'Real-time temperature, gas, and flame sensor telemetry',
        'C++ firmware with optimized memory efficiency',
        'Wireless relay control for high-voltage home appliances',
        'OLED display dashboard mounted on custom breadboard enclosure'
      ],
      tags: ['Arduino C++', 'IoT', 'Hardware Electronics', 'Sensors', 'Relay Control']
    },
    'web-dashboard': {
      title: 'Next-Gen Developer Web Application',
      badge: 'Web Development',
      image: 'assets/web-app.png',
      description: 'A sleek modern dark glassmorphism dashboard created with pure Vanilla HTML5, CSS3 Custom Properties, and ES6 JavaScript. Designed for high visual impact and smooth responsive scaling.',
      features: [
        'Custom glassmorphism UI token system with dark/light themes',
        'Interactive data charts and animated keyframe counters',
        'Zero framework dependencies for ultra-fast rendering',
        '100% Mobile Responsive across all device sizes'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Glassmorphism', 'Responsive']
    },
    'brand-kit': {
      title: 'Creative Brand Identity & UI Kit',
      badge: 'Graphic Design & UI/UX',
      image: 'assets/graphic-design.png',
      description: 'A comprehensive branding visual identity and UI component set. Features modern typography scales, vibrant color palettes, 3D isometric mockup compositions, and vector graphics.',
      features: [
        'Custom vector logos and brand mark concepts',
        'Mobile application UI/UX screens designed in Figma',
        'Social media banner designs and high-res print posters',
        'Cohesive color token palette definition'
      ],
      tags: ['Figma', 'Graphic Design', 'Branding', 'Photoshop', 'UI/UX']
    }
  };

  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (data) {
        modalBodyContent.innerHTML = `
          <div style="display: inline-block; padding: 0.35rem 0.9rem; border-radius: var(--radius-pill); background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan); font-size: 0.85rem; font-weight: 800; margin-bottom: 1rem; box-shadow: 0 0 15px rgba(0, 242, 254, 0.2);">
            ${data.badge}
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.9rem; margin-bottom: 1rem; font-weight: 800;">${data.title}</h2>
          <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 270px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-glow);">
          <p style="color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 1.5rem; line-height: 1.6;">${data.description}</p>
          
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.75rem; color: var(--text-primary); font-weight: 700;">Key Highlights & Features:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.5rem;">
            ${data.features.map(f => `<li style="display: flex; align-items: center; gap: 0.65rem; color: var(--text-secondary); font-size: 0.95rem;"><i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i> ${f}</li>`).join('')}
          </ul>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
            ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="#contact" class="btn btn-primary" onclick="closeModal()"><i class="fa-solid fa-comments"></i> Inquire About Project</a>
          </div>
        `;

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  window.closeModal = function() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) closeModal();
  });

  /* --- 8. Click to Copy Email --- */
  const copyEmailCard = document.getElementById('copy-email');
  if (copyEmailCard) {
    copyEmailCard.addEventListener('click', () => {
      const email = 'mohammedrishanch@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Direct Email: mohammedrishanch@gmail.com');
      });
    });
  }

  /* --- 9. Contact Form Handling & Toast Notification --- */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const category = document.getElementById('subject').value;

      showToast(`Thank you ${name}! Your inquiry regarding "${category}" has been sent.`);
      contactForm.reset();
    });
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
