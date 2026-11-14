// Global Pathways — hero gallery crossfade + place label
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero .slide"));
  var placeEl = document.getElementById("placeName");
  var places = [
    "Toronto, Canadá", "Toronto, Canadá", "Toronto, Canadá",
    "Montréal, Canadá", "Montréal, Canadá", "Montréal, Canadá",
    "Vancouver, Canadá", "Vancouver, Canadá", "Vancouver, Canadá",
    "Banff, Alberta", "Banff, Alberta", "Banff, Alberta"
  ];
  var i = 0;
  if (slides.length > 1) {
    setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      var next = slides[i];
      // retrigger the ken-burns animation
      next.style.animation = "none";
      void next.offsetWidth;
      next.style.animation = "";
      next.classList.add("is-active");
      if (placeEl) placeEl.textContent = places[i] || "";
    }, 5000);
  }

  // canada rotating stage (crossfade photo + city + data)
  (function () {
    var stage = document.getElementById("canadaStage");
    if (!stage) return;
    var layers = Array.prototype.slice.call(stage.querySelectorAll(".cs-layer"));
    var cityEl = document.getElementById("csCity");
    var dataEl = document.getElementById("csData");
    var dots = Array.prototype.slice.call(stage.querySelectorAll(".cs-dot"));
    var cities = [
      { name: "Toronto", data: ["Capital financiera y tecnológica de Canadá", "El mayor mercado laboral del país", "Oportunidades en negocios, tecnología y finanzas"] },
      { name: "Niágara", data: ["Universidad con prácticas pagas (Co-op)", "A una hora de Toronto", "Programas elegibles para el permiso PGWP"] },
      { name: "Vancouver", data: ["Una de las ciudades más habitables del mundo", "Clima templado todo el año", "Fuerte en tecnología, cine y sostenibilidad"] },
      { name: "Montréal", data: ["Educación bilingüe: inglés y francés", "Costo de vida más bajo que otras ciudades", "Ciudad universitaria vibrante y cultural"] }
    ];
    var ci = 0, timer;
    function show(n) {
      ci = (n + layers.length) % layers.length;
      layers.forEach(function (l, k) { l.classList.toggle("is-active", k === ci); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === ci); });
      var c = cities[ci];
      if (cityEl) cityEl.textContent = c.name;
      if (dataEl) dataEl.innerHTML = c.data.map(function (x) { return "<li>" + x + "</li>"; }).join("");
    }
    function start() { timer = setInterval(function () { show(ci + 1); }, 4500); }
    function restart() { clearInterval(timer); start(); }
    dots.forEach(function (d) {
      d.addEventListener("click", function () { show(parseInt(d.getAttribute("data-i"), 10)); restart(); });
    });
    show(0); start();
  })();

  // destinos: city cards rotate photos + tips — SINCRONIZADAS (todas a la vez)
  (function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".city-card")).map(function (card) {
      var tips = [];
      try { tips = JSON.parse(card.getAttribute("data-tips") || "[]"); } catch (e) {}
      return { layers: card.querySelectorAll(".cp-layer"), tipEl: card.querySelector(".tip-text"), tips: tips };
    });
    if (!cards.length) return;
    var i = 0;
    setInterval(function () {
      i++;
      cards.forEach(function (c) {
        if (c.layers.length) c.layers.forEach(function (l, k) { l.classList.toggle("is-active", k === i % c.layers.length); });
        if (c.tipEl && c.tips.length) {
          c.tipEl.style.opacity = 0;
          setTimeout(function () { c.tipEl.textContent = c.tips[i % c.tips.length]; c.tipEl.style.opacity = 1; }, 350);
        }
      });
    }, 4200);
  })();

  // contacto: formulario ramificado (país → servicio → preguntas)
  (function () {
    var svc = document.getElementById("cfServicio");
    if (!svc) return;
    var groups = document.querySelectorAll(".cf-group");
    var rest = document.querySelector(".cf-rest");
    function upd() {
      var v = svc.value;
      groups.forEach(function (g) { g.hidden = g.getAttribute("data-group") !== v; });
      if (rest) rest.hidden = !v;
    }
    svc.addEventListener("change", upd);
    upd();
  })();

  // services split chooser
  var halves = document.querySelectorAll(".split-half");
  var splitEl = document.getElementById("split");
  var svcHint = document.getElementById("svcHint");
  halves.forEach(function (h) {
    h.addEventListener("click", function () {
      var key = h.getAttribute("data-svc");
      halves.forEach(function (x) { x.classList.toggle("is-active", x === h); });
      if (splitEl) splitEl.setAttribute("data-active", key);
      var active = null;
      document.querySelectorAll(".svc-panel").forEach(function (p) {
        var on = p.getAttribute("data-panel") === key;
        p.classList.toggle("is-active", on);
        if (on) active = p;
      });
      if (svcHint) svcHint.style.display = "none";
      if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 60);
      if (active) setTimeout(function () { active.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
    });
  });

  // GSAP scroll animations (pathway draws, plane descends, reveals)
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 30, duration: .7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%" } });
    });
    gsap.utils.toArray(".journey").forEach(function (j) {
      var track = j.querySelector(".jtrack"), fill = j.querySelector(".jfill"), plane = j.querySelector(".jplane");
      if (track) {
        ScrollTrigger.create({
          trigger: track, start: "top 68%", end: "bottom 74%", scrub: .6,
          onUpdate: function (self) {
            var p = self.progress, h = track.offsetHeight;
            if (fill) fill.style.height = (p * 100) + "%";
            if (plane) plane.style.transform = "translateY(" + (p * (h - 34) - 4) + "px) rotate(90deg)";
          }
        });
      }
      j.querySelectorAll(".jstep").forEach(function (s) {
        gsap.from(s, { opacity: 0, x: -26, duration: .6, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 86%" } });
      });
    });
    gsap.utils.toArray(".split-half").forEach(function (hh) {
      gsap.fromTo(hh, { backgroundPositionY: "42%" }, { backgroundPositionY: "58%", ease: "none", scrollTrigger: { trigger: hh, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  // modals
  function closeModals() {
    document.querySelectorAll(".modal.is-open").forEach(function (m) {
      m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true");
    });
  }
  document.querySelectorAll("[data-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var m = document.getElementById(btn.getAttribute("data-modal"));
      if (m) { m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); }
    });
  });
  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.hasAttribute("data-close")) closeModals();
    });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModals(); });

  // mobile menu
  var burger = document.querySelector(".nav-burger");
  var navEl = document.getElementById("nav");
  if (burger && navEl) {
    burger.addEventListener("click", function () {
      var open = navEl.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navEl.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        navEl.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // nav: solid background once scrolled
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (nav.classList.contains("nav-locked")) { nav.classList.add("is-solid"); return; }
      if (window.scrollY > 40) nav.classList.add("is-solid");
      else nav.classList.remove("is-solid");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
