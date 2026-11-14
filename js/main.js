document.documentElement.classList.add("js");
const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
/* scroll reveals */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
const io2 = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io2.unobserve(e.target);
      }
    }),
  { threshold: 0.2 },
);
document
  .querySelectorAll(
    ".pr,.svc,.runs,.sk,.m,.deck,.mu,.reportbar,.proj .plain,.tl>div",
  )
  .forEach((el, k, all) => {
    el.classList.add("rv");
    el.style.transitionDelay = (k % 4) * 90 + "ms";
    io.observe(el);
  });
/* counting numbers */
function fmt(el, v) {
  const d = +el.dataset.dec || 0;
  el.textContent =
    (el.dataset.pre || "") +
    v.toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }) +
    (el.dataset.suf || "");
}
const co = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target,
        t = +el.dataset.count;
      if (rm) {
        fmt(el, t);
        return;
      }
      let s = null;
      (function step(ts) {
        s = s || ts;
        const p = Math.min((ts - s) / 1400, 1);
        fmt(el, t * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }),
  { threshold: 0.6 },
);
document.querySelectorAll("[data-count]").forEach((el) => co.observe(el));
/* subtle parallax */
const g = document.getElementById("glow");
if (!rm)
  addEventListener(
    "scroll",
    () => {
      g.style.transform = "translateY(" + scrollY * 0.18 + "px)";
    },
    { passive: true },
  );
/* lightbox */
const lb = document.getElementById("lb"),
  li = document.getElementById("lbi"),
  lc = document.getElementById("lbc");
let set = [],
  i = 0,
  last;
function show(n) {
  i = (n + set.length) % set.length;
  const b = set[i],
    im = document.getElementById(b.dataset.src);
  li.src = im.src;
  li.alt = im.alt;
  lc.textContent = b.dataset.cap + "  (" + (i + 1) + "/" + set.length + ")";
}
document.querySelectorAll("[data-lb]").forEach((b) =>
  b.addEventListener("click", () => {
    set = [...b.closest("[data-set]").querySelectorAll("[data-lb]")];
    last = b;
    show(set.indexOf(b));
    lb.showModal();
  }),
);
document.getElementById("pv").onclick = () => show(i - 1);
document.getElementById("nx").onclick = () => show(i + 1);
document.getElementById("cl").onclick = () => lb.close();
lb.addEventListener("keydown", (e) => {
  const rt = document.documentElement.dir === "rtl";
  if (e.key === "ArrowLeft") show(i + (rt ? 1 : -1));
  if (e.key === "ArrowRight") show(i + (rt ? -1 : 1));
});
lb.addEventListener("click", (e) => {
  if (e.target === lb) lb.close();
});
lb.addEventListener("close", () => last && last.focus());
/* strips + chart + video */
document.querySelectorAll("[data-sc]").forEach(
  (b) =>
    (b.onclick = () =>
      b
        .closest("[data-set]")
        .querySelector(".strip")
        .scrollBy({
          left:
            b.dataset.sc *
            340 *
            (document.documentElement.dir === "rtl" ? -1 : 1),
          behavior: rm ? "auto" : "smooth",
        })),
);
document.querySelectorAll(".chart").forEach((c) => io2.observe(c));
document.getElementById("vid").onclick = function () {
  const f = document.createElement("iframe");
  f.src =
    "https://drive.google.com/file/d/1Wv0x3hvg-vOhYCic1y9MMRWo699nI9nZ/preview";
  f.title = "ALX interview";
  f.allow = "autoplay; fullscreen";
  f.allowFullscreen = true;
  this.replaceChildren(f);
  this.style.cursor = "default";
};

/* ===== language: gate + switcher ===== */
const TXT = {
  en: {
    title: document.title,
    desc: document.querySelector("meta[name=description]").content,
    vid: "ALX interview",
    tog: "العربية",
  },
  ar: {
    title: "مصطفى علاء — استراتيجي تسويق",
    desc: "مصطفى علاء، استراتيجي تسويق وليد ميديا باينج في القاهرة. استراتيجية ومحتوى وإعلانات وتدريب بنتايج حقيقية.",
    vid: "مقابلة ALX",
    tog: "English",
  },
};
function setLang(l) {
  const ar = l === "ar",
    h = document.documentElement;
  h.lang = l;
  h.dir = ar ? "rtl" : "ltr";
  document.querySelectorAll("[data-ar]").forEach((el) => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = ar ? el.dataset.ar : el.dataset.en;
  });
  ["alt", "aria-label", "data-cap"].forEach((a) =>
    document.querySelectorAll("[data-ar-" + a + "]").forEach((el) => {
      const k = "data-en-" + a;
      if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a));
      el.setAttribute(
        a,
        ar ? el.getAttribute("data-ar-" + a) : el.getAttribute(k),
      );
    }),
  );
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.dataset.suf = ar ? el.dataset.sufAr : el.dataset.sufEn;
    fmt(el, +el.dataset.count);
  });
  document
    .querySelectorAll("[data-sc]")
    .forEach(
      (b) => (b.textContent = (b.dataset.sc === "1") === ar ? "←" : "→"),
    );
  document.title = TXT[l].title;
  document.querySelector("meta[name=description]").content = TXT[l].desc;
  const tg = document.getElementById("langToggle");
  tg.textContent = TXT[l].tog;
  tg.lang = ar ? "en" : "ar";
  tg.dataset.to = ar ? "en" : "ar";
  const v = document.querySelector("#vid iframe");
  if (v) v.title = TXT[l].vid;
}
const gate = document.getElementById("langgate"),
  lockEls = document.querySelectorAll("header.nav,main,footer");
function lock(on) {
  lockEls.forEach((e) =>
    on ? e.setAttribute("inert", "") : e.removeAttribute("inert"),
  );
  document.body.style.overflow = on ? "hidden" : "";
}
function openGate() {
  gate.hidden = false;
  lock(true);
  gate.querySelector("[data-lang=en]").focus();
}
function choose(l) {
  document.body.classList.add("go");
  setLang(l);
  Jazz.start(!window.__skipGate);
  gate.hidden = true;
  lock(false);
  document.getElementById("top").focus({ preventScroll: true });
}
gate
  .querySelectorAll("[data-lang]")
  .forEach((b) => b.addEventListener("click", () => choose(b.dataset.lang)));
gate.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    const f = [...gate.querySelectorAll("button")],
      i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && i === f.length - 1) {
      e.preventDefault();
      f[0].focus();
    }
  }
});
document
  .getElementById("langToggle")
  .addEventListener("click", (e) =>
    setLang(e.currentTarget.dataset.to || "ar"),
  );
/* ===== motion: progress bar, hero spotlight, radial wheel gallery, report links ===== */
(function () {
  const pg = document.getElementById("pg");
  addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      pg.style.width =
        (scrollY / (h.scrollHeight - h.clientHeight)) * 100 + "%";
    },
    { passive: true },
  );
  const sec = document.getElementById("posts"),
    items = [...sec.querySelectorAll(".wi")],
    cap = document.getElementById("wcap"),
    N = items.length;
  let tick = false;
  function layout() {
    const vw = innerWidth,
      vh = innerHeight,
      r = sec.getBoundingClientRect(),
      total = sec.offsetHeight - vh,
      p = Math.min(1, Math.max(0, -r.top / total)),
      f = p * (N - 1);
    const R = Math.max(vw * 0.9, vh * 1.1, 640),
      step = vw < 700 ? 20 : 17,
      iw = Math.round(Math.min(Math.max(vw * 0.26, 210), 360)),
      cx = vw / 2,
      cy = vh * 0.56 + R;
    items.forEach((it, i) => {
      const d = i - f,
        ad = Math.abs(d),
        th = d * step,
        rad = (th * Math.PI) / 180,
        x = cx + R * Math.sin(rad),
        y = cy - R * Math.cos(rad);
      it.style.width = iw + "px";
      it.style.transform =
        "translate(" +
        x +
        "px," +
        y +
        "px) translate(-50%,-50%) rotate(" +
        th +
        "deg) scale(" +
        (1 - Math.min(ad, 2) * 0.07) +
        ")";
      it.style.opacity = Math.max(0, 1 - ad * 0.3);
      it.style.zIndex = 50 - Math.round(ad * 10);
      it.style.pointerEvents = ad < 2.2 ? "auto" : "none";
    });
    cap.textContent = items[Math.round(f)].getAttribute("data-cap");
  }
  if (!rm) {
    sec.classList.add("live");
    layout();
    addEventListener(
      "scroll",
      () => {
        if (!tick) {
          tick = true;
          requestAnimationFrame(() => {
            layout();
            tick = false;
          });
        }
      },
      { passive: true },
    );
    addEventListener("resize", layout);
    items.forEach((it, i) =>
      it.addEventListener("focus", () => {
        const total = sec.offsetHeight - innerHeight,
          top = sec.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top + (i / (N - 1)) * total + 1, behavior: "auto" });
      }),
    );
  }
  const _sl = setLang;
  setLang = function (l) {
    _sl(l);
    try {
      localStorage.setItem("ma_lang", l);
    } catch (e) {}
    document
      .querySelectorAll("a[data-report]")
      .forEach((a) => (a.href = "campaign_report.html?lang=" + l));
    if (sec.classList.contains("live")) layout();
    Jazz.ui();
  };
})();

/* ===== site-wide mouse spotlight ===== */
(function () {
  const s = document.getElementById("spot");
  if (!s || rm) return;
  let tx = innerWidth / 2,
    ty = innerHeight / 3,
    cx = tx,
    cy = ty;
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse") {
        tx = e.clientX;
        ty = e.clientY;
        s.classList.add("on");
      }
    },
    { passive: true },
  );
  document.addEventListener("mouseleave", () => s.classList.remove("on"));
  (function loop() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    s.style.setProperty("--sx", cx.toFixed(1) + "px");
    s.style.setProperty("--sy", cy.toFixed(1) + "px");
    requestAnimationFrame(loop);
  })();
})();
(function () {
  const q = new URLSearchParams(location.search),
    nv =
      performance.getEntriesByType &&
      performance.getEntriesByType("navigation")[0];
  let l = q.get("lang");
  if (l !== "ar" && l !== "en") l = null;
  let st = null;
  try {
    st = localStorage.getItem("ma_lang");
  } catch (e) {}
  const bf = nv && nv.type === "back_forward";
  if ((q.get("skip") === "1" && l) || (bf && (st === "ar" || st === "en")))
    window.__skipGate = l || st;
})();
if (window.__skipGate) choose(window.__skipGate);
else openGate();
