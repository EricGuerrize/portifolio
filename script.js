/* ── Smooth scroll (Disabled for Snap) ──────────────── */
/* 
const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);
*/

// anchor links → native smooth
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    mobileNav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

/* ── Cursor ──────────────────────────────────────────── */
const cursor    = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

let cx = 0, cy = 0;
let rx = 0, ry = 0;

if (cursor) {
  window.addEventListener('pointermove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
  });

  function lerpRing() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    cursorRing.style.left = `${rx}px`;
    cursorRing.style.top  = `${ry}px`;
    requestAnimationFrame(lerpRing);
  }
  lerpRing();

  const hoverables = 'a, button, .project-item, .btn, .skill-row';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ── Hero word-split reveal ──────────────────────────── */
function splitWords(el, baseDelay = 0) {
  const nodes = [...el.childNodes];
  el.innerHTML = '';
  let idx = 0;

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(chunk => {
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(' '));
        } else if (chunk) {
          const wrap  = document.createElement('span');
          const inner = document.createElement('span');
          wrap.className  = 'word-wrap';
          inner.className = 'word-inner';
          inner.textContent = chunk;
          wrap.style.transitionDelay = `${baseDelay + idx * 38}ms`;
          wrap.appendChild(inner);
          el.appendChild(wrap);
          idx++;
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const wrap  = document.createElement('span');
      const inner = document.createElement('span');
      wrap.className  = 'word-wrap';
      inner.className = 'word-inner';
      inner.appendChild(node.cloneNode(true));
      wrap.style.transitionDelay = `${baseDelay + idx * 38}ms`;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      el.appendChild(document.createTextNode(' '));
      idx++;
    }
  });
}

const heroTitle = document.getElementById('hero-title');
if (heroTitle) {
  splitWords(heroTitle, 300);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroTitle.querySelectorAll('.word-wrap').forEach(w => w.classList.add('visible'));
    });
  });
}

/* ── Scroll reveal ───────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 60}ms`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── Counter animation ───────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const suffix = el.dataset.suffix ?? '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const prefix = el.dataset.prefix ?? '';
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ── Project image follow cursor ─────────────────────── */
const imgFollow = document.querySelector('.project-img-follow');
const imgFollowEl = imgFollow?.querySelector('img');
let mx = 0, my = 0, fx = 0, fy = 0;

if (imgFollow) {
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function followLoop() {
    fx += (mx - fx) * 0.08;
    fy += (my - fy) * 0.08;
    imgFollow.style.left = `${fx + 28}px`;
    imgFollow.style.top  = `${fy - 115}px`;
    requestAnimationFrame(followLoop);
  }
  followLoop();

  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const src = item.dataset.img;
      if (src && imgFollowEl) {
        imgFollowEl.src = src;
        imgFollow.classList.add('active');
      }
    });
    item.addEventListener('mouseleave', () => {
      imgFollow.classList.remove('active');
    });
  });
}

/* ── Magnetic buttons ────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  const strength = 0.35;

  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── Mobile menu ─────────────────────────────────────── */
const menuButton = document.querySelector('.menu-button');
const mobileNav  = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
/* ── Form Submission ─────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      description: formData.get('description'),
      date: new Date().toISOString()
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Mock Firebase saving logic - User should replace with their config
    console.log('Dados recebidos:', data);
    
    setTimeout(() => {
      submitBtn.textContent = 'Enviado com sucesso!';
      contactForm.reset();
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 3000);
    }, 1500);

    /* 
    Para salvar no Firebase, descomente e configure:
    
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
    import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

    const firebaseConfig = { ... };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
      await addDoc(collection(db, "leads"), data);
    } catch (err) {
      console.error(err);
    }
    */
  });
}
