/* Tragaldabas — small progressive enhancements. The site works without JS. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  // Remember a language picked by hand, so the root page sends you back to it.
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[data-lang]");
    if (a) store("tragaldabas-lang", a.getAttribute("data-lang"));
  });

  // Mobile menu.
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var label = toggle.querySelector(".sr");
      if (label) label.textContent = toggle.getAttribute(open ? "data-close-label" : "data-open-label");
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (ev) { if (ev.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") setOpen(false); });
  }

  // Close the language menu when clicking elsewhere.
  document.addEventListener("click", function (ev) {
    document.querySelectorAll(".lang-menu[open]").forEach(function (d) {
      if (!d.contains(ev.target)) d.removeAttribute("open");
    });
  });

  // Dog filters.
  var filterBar = document.querySelector(".filters");
  if (filterBar) {
    var cards = document.querySelectorAll(".dog-card");
    filterBar.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-filter]");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      cards.forEach(function (c) {
        var show = f === "all" ||
          (f === "m" || f === "f" ? c.getAttribute("data-sex") === f :
            f === "home" ? c.getAttribute("data-home") === "1" : c.getAttribute("data-home") === "0");
        c.hidden = !show;
      });
    });
  }

  // Lightbox for photo grids.
  var lb = document.querySelector("dialog.lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var group = [];
    var index = 0;
    var show = function (i) {
      index = (i + group.length) % group.length;
      var a = group[index];
      lbImg.src = a.getAttribute("href");
      lbImg.alt = a.getAttribute("data-caption") || "";
      lbCap.textContent = a.getAttribute("data-caption") || "";
    };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a[data-lightbox]");
      if (!a) return;
      ev.preventDefault();
      group = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox="' + a.getAttribute("data-lightbox") + '"]'));
      show(group.indexOf(a));
      lb.showModal();
    });
    var rtl = doc.getAttribute("dir") === "rtl";
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
    lb.addEventListener("click", function (ev) { if (ev.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft") show(index + (rtl ? 1 : -1));
      if (ev.key === "ArrowRight") show(index + (rtl ? -1 : 1));
    });
    lb.addEventListener("close", function () { lbImg.removeAttribute("src"); });
  }

  // Contact form: compose a WhatsApp message. Nothing is sent to any server.
  var form = document.querySelector(".wa-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var get = function (n) { return (form.elements[n].value || "").trim(); };
      var err = form.querySelector(".form-error");
      if (!get("name") || !get("message")) {
        err.textContent = form.getAttribute("data-required");
        err.hidden = false;
        return;
      }
      err.hidden = true;
      var lines = [
        form.getAttribute("data-greeting"),
        "",
        form.getAttribute("data-l-name") + ": " + get("name")
      ];
      if (get("country")) lines.push(form.getAttribute("data-l-country") + ": " + get("country"));
      lines.push(form.getAttribute("data-l-interest") + ": " + get("interest"));
      lines.push("", get("message"));
      var url = "https://wa.me/" + form.getAttribute("data-wa") + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  // Gentle reveal on scroll.
  var noReveal = /HeadlessChrome/.test(navigator.userAgent) || /[?&]noreveal\b/.test(location.search);
  if (!noReveal && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".section-head, .dog-card, .litter, .points li, .steps li, .press-item, .timeline li, .card, .kids li");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
