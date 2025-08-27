const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (navLinks) {
      navLinks.style.display = expanded ? 'none' : 'block';
    }
  });
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Smooth scrolling for internal links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      if (navLinks && window.getComputedStyle(navLinks).position === 'absolute') {
        navLinks.style.display = 'none';
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Reveal on scroll
const revealables = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Also mark stagger groups and kv lists inside as visible
      entry.target.querySelectorAll('[data-stagger]').forEach((el) => el.classList.add('is-visible'));
      entry.target.querySelectorAll('.kv').forEach((el) => el.classList.add('is-visible'));
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealables.forEach((el) => io.observe(el));

// Animated number counters
function animateNumber(element) {
  const targetAttr = element.getAttribute('data-count-to');
  if (!targetAttr) return;
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const target = parseFloat(targetAttr);
  const isFloat = targetAttr.includes('.');
  const duration = 1200;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const value = isFloat ? (target * eased).toFixed(1) : Math.round(target * eased);
    element.textContent = `${prefix}${value}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      numberObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat .num[data-count-to]').forEach((el) => numberObserver.observe(el));

// Experience show more/less
function setupToggles() {
  document.querySelectorAll('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = btn.parentElement && btn.parentElement.querySelector('ul.bullets');
      if (!list) return;
      const hidden = list.querySelector('.is-hidden');
      const collapsed = list.hasAttribute('data-collapsed');
      if (collapsed) {
        list.removeAttribute('data-collapsed');
        list.querySelectorAll('.is-hidden').forEach((li) => li.style.display = 'list-item');
        btn.textContent = 'Show less';
      } else {
        list.setAttribute('data-collapsed', '');
        list.querySelectorAll('.is-hidden').forEach((li) => li.style.display = '');
        btn.textContent = 'Show more';
      }
    });
  });
}

setupToggles(); 