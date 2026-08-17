/* ===========================================================
   RENAMS — Portfolio Cyberpunk — Script principal
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Année dynamique dans le footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header : effet au scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Ferme le menu mobile après le clic sur un lien
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Lien de nav actif selon la section visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Curseur néon (desktop uniquement) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (cursorGlow && !isTouch) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ---------- Effet glitch périodique sur le titre du hero ---------- */
  const glitchTitle = document.getElementById('glitchTitle');
  if (glitchTitle) {
    const triggerGlitch = () => {
      glitchTitle.classList.add('glitch');
      setTimeout(() => glitchTitle.classList.remove('glitch'), 600);
    };
    triggerGlitch();
    setInterval(triggerGlitch, 5000);
  }

  /* ---------- Reveal au scroll (fade + translate) ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .skills-grid, .timeline-item, .education-card, .contact-grid'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Barres de compétences animées ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const value = fill.getAttribute('data-fill') || '0';
        requestAnimationFrame(() => { fill.style.width = `${value}%`; });
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ---------- Terminal "à propos" : effet de frappe ---------- */
  const linesToType = [
    'Samuel Georges RENAMY — Développeur & Passionné d\'IA',
    '{ "basé": "Libreville, Gabon", "mode": "apprentissage_continu" }'
  ];
  const typedEls = document.querySelectorAll('.typed-line');
  let terminalStarted = false;

  const typeLine = (el, text, speed = 28) => {
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) {
          setTimeout(tick, speed);
        } else {
          el.classList.add('done');
          resolve();
        }
      };
      tick();
    });
  };

  const runTerminal = async () => {
    for (let i = 0; i < typedEls.length; i++) {
      await typeLine(typedEls[i], linesToType[i] || '');
    }
  };

  const terminal = document.getElementById('terminalBody');
  if (terminal) {
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !terminalStarted) {
          terminalStarted = true;
          runTerminal();
          terminalObserver.unobserve(terminal);
        }
      });
    }, { threshold: 0.4 });
    terminalObserver.observe(terminal);
  }

  /* ---------- Formulaire de contact ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formStatus.textContent = '⚠ Merci de remplir tous les champs.';
        formStatus.classList.add('error');
        return;
      }
      if (!emailPattern.test(email)) {
        formStatus.textContent = '⚠ Adresse email invalide.';
        formStatus.classList.add('error');
        return;
      }

      // Pas de backend connecté : simulation d'envoi.
      // Pour une utilisation réelle, remplacer ce bloc par un appel
      // vers un service (Formspree, EmailJS, backend personnalisé...).
      formStatus.classList.remove('error');
      formStatus.textContent = '⏳ Envoi en cours...';

      setTimeout(() => {
        formStatus.textContent = `✔ Message transmis. Merci ${name}, je reviens vers vous rapidement !`;
        contactForm.reset();
      }, 900);
    });
  }

});
