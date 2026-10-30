// hero3d.js: 3D coverflow of ALL pre-built PCs (built from the catalog, so it follows Supabase)
(function () {
  var st = document.getElementById("stage3d"); if (!st) return;
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches, cur = 0, timer, slides = [], dots = [], n = 0;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // transparent cut-out of each PC photo: b2.1.jpg -> b2.1-cut.png (falls back to the original photo)
  function cutout(src) { return /\.jpe?g$/i.test(src || "") ? src.replace(/\.jpe?g$/i, "-cut.png") : src; }

  function build() {
    var pcs = typeof prebuiltPCs !== "undefined" ? prebuiltPCs : []; n = pcs.length; if (!n) return;
    st.innerHTML = pcs.map(function (pc) {
      return '<a class="slide" href="product.html?slug=' + encodeURIComponent(pc.id) + '"><img src="' + esc(cutout(pc.image)) + '" data-orig="' + esc(pc.image) + '" onerror="if(this.dataset.orig&&this.src.indexOf(this.dataset.orig)<0){this.src=this.dataset.orig;this.classList.add(\'no-cut\')}" alt="' + esc(pc.title) + '">' +
        '<span class="slide-tag">' + esc(pc.badge || "Pre-built") + '</span>' +
        '<figcaption><b>' + esc(pc.title) + '</b><span>' + esc(peso(pc.price)) + ' &middot; View details &rarr;</span></figcaption></a>';
    }).join("") + '<div class="stage-floor"></div><div class="stage-dots">' + pcs.map(function (_, k) { return '<button aria-label="Show PC ' + (k + 1) + '"></button>'; }).join("") + '</div>';
    slides = [].slice.call(st.querySelectorAll(".slide")); dots = [].slice.call(st.querySelectorAll(".stage-dots button"));
    slides.forEach(function (s, k) { s.addEventListener("click", function (e) { if (k !== cur) { e.preventDefault(); show(k); play(); } }); });
    dots.forEach(function (b, k) { b.addEventListener("click", function () { show(k); play(); }); });
    show(0); play();
  }

  function show(i) {
    cur = (i + n) % n;
    slides.forEach(function (s, k) {
      var d = (k - cur + n) % n;   // 0 front, 1 right, n-1 left, others tucked behind
      s.className = "slide " + (d === 0 ? "is-active" : d === 1 ? "is-next" : d === n - 1 ? "is-prev" : "is-back");
      s.tabIndex = d === 0 ? 0 : -1;
    });
    dots.forEach(function (b, k) { b.classList.toggle("on", k === cur); });
  }
  function play() { if (!still && n > 1) { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 4200); } }

  st.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch" || still) return;
    var r = st.getBoundingClientRect();
    st.style.setProperty("--py", (((e.clientX - r.left) / r.width - .5) * 12).toFixed(1) + "deg");
    st.style.setProperty("--px", ((-(e.clientY - r.top) / r.height + .5) * 6).toFixed(1) + "deg");
  });
  st.addEventListener("pointerenter", function () { clearInterval(timer); });
  st.addEventListener("pointerleave", function () { st.style.setProperty("--py", "0deg"); st.style.setProperty("--px", "0deg"); play(); });

  (window.catalogReady || Promise.resolve()).then(build);
})();
