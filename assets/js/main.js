'use strict';

/* ── Fonte de dados ── */
const FARO_DEMO = {
  mes:        'Outubro',
  ano:        '2026',
  mesAnterior:'Setembro',

  receita:  5200.00,
  despesas: 2992.00,
  saldo:    2208.00,

  categorias: [
    { nome: 'Casa',        valor: 1200.00 },
    { nome: 'Alimentação', valor:  722.00 },
    { nome: 'Delivery',    valor:  385.00 },
    { nome: 'Transporte',  valor:  290.00 },
    { nome: 'Assinaturas', valor:  215.00 },
    { nome: 'Lazer',       valor:  180.00 },
  ],

  set_despesas: 2786.00,
  set_categorias: [
    { nome: 'Casa',        valor: 1200.00 },
    { nome: 'Alimentação', valor:  652.00 },
    { nome: 'Delivery',    valor:  301.00 },
    { nome: 'Transporte',  valor:  260.00 },
    { nome: 'Assinaturas', valor:  208.00 },
    { nome: 'Lazer',       valor:  165.00 },
  ],

  movimentacoes: [
    { desc:'Almoço',   cat:'Alimentação', valor:-42.00,   hora:'12h40', data:'10/10' },
    { desc:'Netflix',  cat:'Assinaturas', valor:-44.90,   hora:'12h15', data:'10/10' },
    { desc:'Uber',     cat:'Transporte',  valor:-18.90,   hora:'10h30', data:'10/10' },
    { desc:'Mercado',  cat:'Alimentação', valor:-127.50,  hora:'09h00', data:'09/10' },
    { desc:'iFood',    cat:'Delivery',    valor:-68.00,   hora:'20h15', data:'08/10' },
    { desc:'Spotify',  cat:'Assinaturas', valor:-21.90,   hora:'08h00', data:'08/10' },
    { desc:'Salário',  cat:'Receita',     valor:+5200.00, hora:'08h00', data:'01/10' },
  ],

  hero: {
    despesasBefore: 2350.00,
    despesasAfter:  2392.00,
    barras: [
      { nome:'Alimentação', pctBefore:29, pctAfter:30, valorBefore:680,  valorAfter:722  },
      { nome:'Transporte',  pctBefore:12, pctAfter:12, valorBefore:290,  valorAfter:290  },
      { nome:'Casa',        pctBefore:51, pctAfter:51, valorBefore:1200, valorAfter:1200 },
      { nome:'Lazer',       pctBefore: 8, pctAfter: 8, valorBefore:180,  valorAfter:180  },
    ],
  },

  recorrentes:   { reducaoMes: 150, economiaAnual: 1800 },
  transporteMes: 290.00,
};

/* ── Helpers ── */
function fmt(n) {
  return 'R$ ' + Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(n) {
  return Math.abs(n).toLocaleString('pt-BR');
}

/* ── Reveal on scroll ── */
function initReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ── Header sticky ── */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Menu mobile ── */
function initMobileMenu() {
  const btn  = document.querySelector('.header__menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const navLinks = menu.querySelectorAll('a');

  function isOpen() {
    return btn.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    menu.classList.add('is-open');
    menu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', () => { if (isOpen()) close(); else open(); });

  navLinks.forEach(link => link.addEventListener('click', () => { if (isOpen()) close(); }));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && isOpen()) close();
  });
}

/* ── Hero demo animation ── */
function initHeroDemo() {
  const demo = document.getElementById('hero-demo');
  if (!demo) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Popula valores do hero a partir de FARO_DEMO */
  function populateHeroData() {
    const h = FARO_DEMO.hero;

    /* Totais */
    demo.querySelectorAll('.amount--before').forEach(el => { el.textContent = fmt(h.despesasBefore); });
    demo.querySelectorAll('.amount--after').forEach(el  => { el.textContent = fmt(h.despesasAfter);  });

    /* Barras */
    demo.querySelectorAll('.bar-row__fill').forEach((fill, i) => {
      const b = h.barras[i];
      if (!b) return;
      fill.dataset.widthBefore = b.pctBefore + '%';
      fill.dataset.widthAfter  = b.pctAfter  + '%';
    });

    /* Rótulos e valores das barras */
    demo.querySelectorAll('.bar-row').forEach((row, i) => {
      const b = h.barras[i];
      if (!b) return;
      const labelEl = row.querySelector('.bar-row__label');
      const valueEl = row.querySelector('.bar-row__value');
      if (labelEl) labelEl.textContent = b.nome;
      if (valueEl) valueEl.textContent = fmt(b.valorAfter);
    });

    /* Movimentação nova (move-item--new) */
    const newItem = demo.querySelector('.move-item--new');
    if (newItem) {
      const m = FARO_DEMO.movimentacoes[0];
      const descEl   = newItem.querySelector('.move-item__desc');
      const catEl    = newItem.querySelector('.move-item__cat');
      const amountEl = newItem.querySelector('.move-item__amount');
      if (descEl)   descEl.textContent   = m.desc;
      if (catEl)    catEl.textContent    = m.cat;
      if (amountEl) amountEl.textContent = '−' + fmt(m.valor);
    }
  }

  populateHeroData();

  const STEPS = [
    'hero__demo--step-0',
    'hero__demo--step-1',
    'hero__demo--step-2',
    'hero__demo--step-3',
    'hero__demo--step-4',
  ];

  function setStep(n) {
    STEPS.forEach(s => demo.classList.remove(s));
    demo.classList.add(STEPS[n]);
  }

  function updateBars(toAfter) {
    demo.querySelectorAll('.bar-row__fill').forEach(el => {
      el.style.width = toAfter
        ? el.dataset.widthAfter
        : el.dataset.widthBefore;
    });
  }

  function updateAmount(toAfter) {
    const before = demo.querySelector('.amount--before');
    const after  = demo.querySelector('.amount--after');
    if (before) before.hidden = toAfter;
    if (after)  after.hidden  = !toAfter;
  }

  if (reducedMotion) {
    setStep(4);
    updateBars(true);
    updateAmount(true);
    return;
  }

  let timerId = null;
  let active  = false;

  function schedule(fn, delay) {
    timerId = setTimeout(() => { if (active) fn(); }, delay);
  }

  function cancel() {
    if (timerId) { clearTimeout(timerId); timerId = null; }
  }

  function runLoop() {
    setStep(0);
    updateBars(false);
    updateAmount(false);

    schedule(() => {
      setStep(1);
      schedule(() => {
        setStep(2);
        schedule(() => {
          setStep(3);
          schedule(() => {
            setStep(4);
            updateBars(true);
            updateAmount(true);
            schedule(runLoop, 3000);
          }, 1000);
        }, 1200);
      }, 800);
    }, 600);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !active) {
          active = true;
          runLoop();
        } else if (!entry.isIntersecting && active) {
          active = false;
          cancel();
        }
      });
    },
    { threshold: 0.3 }
  );

  setStep(0);
  updateBars(false);
  updateAmount(false);
  observer.observe(demo);
}

/* ── Carrossel (Seção 6) ── */
function initCarrossel() {
  const carrossel = document.querySelector('.carrossel');
  if (!carrossel) return;

  const track  = carrossel.querySelector('.carrossel__track');
  const slides = Array.from(carrossel.querySelectorAll('.carrossel__slide'));
  const dots   = Array.from(carrossel.querySelectorAll('.carrossel__dot'));
  const btnPrev = carrossel.querySelector('.carrossel__prev');
  const btnNext = carrossel.querySelector('.carrossel__next');

  if (!track || slides.length === 0) return;

  let current = 0;

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    if (btnPrev) btnPrev.disabled = false;
    if (btnNext) btnNext.disabled = false;
  }

  if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  /* Swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });

  /* Teclado */
  carrossel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  /* Reduced motion: sem autoplay */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    setInterval(() => goTo(current + 1), 5000);
  }

  goTo(0);
}

/* ── Contadores animados (Seção 8) ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    counters.forEach(el => { el.textContent = el.dataset.counter; });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const el     = entry.target;
        const target = parseFloat(el.dataset.counter.replace(/\D/g, ''));
        const prefix = el.dataset.counterPrefix || '';
        const suffix = el.dataset.counterSuffix || '';
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = prefix + value.toLocaleString('pt-BR') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── Tabs ── */
function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    const tabs   = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

    function activate(tab, shouldFocus = true) {
      tabs.forEach((t, i) => {
        const isActive = t === tab;
        t.setAttribute('aria-selected', isActive);
        t.setAttribute('tabindex', isActive ? '0' : '-1');
        const panel = panels[i];
        if (!panel) return;
        if (isActive) {
          panel.removeAttribute('hidden');
        } else {
          panel.hidden = true;
        }
      });
      if (shouldFocus) tab.focus();
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', e => {
        const idx = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') { e.preventDefault(); activate(tabs[(idx + 1) % tabs.length]); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); activate(tabs[(idx - 1 + tabs.length) % tabs.length]); }
        if (e.key === 'Home')       { e.preventDefault(); activate(tabs[0]); }
        if (e.key === 'End')        { e.preventDefault(); activate(tabs[tabs.length - 1]); }
      });
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeaderScroll();
  initMobileMenu();
  initHeroDemo();
  initCounters();
  initTabs();
});
