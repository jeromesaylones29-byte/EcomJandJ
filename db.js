// db.js: Supabase data layer (catalog, cart sync, tracking, returns, newsletter; the contact form lives in contact.html).
// If config.js is not filled in, the site falls back to the local catalog in ItemList.js.
(function () {
  var cfg = window.JJ_CONFIG || {};
  var ok = window.supabase && cfg.SUPABASE_URL && !/^YOUR_/.test(cfg.SUPABASE_URL) && !/^YOUR_/.test(cfg.SUPABASE_ANON_KEY);
  var sb = ok ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  var JJ = window.JJ = { sb: sb, configured: !!sb, user: null };
  var timer;

  JJ.pushCart = function (cart) {
    if (!sb || !JJ.user) return;
    clearTimeout(timer);
    timer = setTimeout(async function () {
      await sb.from("cart_items").delete().eq("user_id", JJ.user.id);
      if (cart.length) await sb.from("cart_items").insert(cart.map(function (l) { return { user_id: JJ.user.id, product_id: l.id, qty: l.qty }; }));
    }, 300);
  };

  // The cart always comes from the signed-in account; visitors start at 0.
  JJ.pullCart = async function () {
    if (!sb || !JJ.user) return;
    var r = await sb.from("cart_items").select("product_id, qty");
    if (r.error) return;
    var cart = r.data.filter(function (l) { return findProduct(l.product_id); }).map(function (l) { return { id: l.product_id, qty: l.qty }; });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  };
  JJ.clearLocalCart = function () { localStorage.removeItem(CART_KEY); if (typeof updateCartBadge === "function") updateCartBadge(); };

  function fill(rows) {
    PRODUCTS.length = 0; prebuiltPCs.length = 0;
    rows.forEach(function (r) {
      var p = { id: r.id, name: r.name, brand: r.brand, category: r.category, categoryLabel: r.category_label, price: +r.price,
        was: r.was ? +r.was : undefined, image: r.image, stock: r.stock, description: r.description, specs: r.specs || [] };
      if (r.is_prebuilt) {
        p.title = r.name; p.badge = r.badge; p.badgeClass = r.badge_class; p.subtitle = r.subtitle; p.priceLabel = peso(p.price);
        prebuiltPCs.push(p);
      } else PRODUCTS.push(p);
    });
  }

  window.catalogReady = (async function () {
    if (!sb) return;
    try {
      var s = await sb.auth.getSession();
      JJ.user = s.data.session ? s.data.session.user : null;
      var r = await sb.from("products").select("*").eq("active", true).order("sort");
      if (!r.error && r.data && r.data.length) fill(r.data);
      else console.warn("Supabase catalog empty or unreachable; using local catalog.", r.error);
      if (JJ.user) await JJ.pullCart(); else JJ.clearLocalCart();
    } catch (e) { console.warn("Supabase init failed", e); }
  })();

  // Forms: only intercepted when Supabase is configured (otherwise the demo handlers run)
  function out(id, html) { var el = document.getElementById(id); el.innerHTML = html; el.classList.add("show"); }
  document.addEventListener("submit", async function (e) {
    if (!sb) return;
    var id = e.target.id, v = function (x) { return document.getElementById(x).value.trim(); };
    if (id === "trackForm") {
      e.preventDefault(); e.stopImmediatePropagation();
      var res = await sb.rpc("track_order", { p_order_no: v("trackNo"), p_email: v("trackEmail") });
      if (res.error || !res.data) return out("trackResult", '<span class="err">No order found for that order number and email.</span>');
      var stages = ["placed", "paid", "packed", "shipped", "out_for_delivery", "delivered"],
          names = ["Order placed", "Payment confirmed", "Packed and checked", "Handed to courier", "Out for delivery", "Delivered"],
          at = stages.indexOf(res.data.status);
      out("trackResult", "<strong>Order " + res.data.order_no + "</strong>" + (at < 0 ? "<p>This order was cancelled.</p>" :
        '<ul class="track-steps">' + names.map(function (n, i) { return '<li class="' + (i <= at ? "done" : "") + '">' + n + "</li>"; }).join("") + "</ul>"));
    } else if (id === "jNews") {
      e.preventDefault(); e.stopImmediatePropagation();
      var em = v("jNewsEmail").toLowerCase(), note = document.getElementById("jNewsNote");
      if (!/^\S+@\S+\.\S+$/.test(em)) { if (note) note.textContent = "Enter a valid email address."; return; }
      var nr = await sb.from("newsletter_subscribers").insert({ email: em });
      if (note) note.textContent = nr.error && nr.error.code !== "23505" ? "Could not subscribe. Please try again." : "You are subscribed. Thank you!";
      if (!nr.error) document.getElementById("jNewsEmail").value = "";
    } else if (id === "rmaForm") {
      e.preventDefault(); e.stopImmediatePropagation();
      var ref = "RMA-" + Math.floor(100000 + Math.random() * 900000);
      var rr = await sb.from("rma_requests").insert({ ref: ref, order_no: v("rmaOrder").toUpperCase(), reason: v("rmaReason") });
      if (rr.error || !v("rmaReason")) return out("rmaResult", '<span class="err">Enter your order number and choose a reason.</span>');
      out("rmaResult", '<div class="big">' + ref + "</div><div>Return request received. Write this number on the box.</div>");
    }
  }, true);
})();
