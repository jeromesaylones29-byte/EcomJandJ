// ui3d.js: mouse-driven 3D tilt for product cards, product photo and hero images
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var SEL = ".pcard,.product-card,.pmedia,.hero-media .main,.hero-media .stack img", last = null;
  function reset(c) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var c = e.target.closest && e.target.closest(SEL);
    if (last && last !== c) reset(last);
    if (!c) { last = null; return; }
    last = c;
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--ry", ((x - .5) * 16).toFixed(2) + "deg");
    c.style.setProperty("--rx", (-(y - .5) * 16).toFixed(2) + "deg");
    c.style.setProperty("--mx", (x * 100).toFixed(0) + "%");
    c.style.setProperty("--my", (y * 100).toFixed(0) + "%");
  }, { passive: true });
  document.addEventListener("pointerleave", function () { if (last) reset(last); }, true);
})();
