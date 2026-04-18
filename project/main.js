// SobiranIA — main interactions
(function(){
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  // ---- Mobile nav drawer ----
  const burger = $('#navBurger');
  const drawer = $('#navDrawer');
  const backdrop = $('#navDrawerBackdrop');
  if (burger && drawer) {
    const toggle = (force) => {
      const open = force != null ? force : !drawer.classList.contains('open');
      drawer.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    if (backdrop) backdrop.addEventListener('click', () => toggle(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }

  // ---- Tweaks panel availability + activation ----
  const tweaks = $('#tweaks');
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') tweaks.classList.add('open');
    if (d.type === '__deactivate_edit_mode') tweaks.classList.remove('open');
  });
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}

  // Apply defaults
  const defaults = (window.TWEAK_DEFAULS || {});
  let state = { ...{theme:'light', accent:'brass', lang:'ca'}, ...defaults };

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    state.theme = t;
    persist();
  }
  function applyAccent(a){
    const map = {
      brass: { light:'#8b6f3f', dark:'#c9a961', l2:'#c4a876', d2:'#e0c98a' },
      indigo: { light:'#4338ca', dark:'#818cf8', l2:'#6366f1', d2:'#a5b4fc' },
      emerald: { light:'#047857', dark:'#34d399', l2:'#10b981', d2:'#6ee7b7' }
    };
    const c = map[a] || map.brass;
    const root = document.documentElement;
    root.style.setProperty('--brass', state.theme === 'dark' ? c.dark : c.light);
    root.style.setProperty('--brass-2', state.theme === 'dark' ? c.d2 : c.l2);
    root.style.setProperty('--accent', state.theme === 'dark' ? c.dark : c.light);
    state.accent = a;
    persist();
  }
  function persist(){
    try {
      window.parent.postMessage({type:'__edit_mode_set_keys', edits: state}, '*');
    } catch(e){}
  }

  // Tweaks wire
  $$('.tweaks .seg').forEach(seg => {
    const key = seg.dataset.tweak;
    seg.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const v = b.dataset.val;
      if (key === 'theme') { applyTheme(v); applyAccent(state.accent); }
      else if (key === 'accent') applyAccent(v);
      else if (key === 'lang') setLang(v);
    });
  });

  // Set initial tweak visuals
  function setSeg(key, val){
    const seg = document.querySelector(`.tweaks .seg[data-tweak="${key}"]`);
    if (!seg) return;
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.val === val));
  }

  // ---- i18n ----
  function setLang(l) {
    state.lang = l;
    const dict = (window.I18N || {})[l] || {};
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    // lang switch in nav
    $$('#langSwitch button, #langSwitchMobile button').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    setSeg('lang', l);
    persist();
    // rerun demo typewriter
    startTyper();
  }

  $$('#langSwitch button, #langSwitchMobile button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => io.observe(el));

  // ---- Count up ----
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.n);
      const dur = 1600;
      const t0 = performance.now();
      function tick(t){
        const p = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        const v = target * ease;
        el.textContent = Number.isInteger(target) ? Math.round(v) : v.toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  $$('.count[data-n]').forEach(el => countIO.observe(el));

  // ---- Demo chat behavior ----
  const demoItems = $$('#demoChat li');
  const demoUser = $('#demoUser');
  const demoTitle = $('#demoTitle');
  const typer = $('#typer');
  const srcList = $('#srcList');

  const demoMap = {
    ca: {
      contracte: {
        title: "Assistent · Civil",
        user: "Revisa aquest contracte d'arrendament i extreu les clàusules abusives segons la LAU.",
        answer: "He identificat <strong>3 clàusules potencialment abusives</strong> al contracte:<br/><br/>§1. Clàusula 7.2 — Renúncia genèrica a la tàcita reconducció (contrària a LAU art. 10).<br/>§2. Clàusula 12 — Repercussió d'IBI sense justificació proporcional (STS 2487/2023).<br/>§3. Clàusula 15.1 — Penalització desistiment 6 mensualitats (excedeix límit LAU art. 11).",
        src: ["LAU art. 27", "STS 2487/2023", "Contracte_ARR_2025.pdf"]
      },
      jurisprudencia: {
        title: "Assistent · Laboral",
        user: "Jurisprudència rellevant sobre acomiadament objectiu 2024 i càrrega de la prova.",
        answer: "He consultat la base jurisprudencial interna. <strong>7 sentències rellevants</strong> del darrer any:<br/><br/>§1. STS 345/2024 — Insuficiència de causa econòmica al·legada.<br/>§2. STSJ Cat. 1287/2024 — Càrrega probatòria recau en l'empresari.<br/>§3. STS 891/2024 — Nul·litat per defecte de forma en carta d'acomiadament.",
        src: ["STS 345/2024", "STSJ Cat. 1287", "ET art. 52"]
      },
      fiscal: {
        title: "Assistent · Fiscal",
        user: "Resum de la declaració trimestral del client ACME S.L. i incidències pendents.",
        answer: "<strong>ACME S.L. · Q4 2025</strong><br/>IVA meritat: 48.230 €<br/>IVA suportat: 31.410 €<br/><strong>A ingressar: 16.820 €</strong><br/><br/>⚠ 2 factures amb NIF incorrecte detectades<br/>⚠ Data límit presentació: 30 gener",
        src: ["Model 303", "Factures_Q4.zip", "Fitxa_ACME.pdf"]
      },
      redaccio: {
        title: "Assistent · Civil",
        user: "Redacta un escrit d'al·legacions en un procediment ordinari basat en el model civil del despatx.",
        answer: "He generat un esborrany basat en el teu <strong>model base civil</strong> (v.2.4), adaptat al procediment ordinari:<br/><br/>· Encapçalament amb dades del client<br/>· 6 al·legacions estructurades<br/>· Fonaments de dret amb cites<br/>· Petitum i otrosíes<br/><br/>Llest per revisar.",
        src: ["Model_Civil_v2.4", "LEC art. 405", "Plantilla despatx"]
      }
    },
    es: {
      contracte: {
        title: "Asistente · Civil",
        user: "Revisa este contrato de arrendamiento y extrae las cláusulas abusivas según la LAU.",
        answer: "He identificado <strong>3 cláusulas potencialmente abusivas</strong> en el contrato:<br/><br/>§1. Cláusula 7.2 — Renuncia genérica a la tácita reconducción (contraria a LAU art. 10).<br/>§2. Cláusula 12 — Repercusión de IBI sin justificación proporcional (STS 2487/2023).<br/>§3. Cláusula 15.1 — Penalización desistimiento 6 mensualidades (excede límite LAU art. 11).",
        src: ["LAU art. 27", "STS 2487/2023", "Contrato_ARR_2025.pdf"]
      },
      jurisprudencia: {
        title: "Asistente · Laboral",
        user: "Jurisprudencia relevante sobre despido objetivo 2024 y carga de la prueba.",
        answer: "He consultado la base jurisprudencial interna. <strong>7 sentencias relevantes</strong> del último año:<br/><br/>§1. STS 345/2024 — Insuficiencia de causa económica alegada.<br/>§2. STSJ Cat. 1287/2024 — Carga probatoria recae en el empresario.<br/>§3. STS 891/2024 — Nulidad por defecto de forma en carta de despido.",
        src: ["STS 345/2024", "STSJ Cat. 1287", "ET art. 52"]
      },
      fiscal: {
        title: "Asistente · Fiscal",
        user: "Resumen de la declaración trimestral del cliente ACME S.L. e incidencias pendientes.",
        answer: "<strong>ACME S.L. · Q4 2025</strong><br/>IVA devengado: 48.230 €<br/>IVA soportado: 31.410 €<br/><strong>A ingresar: 16.820 €</strong><br/><br/>⚠ 2 facturas con NIF incorrecto detectadas<br/>⚠ Fecha límite presentación: 30 enero",
        src: ["Modelo 303", "Facturas_Q4.zip", "Ficha_ACME.pdf"]
      },
      redaccio: {
        title: "Asistente · Civil",
        user: "Redacta un escrito de alegaciones en un procedimiento ordinario basado en el modelo civil del despacho.",
        answer: "He generado un borrador basado en tu <strong>modelo base civil</strong> (v.2.4), adaptado al procedimiento ordinario:<br/><br/>· Encabezado con datos del cliente<br/>· 6 alegaciones estructuradas<br/>· Fundamentos de derecho con citas<br/>· Petitum y otrosíes<br/><br/>Listo para revisar.",
        src: ["Modelo_Civil_v2.4", "LEC art. 405", "Plantilla despacho"]
      }
    }
  };

  let currentQ = 'contracte';
  let typerTimer = null;

  function startTyper(){
    if (typerTimer) { clearInterval(typerTimer); typerTimer = null; }
    const data = demoMap[state.lang][currentQ];
    demoTitle.textContent = data.title;
    demoUser.textContent = data.user;
    srcList.style.display = 'none';
    srcList.innerHTML = '';

    const text = data.answer;
    typer.innerHTML = '';
    let i = 0;
    // progressive reveal using character index + HTML detection
    typerTimer = setInterval(() => {
      i += Math.max(1, Math.round(text.length / 300));
      if (i >= text.length) {
        typer.innerHTML = text;
        clearInterval(typerTimer);
        typerTimer = null;
        // show sources
        srcList.innerHTML = data.src.map((s, idx) =>
          `<span class="src-chip"><span class="sup">§${idx+1}</span> ${s}</span>`
        ).join('');
        srcList.style.display = 'flex';
        return;
      }
      typer.innerHTML = text.slice(0, i);
    }, 28);
  }

  demoItems.forEach(li => {
    li.addEventListener('click', () => {
      demoItems.forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      currentQ = li.dataset.q;
      startTyper();
    });
  });

  // ---- ROI calculator ----
  const roiP = $('#roiP'), roiR = $('#roiR'), roiH = $('#roiH');
  const roiPV1 = $('#roiPV1'), roiRV = $('#roiRV'), roiHV = $('#roiHV');
  const roiHours = $('#roiHours'), roiMoney = $('#roiMoney'), roiPay = $('#roiPay');
  const roiSav = $('#roiSav'), roiPayback = $('#roiPayback');

  function fmt(n){ return n.toLocaleString('ca-ES'); }
  function fmtK(n){
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return Math.round(n/1000) + 'K';
    return Math.round(n);
  }
  // investment estimate: 12k + 1500 per prof, amortized over 24 months
  function updateRoi(){
    const p = +roiP.value, r = +roiR.value, h = +roiH.value;
    roiPV1.textContent = p;
    roiRV.textContent = r;
    roiHV.textContent = h;

    const weeks = 46; // working weeks/year
    const hoursYear = p * h * weeks;
    const savingsYear = hoursYear * r;
    const savingsMonth = savingsYear / 12;

    const investment = 12000 + p * 1500;
    const payback = investment / savingsMonth; // months
    const roiMult = savingsYear / investment;

    roiHours.textContent = fmt(Math.round(hoursYear));
    roiMoney.textContent = fmtK(savingsYear);
    roiPay.textContent = roiMult.toFixed(1);
    roiSav.textContent = fmt(Math.round(savingsMonth));
    roiPayback.textContent = payback < 1 ? '< 1 m' : payback.toFixed(1) + ' m';

    const hw = document.getElementById('roiHoursWeek');
    if (hw) hw.textContent = h + 'h';
  }
  [roiP, roiR, roiH].forEach(el => el.addEventListener('input', updateRoi));
  updateRoi();

  // ---- Init ----
  applyTheme(state.theme);
  applyAccent(state.accent);
  setSeg('theme', state.theme);
  setSeg('accent', state.accent);
  setSeg('lang', state.lang);
  if (state.lang !== 'ca') setLang(state.lang);
  else startTyper();

})();
