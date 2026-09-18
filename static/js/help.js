(function () {
  "use strict";

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".help-toc a[href^='#']"));
    if (!links.length) return;
    var sections = links
      .map(function (a) {
        var el = document.querySelector(a.getAttribute("href"));
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);
    if (!sections.length) return;

    function setActive(id) {
      sections.forEach(function (s) {
        s.link.classList.toggle("is-active", s.el.id === id);
      });
    }

    if ("IntersectionObserver" in window) {
      var visible = new Map();
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            visible.set(e.target.id, e.isIntersecting);
          });
          var current = null;
          sections.forEach(function (s) {
            if (visible.get(s.el.id)) current = s.el.id;
          });
          if (current) setActive(current);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      sections.forEach(function (s) { observer.observe(s.el); });
      return;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var current = null;
        var probe = window.scrollY + 120;
        sections.forEach(function (s) {
          if (s.el.offsetTop <= probe) current = s.el.id;
        });
        if (current) setActive(current);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollSpy);
  } else {
    initScrollSpy();
  }
})();
