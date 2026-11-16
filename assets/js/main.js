/* Secure Privacy — interações */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Configuração do formulário
     Para receber os contatos, crie um endpoint (ex.: Formspree,
     Getform ou seu próprio backend) e cole a URL abaixo.
     ------------------------------------------------------------ */
  const FORM_ENDPOINT = ""; // ex.: "https://formspree.io/f/xxxxxxx"

  /* ---------- Ano no rodapé ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- NAV: fundo ao rolar + menu mobile ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    links.classList.remove("is-open");
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };
  toggle.addEventListener("click", () => {
    const open = !links.classList.contains("is-open");
    links.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  $$("a", links).forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Link ativo conforme a seção ---------- */
  const sections = $$("main section[id]");
  const navMap = new Map($$(".nav__links a[href^='#']").map(a => [a.getAttribute("href").slice(1), a]));
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navMap.forEach(a => a.classList.remove("is-active"));
      const a = navMap.get(en.target.id);
      if (a && !a.classList.contains("btn")) a.classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => secObs.observe(s));

  /* ---------- Reveal ao rolar ---------- */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      // pequeno escalonamento entre irmãos
      const sibs = $$(":scope > .reveal", el.parentElement);
      const i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
      el.classList.add("is-in");
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => revObs.observe(el));

  /* ---------- HERO: lanterna que revela o que o adversário vê ---------- */
  const field = $("#heroField");
  const hero = $(".hero");
  if (field && hero) {
    let tx = 70, ty = 40, cx = 70, cy = 40;
    let lastMove = 0, raf = null, t0 = performance.now();

    hero.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      lastMove = performance.now();
    });

    const tick = now => {
      // Sem movimento recente (ou em celular): a lanterna percorre o campo sozinha
      if (now - lastMove > 2500) {
        const t = (now - t0) / 1000;
        tx = 50 + Math.sin(t * 0.35) * 36;
        ty = 50 + Math.sin(t * 0.52 + 1.3) * 32;
      }
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      field.style.setProperty("--mx", cx.toFixed(2) + "%");
      field.style.setProperty("--my", cy.toFixed(2) + "%");
      raf = requestAnimationFrame(tick);
    };

    if (!reduced) {
      // só anima quando o hero está visível
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !raf) raf = requestAnimationFrame(tick);
        else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      }).observe(hero);
    }
  }

  /* ---------- Console: registro de operação ---------- */
  const consoleEl = $("#consoleBody");
  const LOG = [
    ["t", "[00:00] escopo validado · RoE assinado pela diretoria"],
    ["ok", "[recon] 37 ativos externos mapeados"],
    ["", "[recon] 212 colaboradores com presença pública"],
    ["warn", "[osint] 9 credenciais corporativas em vazamentos antigos"],
    ["", "[social] campanha de phishing direcionado · lote 1"],
    ["warn", "[social] 14% de interação em 48h"],
    ["", "[físico] leitor RFID modelo legado · acesso B"],
    ["crit", "[!] achado crítico comunicado ao contratante"],
    ["", "[lateral] caminho até ativo crítico identificado"],
    ["ok", "[defesa] tempo até detecção: registrado"],
    ["ok", "[report] evidências criptografadas · cadeia de custódia ok"],
    ["t", "[fim] plano de remediação priorizado entregue"]
  ];

  if (consoleEl) {
    const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const render = (lines, partial) => {
      const html = lines.map(([c, s]) => `<span class="${c}">${esc(s)}</span>`).join("\n");
      consoleEl.innerHTML = html + (partial !== undefined ? (lines.length ? "\n" : "") + esc(partial) : "") + '<span class="cur"></span>';
      consoleEl.scrollTop = consoleEl.scrollHeight;
    };

    if (reduced) {
      render(LOG);
    } else {
      let done = [], li = 0, ci = 0;
      const MAX = 11;
      const step = () => {
        if (li >= LOG.length) {
          setTimeout(() => { done = []; li = 0; ci = 0; step(); }, 4200);
          return;
        }
        const [cls, text] = LOG[li];
        if (ci <= text.length) {
          render(done, text.slice(0, ci));
          ci += 2;
          setTimeout(step, 16 + Math.random() * 22);
        } else {
          done.push([cls, text]);
          if (done.length > MAX) done.shift();
          li++; ci = 0;
          render(done);
          setTimeout(step, cls === "crit" ? 1400 : 520 + Math.random() * 500);
        }
      };
      setTimeout(step, 900);
    }
  }

  /* ---------- Cards: brilho que segue o cursor ---------- */
  $$(".card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--cx", `${e.clientX - r.left}px`);
      card.style.setProperty("--cy", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Abas: situações da Pessoa Sombra ---------- */
  const SIT = [
    "Negociações com possibilidade de pressão, intimidação ou abuso de poder.",
    "Eventos, seminários, viagens e agendas com visibilidade. Lugares onde muitos olham e poucos percebem.",
    "Encontros que antecedem ou envolvem conflito judicial, em que cada detalhe pode ter peso depois.",
    "Períodos em que o cliente precisa de estabilidade e não pode se dar ao luxo de perder a atenção."
  ];
  const tabs = $$(".tabs [role='tab']");
  const sitText = $("#sitText");
  const selectTab = btn => {
    tabs.forEach(b => { b.setAttribute("aria-selected", "false"); b.tabIndex = -1; });
    btn.setAttribute("aria-selected", "true"); btn.tabIndex = 0;
    sitText.style.opacity = 0;
    setTimeout(() => { sitText.textContent = SIT[+btn.dataset.i]; sitText.style.opacity = 1; }, reduced ? 0 : 160);
  };
  tabs.forEach((btn, i) => {
    btn.tabIndex = i === 0 ? 0 : -1;
    btn.addEventListener("click", () => selectTab(btn));
    btn.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); selectTab(n);
    });
  });

  /* ---------- Red Team: cadeia que acende ao rolar ---------- */
  const chain = $("#chain");
  const fill = $("#chainFill");
  if (chain && fill) {
    const steps = $$(".chain__step", chain);
    const update = () => {
      const r = chain.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      fill.style.width = (p * 100) + "%";
      chain.style.setProperty("--fill", (p * 100) + "%");
      fill.style.setProperty("height", window.innerWidth <= 860 ? (p * 100) + "%" : "");
      steps.forEach((s, i) => s.classList.toggle("is-lit", p >= (i / steps.length) + 0.02));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Botões que já pré-selecionam o serviço ---------- */
  const serviceMap = { sombra: "Pessoa Sombra", redteam: "Red Team" };
  $$("[data-service]").forEach(btn => {
    btn.addEventListener("click", () => {
      const v = serviceMap[btn.dataset.service];
      const input = $(`.chips input[value="${v}"]`);
      if (input) input.checked = true;
    });
  });

  /* ---------- Formulário ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.classList.remove("is-error");
      let ok = true;
      $$("[required]", form).forEach(inp => {
        const bad = !inp.value.trim();
        inp.closest(".field").classList.toggle("is-invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        status.textContent = "Preencha nome e um meio de contato para continuarmos.";
        status.classList.add("is-error");
        return;
      }

      const btn = $("button[type='submit']", form);
      btn.disabled = true;
      const data = Object.fromEntries(new FormData(form));

      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error("Falha no envio");
        }
        form.reset();
        status.textContent = "Recebido. Entraremos em contato pelo canal escolhido, com total discrição.";
      } catch (err) {
        status.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
        status.classList.add("is-error");
      } finally {
        btn.disabled = false;
      }
    });
    $$("[required]", form).forEach(inp =>
      inp.addEventListener("input", () => inp.closest(".field").classList.remove("is-invalid"))
    );
  }
})();
