// auth.js: Supabase Auth (sign up / sign in / sign out), orders list and checkout.
(function () {
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function setError(el, m) { el.textContent = m || ""; el.classList.toggle("show", !!m); }
  function nameOf(u) { return (u && u.user_metadata && u.user_metadata.full_name) || (u && u.email ? u.email.split("@")[0] : ""); }
  function first(n) { return (n || "").trim().split(/\s+/)[0] || "there"; }
  function user() { return window.JJ && JJ.user; }

  // after sign-in: add the item the visitor tried to add before signing in
  function afterAuth() {
    var p = null;
    try { p = JSON.parse(sessionStorage.getItem("jj_pending")); sessionStorage.removeItem("jj_pending"); } catch (e) {}
    if (p && findProduct(p.id)) {
      addToCart(p.id, p.qty); renderCartPage(); showToast("Added to your cart");
      if (p.back && !/profile\.html/.test(p.back)) setTimeout(function () { location.href = p.back; }, 900);
    }
  }
  function updateNav() { var l = $("profileLabel"); if (l) l.textContent = user() ? first(nameOf(user())) : "Profile"; }

  // ---------- Checkout (called from the cart summary button) ----------
  window.startCheckout = function () {
    if (!JJ.configured) return showToast("Connect Supabase in config.js to enable checkout.");
    if (!user()) { showToast("Please sign in to check out."); return setTimeout(function () { location.href = "profile.html"; }, 800); }
    if (!getCart().length) return showToast("Your cart is empty.");
    var m = document.createElement("div"); m.className = "modal";
    m.innerHTML = '<form class="modal-card" novalidate><h3>Delivery details</h3>' +
      '<div class="field"><label>Full name</label><input id="coName" value="' + esc(nameOf(user())) + '"></div>' +
      '<div class="field"><label>Phone</label><input id="coPhone" type="tel" placeholder="09xx xxx xxxx"></div>' +
      '<div class="field"><label>Street address</label><input id="coAddr"></div>' +
      '<div class="two"><div class="field"><label>City</label><input id="coCity"></div><div class="field"><label>Region</label>' +
      '<select id="coRegion"><option>Metro Manila</option><option>Rest of Luzon</option><option>Visayas &amp; Mindanao</option></select></div></div>' +
      '<div class="field"><label>Payment</label><select id="coPay"><option value="cod">Cash on delivery</option><option value="bank">Bank transfer (details sent by email)</option></select></div>' +
      '<p class="auth-error" id="coErr" role="alert"></p>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="coCancel">Cancel</button><button type="submit" class="btn" id="coGo">Place order · ' + peso(cartSubtotal() + (cartSubtotal() >= FREE_SHIP_THRESHOLD ? 0 : 150)) + "</button></div></form>";
    document.body.appendChild(m);
    $("coCancel").onclick = function () { m.remove(); };
    m.querySelector("form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var ship = { name: $("coName").value.trim(), phone: $("coPhone").value.trim(), address: $("coAddr").value.trim(), city: $("coCity").value.trim(), region: $("coRegion").value, payment: $("coPay").value };
      if (!ship.name || ship.phone.length < 7 || !ship.address || !ship.city) return setError($("coErr"), "Please complete all delivery details.");
      $("coGo").disabled = true; $("coGo").textContent = "Placing order…";
      var r = await JJ.sb.rpc("place_order", { p_items: getCart(), p_ship: ship });
      if (r.error) { $("coGo").disabled = false; $("coGo").textContent = "Try again"; return setError($("coErr"), r.error.message); }
      saveCart([]); m.remove(); await JJ.catalogReady; renderCartPage();
      m.innerHTML = ""; showToast("Order " + r.data + " placed. Thank you!");
      await loadOrders(); showPanel("orders");
    });
  };

  // ---------- Orders tab ----------
  async function loadOrders() {
    var box = $("ordersRoot"); if (!box || !user()) return;
    box.innerHTML = "<p>Loading orders…</p>";
    var r = await JJ.sb.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (r.error) { box.innerHTML = '<p class="err">Could not load orders.</p>'; return; }
    if (!r.data.length) { box.innerHTML = '<div class="empty"><h1>No orders yet</h1><p>Your orders will appear here.</p><a class="btn" href="shop.html">Browse the shop</a></div>'; return; }
    box.innerHTML = r.data.map(function (o) {
      return '<article class="order-card"><header><div><b>' + esc(o.order_no) + "</b><span>" + new Date(o.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) +
        '</span></div><span class="status s-' + esc(o.status) + '">' + esc(o.status.replace(/_/g, " ")) + "</span></header><ul>" +
        o.order_items.map(function (i) { return "<li>" + esc(i.qty) + " × " + esc(i.name) + "<b>" + peso(+i.price * i.qty) + "</b></li>"; }).join("") +
        '</ul><footer><span>Shipping ' + (+o.shipping_fee ? peso(+o.shipping_fee) : "Free") + "</span><b>Total " + peso(+o.total) + "</b></footer></article>";
    }).join("");
  }

  function showTab(which) {
    var up = which === "up";
    $("signInForm").hidden = up; $("signUpForm").hidden = !up;
    $("tabSignIn").classList.toggle("on", !up); $("tabSignUp").classList.toggle("on", up);
    setError($("siError"), ""); setError($("suError"), "");
  }
  function showPanel(w) {
    document.querySelectorAll(".pf-tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.pf === w); });
    ["cart", "orders", "account"].forEach(function (p) { $("pf-" + p).hidden = p !== w; });
  }
  function render(open) {
    var u = user(); updateNav();
    $("authView").hidden = !!u; $("profileView").hidden = !u;
    if (!u) return;
    var n = nameOf(u);
    $("pfName").textContent = "Hi, " + first(n); $("pfEmail").textContent = u.email;
    $("pfAvatar").textContent = (n.trim().charAt(0) || "J").toUpperCase();
    $("acName").textContent = n; $("acEmail").textContent = u.email;
    $("acSince").textContent = new Date(u.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
    showPanel(open || "cart"); renderCartPage(); loadOrders();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await window.catalogReady;
    if (window.JJ && JJ.sb) JJ.sb.auth.onAuthStateChange(function (ev, s) {
      JJ.user = s ? s.user : null; updateNav(); if (!s) JJ.clearLocalCart();
      if ($("authView") && (ev === "SIGNED_OUT")) render();
    });
    updateNav();
    if (!$("authView")) return;
    if (!JJ.configured) { $("authView").hidden = false; $("authView").querySelector(".auth-card").insertAdjacentHTML("afterbegin", '<p class="auth-error show">Supabase is not configured yet. Add your keys to config.js.</p>'); return; }
    var q = new URLSearchParams(location.search), tab = q.get("tab");
    render(["account", "orders"].indexOf(tab) > -1 ? tab : "cart");
    if (q.get("mode") === "signup") showTab("up");

    $("tabSignIn").onclick = function () { showTab("in"); }; $("tabSignUp").onclick = function () { showTab("up"); };
    document.querySelectorAll("[data-switch]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); showTab(a.dataset.switch); }; });
    document.querySelectorAll(".pw-toggle").forEach(function (b) { b.onclick = function () { var i = $(b.dataset.target), s = i.type === "password"; i.type = s ? "text" : "password"; b.textContent = s ? "Hide" : "Show"; }; });
    document.querySelectorAll(".pf-tabs button").forEach(function (b) { b.onclick = function () { showPanel(b.dataset.pf); }; });

    $("signUpForm").addEventListener("submit", async function (e) {
      e.preventDefault(); var err = $("suError"), name = $("suName").value.trim(), email = $("suEmail").value.trim().toLowerCase(), pw = $("suPass").value;
      if (name.length < 2) return setError(err, "Please enter your full name.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError(err, "Enter a valid email address.");
      if (pw.length < 6) return setError(err, "Password must be at least 6 characters.");
      if (pw !== $("suPass2").value) return setError(err, "Passwords do not match.");
      setError(err, "");
      var r = await JJ.sb.auth.signUp({ email: email, password: pw, options: { data: { full_name: name } } });
      if (r.error) return setError(err, r.error.message);
      if (!r.data.session) { $("signUpForm").reset(); return setError(err, "Account created. Check your email to confirm it, then sign in."); }
      JJ.user = r.data.user; $("signUpForm").reset(); await JJ.pullCart(); render("cart"); afterAuth(); showToast("Welcome, " + first(name) + "!");
    });
    $("signInForm").addEventListener("submit", async function (e) {
      e.preventDefault(); var err = $("siError"), email = $("siEmail").value.trim().toLowerCase(), pw = $("siPass").value;
      if (!email || !pw) return setError(err, "Enter your email and password.");
      var r = await JJ.sb.auth.signInWithPassword({ email: email, password: pw });
      if (r.error) return setError(err, r.error.message === "Invalid login credentials" ? "Incorrect email or password." : r.error.message);
      setError(err, ""); JJ.user = r.data.user; $("signInForm").reset(); await JJ.pullCart(); render("cart"); afterAuth(); showToast("Welcome back, " + first(nameOf(JJ.user)) + "!");
    });
    $("signOutBtn").onclick = async function () { await JJ.sb.auth.signOut(); JJ.user = null; saveCart([]); render(); showTab("in"); showToast("You have signed out."); };
  });
})();
