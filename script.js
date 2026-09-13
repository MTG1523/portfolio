'use strict';

/* ============================================================
   Sticky header border on scroll
   ============================================================ */
const header = document.getElementById('site-header');

const onScroll = () => {
  if (window.scrollY > 8) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ============================================================
   Mobile navigation toggle
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('is-open', !expanded);
  navToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-label', 'Open navigation');
  });
});

/* ============================================================
   Active nav link tracking via IntersectionObserver
   ============================================================ */
const sections = document.querySelectorAll('main section[id]');
const navItems = {
  about:     document.getElementById('navlink-about'),
  skills:    document.getElementById('navlink-skills'),
  projects:  document.getElementById('navlink-projects'),
  education: document.getElementById('navlink-education'),
  contact:   document.getElementById('navlink-contact'),
};

const setActiveLink = (id) => {
  Object.values(navItems).forEach((el) => el && el.classList.remove('active'));
  if (navItems[id]) navItems[id].classList.add('active');
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ============================================================
   Contact form validation and submission
   ============================================================ */
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-contact');
const successMsg  = document.getElementById('form-success');

const fields = {
  name:    { el: document.getElementById('contact-name'),    error: document.getElementById('error-name')    },
  email:   { el: document.getElementById('contact-email'),   error: document.getElementById('error-email')   },
  message: { el: document.getElementById('contact-message'), error: document.getElementById('error-message') },
};

const validators = {
  name:    (v) => v.trim().length >= 2     ? '' : 'Name must be at least 2 characters.',
  email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
  message: (v) => v.trim().length >= 20   ? '' : 'Message must be at least 20 characters.',
};

const validateField = (name) => {
  const { el, error } = fields[name];
  const message = validators[name](el.value);
  error.textContent = message;
  el.classList.toggle('is-invalid', !!message);
  return !message;
};

// Validate on blur
Object.keys(fields).forEach((name) => {
  fields[name].el.addEventListener('blur', () => validateField(name));
  fields[name].el.addEventListener('input', () => {
    if (fields[name].el.classList.contains('is-invalid')) validateField(name);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const valid = Object.keys(fields).map(validateField).every(Boolean);
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // Simulate a network request (replace with a real fetch() call in production)
  setTimeout(() => {
    form.reset();
    Object.values(fields).forEach(({ el }) => el.classList.remove('is-invalid'));
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    successMsg.hidden = false;
    successMsg.focus();
  }, 900);
});
