// ================================================================
//  app.js  --  THE MAIN BRAIN OF THE STORE
// ================================================================
//
//  WHAT IS THIS FILE?
//  This file makes the website "do things": show products, add
//  items to the cart, search, filter, calculate shipping, etc.
//
//  HOW THE FILES WORK TOGETHER (load order matters!):
//     1. ItemList.js -> the DATA (list of products + peso() helper)
//     2. app.js      -> THIS FILE (uses that data)
//     3. auth.js     -> sign in / sign up (uses showToast() from here)
//
//  TABLE OF CONTENTS (read top to bottom, like a book):
//     1. SETTINGS ............ fixed values used everywhere
//     2. SMALL HELPERS ....... findProduct(), showToast()
//     3. CART ................ add / remove / count / total
//     4. PRODUCT CARD ........ the box that shows one product
//     5. HOME PAGE ........... prebuilt PCs + flash deals
//     6. SHOP PAGE ........... grid, filter, search, sort
//     7. PRODUCT PAGE ........ one product in detail
//     8. CART PAGE ........... list of items + order summary
//     9. SHIPPING PAGE ....... calculator, tracker, returns
//    10. START-UP (BOOT) ..... runs everything when page loads
//
//  BEGINNER TIPS:
//   - "function name() { ... }" = a named block of code you can
//     run later by writing name().
//   - "const" = a value that will not be re-assigned.
//     "let"   = a value that CAN change later.
//   - document.getElementById("x") = find the HTML element that
//     has id="x".
//   - Every page loads this SAME file, so each function first
//     checks "does this page even have my section?" and quietly
//     stops (return) if not.
// ================================================================


// ================================================================
// 1) SETTINGS  (values that never change while the site runs)
// ================================================================

// The "name" under which the cart is saved inside the browser.
// localStorage is a small storage box in the browser that keeps
// data even after you close the tab.
const CART_KEY = "jj_cart";

// Spend this much (in pesos) or more = free shipping.
const FREE_SHIP_THRESHOLD = 3000;

// Delivery time (in business days) for each region.
// min = fastest, max = slowest. Used by the shipping calculator.
const SHIP_ZONES = {
    metro:  { label: "Metro Manila",        min: 1, max: 2 },
    luzon:  { label: "Rest of Luzon",       min: 2, max: 4 },
    vismin: { label: "Visayas & Mindanao",  min: 3, max: 6 }
};


// ================================================================
// 2) SMALL HELPERS  (tiny tools used by many other functions)
// ================================================================

// FIND A PRODUCT BY ITS ID  (example id: "prs1")
// Looks in the normal catalog (PRODUCTS) first, then in the
// prebuilt PCs (prebuiltPCs). Both lists come from ItemList.js.
// Returns the product object, or null if nothing matches.
function findProduct(id) {
    for (let i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    for (let i = 0; i < prebuiltPCs.length; i++) {
        if (prebuiltPCs[i].id === id) return prebuiltPCs[i];
    }
    return null; // not found anywhere
}

// SHOW A SMALL POP-UP MESSAGE (a "toast") for 2 seconds
// Example: showToast("Added to cart!")
function showToast(message) {
    // Reuse the toast box if it already exists...
    let toast = document.querySelector(".toast");
    // ...otherwise create it and attach it to the page.
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;     // put the message text inside
    toast.classList.add("show");     // "show" class makes it visible (CSS)
    // After 2000 milliseconds (2 seconds), hide it again.
    setTimeout(function () { toast.classList.remove("show"); }, 2000);
}


// ================================================================
// 3) CART  (the shopping cart lives in the browser's localStorage)
// ----------------------------------------------------------------
// The cart is a list (array) that looks like this:
//     [ { id: "prs1", qty: 2 }, { id: "gc3", qty: 1 } ]
// Each entry = which product (id) and how many (qty).
// ================================================================

// READ THE CART from storage.
// If nothing is saved yet (or the data is broken) give back [].
function getCart() {
    const raw = localStorage.getItem(CART_KEY);   // text or null
    if (!raw) return [];
    // JSON.parse turns saved text back into a real list.
    // try/catch = "if this crashes, don't break the site".
    try { return JSON.parse(raw); } catch (e) { return []; }
}

// SAVE THE CART to storage, then refresh the number on the cart icon.
function saveCart(cart) {
    // JSON.stringify turns the list into text so it can be stored.
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
    if (window.JJ && JJ.pushCart) JJ.pushCart(cart);
}

// ADD an item to the cart.
// If it's already in the cart, just increase its quantity.
// Without a signed-in account nothing can be added: the item is remembered,
// the visitor is sent to sign in, and auth.js adds it right after sign-in.
function requireSignIn(id, qty) {
    try { sessionStorage.setItem("jj_pending", JSON.stringify({ id: id, qty: qty || 1, back: location.href })); } catch (e) {}
    showToast("Please sign in to add items to your cart.");
    setTimeout(function () { location.href = "profile.html?mode=signin"; }, 900);
}

function addToCart(id, qty) {
    if (window.JJ && JJ.configured && !JJ.user) { requireSignIn(id, qty); return false; }
    qty = qty || 1;              // if no qty was given, use 1
    const cart = getCart();
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {                 // already in cart?
            cart[i].qty = cart[i].qty + qty;     // just add more
            found = true;
            break;                               // stop looping
        }
    }
    if (!found) cart.push({ id: id, qty: qty }); // brand new item
    saveCart(cart);
    return true;
}

// SET an item's quantity to an exact number.
// If the number is 0 or less, remove the item instead.
function setQty(id, qty) {
    const cart = getCart();
    if (qty <= 0) return removeFromCart(id);
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty = qty;
            break;
        }
    }
    saveCart(cart);
}

// REMOVE an item completely from the cart.
function removeFromCart(id) {
    let cart = getCart();
    // filter() keeps only the lines whose id is NOT the removed one.
    cart = cart.filter(function (line) { return line.id !== id; });
    saveCart(cart);
}

// COUNT total pieces in the cart (2 mice + 1 GPU = 3).
function cartCount() {
    const cart = getCart();
    let total = 0;
    for (let i = 0; i < cart.length; i++) total = total + cart[i].qty;
    return total;
}

// ADD UP the money: price x quantity for every item.
function cartSubtotal() {
    const cart = getCart();
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const p = findProduct(cart[i].id);
        if (p) total = total + p.price * cart[i].qty;
    }
    return total;
}

// UPDATE the small number shown on the cart icon in the header.
function updateCartBadge() {
    const el = document.getElementById("cartCount");
    if (!el) return;                       // page has no badge
    el.textContent = String(cartCount());
}


// ================================================================
// 4) PRODUCT CARD  (the box that shows ONE product)
// ----------------------------------------------------------------
// Used on the shop grid, flash deals and "you may also like".
// ================================================================

// BUILD one product card and give it back (it is not on the page
// yet - the caller decides where to place it).
function makeProductCard(p) {
    // The whole card is a link to that product's detail page.
    const card = document.createElement("a");
    card.className = "pcard";
    card.href = "product.html?slug=" + p.id;   // ?slug=... tells the next page WHICH product
    card.dataset.category = p.category;        // remember category (for filtering)

    // DISCOUNT % = how much cheaper the price is than the old price.
    // Example: was 1000, now 800 -> (1 - 0.8) x 100 = 20%
    const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;

    // Write the card's HTML. (peso() comes from ItemList.js and
    // formats numbers like 13499 -> "₱13,499".)
    card.innerHTML =
        '<div class="media">' +
            (save > 0 ? '<span class="discount">-' + save + '%</span>' : '') +
            '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '</div>' +
        '<div class="body">' +
            '<div class="brand">' + p.brand + '</div>' +
            '<div class="name">' + p.name + '</div>' +
            '<div class="price">' +
                '<span class="now">' + peso(p.price) + '</span>' +
                (p.was ? '<span class="was">' + peso(p.was) + '</span>' : '') +
            '</div>' +
            '<button type="button" class="btn add">Add to cart</button>' +
        '</div>';

    // The button is INSIDE a link, so clicking would normally open
    // the product page. We stop that and add to cart instead.
    const addBtn = card.querySelector(".add");
    addBtn.addEventListener("click", function (e) {
        e.preventDefault();      // don't follow the link
        e.stopPropagation();     // don't let the card also react to the click
        if (addToCart(p.id, 1)) showToast("Added to your cart");
    });

    return card;
}


// ================================================================
// 5) HOME PAGE  (prebuilt PCs + flash deals)
// ================================================================

// SHOW THE PREBUILT PC CARDS (home page + shop page)
function renderPrebuilts() {
    const container = document.getElementById("prebuilt-featured");
    if (!container) return;      // this page has no such section -> stop
    container.innerHTML = "";    // clear old content first

    // Make one card for every PC in prebuiltPCs (from ItemList.js).
    prebuiltPCs.forEach(function (pc) {
        const card = document.createElement("div");
        card.classList.add("product-card");

        // Turn the specs list into <li> bullet items.
        // map() = transform each spec, join("") = glue into one string.
        const specsHtml = pc.specs.map(function (spec) { return "<li>" + spec + "</li>"; }).join("");
        const url = "product.html?slug=" + pc.id;

        // Whole card (image + title) links to the product info page.
        card.innerHTML =
            '<a class="card-link" href="' + url + '" aria-label="View details for ' + pc.title + '">' +
                '<div class="image-wrapper">' +
                    '<span class="badge ' + pc.badgeClass + '">' + pc.badge + '</span>' +
                    '<img src="' + pc.image + '" alt="' + pc.title + '">' +
                '</div>' +
                '<p class="subtitle">' + pc.subtitle + '</p>' +
                '<div class="product-title">' + pc.title + '</div>' +
            '</a>' +
            '<div class="price">' + pc.priceLabel + '</div>' +
            '<div class="card-actions">' +
                '<a class="btn-view" href="' + url + '">View details</a>' +
                '<a href="#" class="btn-cart" data-prebuilt-id="' + pc.id + '">Add to cart</a>' +
            '</div>' ;

        // "Add to cart" button: add the PC and show a message.
        const addBtn = card.querySelector(".btn-cart");
        addBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (addToCart(pc.id, 1)) showToast("Added to your cart");
        });

        container.appendChild(card);   // finally put the card on the page
    });
}

// SHOW "FLASH DEALS" on the home page (4 discounted products)
function renderFlashDeals() {
    const container = document.getElementById("flash-deals");
    if (!container) return;
    container.innerHTML = "";

    // Keep only products that have an old price ("was"), then take
    // the first 4. slice(0, 4) = items number 0,1,2,3.
    const flash = PRODUCTS.filter(function (p) { return p.was; }).slice(0, 4);
    flash.forEach(function (p) { container.appendChild(makeProductCard(p)); });
}


// ================================================================
// 6) SHOP PAGE  (grid, category filter, search, sort)
// ================================================================

// SHOW ALL PRODUCTS in the shop grid
function renderShopGrid() {
    const grid = document.getElementById("grid");
    if (!grid) return;
    grid.innerHTML = "";
    PRODUCTS.forEach(function (p) { grid.appendChild(makeProductCard(p)); });
    updateMeta(PRODUCTS.length);
}

// UPDATE the text "Showing 12 of 36 products"
function updateMeta(visible) {
    const meta = document.getElementById("meta");
    if (!meta) return;
    meta.textContent = "Showing " + visible + " of " + PRODUCTS.length + " products";
}

// (OLD / UNUSED) Hide cards that are not in the chosen category.
// The site now uses applySearchAndSort() below instead, so nothing
// calls this function anymore. Safe to delete if you want.
function filterProducts(category) {
    const cards = document.querySelectorAll("#grid .pcard");
    let visible = 0;
    cards.forEach(function (card) {
        const c = card.dataset.category;
        if (category === "all" || c === category) {
            card.style.display = "flex";
            visible = visible + 1;
        } else {
            card.style.display = "none";
        }
    });
    updateMeta(visible);
}

// THE MAIN SHOP FUNCTION: apply category + search + sort together,
// then redraw the grid. Runs whenever the user clicks a category
// pill, types in the search box, or changes the sort menu.
function applySearchAndSort() {
    const grid = document.getElementById("grid");
    if (!grid) return;

    // 1) Read what the user chose.
    const navBox = document.getElementById("navSearch");
    const q = (navBox ? navBox.value : "").toLowerCase().trim();  // search text
    const sort = document.getElementById("sort").value;           // sort option

    // Which category pill is highlighted? (default = all)
    let activeCat = "all";
    const onPill = document.querySelector(".pill.on");
    if (onPill) activeCat = onPill.dataset.cat;

    // 2) Start with a COPY of all products (slice() = copy).
    let list = PRODUCTS.slice();

    // 3) Keep only the chosen category.
    if (activeCat !== "all") list = list.filter(function (p) { return p.category === activeCat; });

    // 4) Keep only products whose name/brand/category contains the search text.
    //    indexOf(q) !== -1 means "q was found inside the text".
    if (q) {
        list = list.filter(function (p) {
            return (p.name + " " + p.brand + " " + p.category).toLowerCase().indexOf(q) !== -1;
        });
    }

    // 5) Sort by price if asked (a - b = low to high, b - a = high to low).
    if (sort === "price-asc")  list.sort(function (a, b) { return a.price - b.price; });
    if (sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });

    // 6) Redraw the grid with the final list.
    grid.innerHTML = "";
    list.forEach(function (p) { grid.appendChild(makeProductCard(p)); });
    updateMeta(list.length);
}

// HEADER SEARCH BAR (the one in the middle of the top menu).
// - On the shop page: filter the grid right away.
// - On other pages: jump to shop.html?q=... so the results are
//   already filtered when the shop page opens.
// Called from the HTML: <form onsubmit="return navSearchSubmit(event)">
function navSearchSubmit(e) {
    if (e) e.preventDefault();          // stop the page from reloading
    const box = document.getElementById("navSearch");
    const q = box ? box.value.trim() : "";
    const shopGrid = document.getElementById("grid");
    if (shopGrid) {                     // we are ON the shop page
        applySearchAndSort();
        return false;
    }
    // encodeURIComponent makes the text safe to put in a web address.
    window.location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    return false;
}


// ================================================================
// 7) PRODUCT PAGE  (product.html?slug=prs1 -> shows product prs1)
// ================================================================

// SHOW ONE PRODUCT IN DETAIL
function renderProductPage() {
    const root = document.getElementById("productRoot");
    if (!root) return;

    // Read the product id from the web address: ...?slug=prs1
    const slug = new URLSearchParams(window.location.search).get("slug");
    const p = findProduct(slug || "");

    // If no product matches, show a "not found" message and stop.
    if (!p) {
        root.innerHTML =
            '<div class="empty">' +
                '<h1>Product not found</h1>' +
                '<p>The product you are looking for does not exist.</p>' +
                '<a class="btn" href="shop.html">Back to shop</a>' +
            '</div>';
        document.getElementById("pTitle").textContent = "Not found";
        return;
    }

    // Update the small title text + breadcrumb (Home > Category > ...).
    document.getElementById("pTitle").textContent = p.name;
    const crumb = document.getElementById("crumbCat");
    if (crumb) crumb.textContent = p.categoryLabel;

    // Discount percentage (same formula as in makeProductCard).
    const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;

    // Specs as bullet points.
    const specsHtml = p.specs.map(function (s) { return "<li>" + s + "</li>"; }).join("");

    // Build the whole product layout: image on the left, info on the right.
    root.innerHTML =
        '<div class="pmedia">' +
            (save > 0 ? '<span class="discount">-' + save + '%</span>' : '') +
            '<img src="' + p.image + '" alt="' + p.name + '">' +
        '</div>' +
        '<div class="pinfo">' +
            '<div class="pbrand">' + p.brand + ' • ' + p.categoryLabel + '</div>' +
            '<h1 class="pname">' + p.name + '</h1>' +
            '<div class="pprice">' +
                '<span class="now">' + peso(p.price) + '</span>' +
                (p.was ? '<span class="was">' + peso(p.was) + '</span>' : '') +
                (save > 0 ? '<span class="save">Save ' + save + '%</span>' : '') +
            '</div>' +
            '<div class="pstock">In stock — ' + p.stock + ' available</div>' +
            '<p class="pdesc">' + p.description + '</p>' +

            '<div class="qtyrow">' +
                '<label style="font-weight:600;font-size:14px">Quantity</label>' +
                '<div class="qty">' +
                    '<button type="button" data-step="-1">−</button>' +
                    '<input type="text" id="qtyInput" value="1" readonly>' +
                    '<button type="button" data-step="1">+</button>' +
                '</div>' +
                '<button type="button" class="btn" id="addBtn">Add to cart</button>' +
            '</div>' +

            '<div class="pspecs">' +
                '<h4>Specifications</h4>' +
                '<ul>' + specsHtml + '</ul>' +
            '</div>' +
        '</div>';

    // --- Quantity − / + buttons (the HTML above now exists, so we can use it) ---
    const qtyInput = document.getElementById("qtyInput");
    root.querySelectorAll(".qty button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            // data-step is -1 or +1 (set in the HTML above).
            const step = parseInt(btn.dataset.step, 10) || 0;
            let v = parseInt(qtyInput.value, 10) || 1;
            v = v + step;
            if (v < 1) v = 1;                 // can't go below 1
            if (v > p.stock) v = p.stock;     // can't go above stock
            qtyInput.value = String(v);
        });
    });

    // --- "Add to cart" button ---
    document.getElementById("addBtn").addEventListener("click", function () {
        const q = parseInt(qtyInput.value, 10) || 1;
        if (addToCart(p.id, q)) showToast("Added " + q + " × " + p.name + " to your cart");
    });
}

// SHOW "YOU MAY ALSO LIKE" (up to 4 other products)
function renderAlsoLike() {
    const container = document.getElementById("alsoLike");
    if (!container) return;
    container.innerHTML = "";

    // Which product are we looking at right now?
    const slug = new URLSearchParams(window.location.search).get("slug");
    const current = findProduct(slug || "");

    // First choice: other products from the SAME category.
    let pool = [];
    if (current) {
        pool = PRODUCTS.filter(function (p) { return p.id !== current.id && p.category === current.category; });
    }
    // Not enough (less than 4)? Fill up with any other products.
    if (pool.length < 4) {
        const more = PRODUCTS.filter(function (p) {
            return (!current || p.id !== current.id) && pool.indexOf(p) === -1;
        });
        pool = pool.concat(more);   // concat = join two lists
    }
    // Show only the first 4.
    pool.slice(0, 4).forEach(function (p) { container.appendChild(makeProductCard(p)); });
}


// ================================================================
// 8) CART PAGE  (list of cart items + order summary box)
// ================================================================
// Note: the cart page is now part of profile.html (cart.html just
// redirects there). auth.js calls renderCartPage() after sign-in.

// SHOW ALL CART ITEMS
function renderCartPage() {
    const root = document.getElementById("cartRoot");
    const summary = document.getElementById("summaryBox");
    if (!root || !summary) return;

    const cart = getCart();

    // EMPTY CART -> show a friendly message and stop.
    if (cart.length === 0) {
        root.innerHTML =
            '<div class="empty">' +
                '<h1>Your cart is empty</h1>' +
                '<p>Add products from the shop to see them here.</p>' +
                '<a class="btn" href="shop.html">Browse the shop</a>' +
            '</div>';
        summary.innerHTML = "";
        return;
    }

    // Build one row of HTML for every item in the cart.
    let linesHtml = "";
    cart.forEach(function (line) {
        const p = findProduct(line.id);
        if (!p) return; // product no longer exists in the catalog -> skip
        const lineTotal = p.price * line.qty;   // price x quantity
        linesHtml +=
            '<div class="cline" data-id="' + p.id + '">' +
                '<img src="' + p.image + '" alt="' + p.name + '">' +
                '<div>' +
                    '<div class="nm"><a href="product.html?slug=' + p.id + '">' + p.name + '</a></div>' +
                    '<div class="pr">' + p.brand + ' • ' + peso(p.price) + ' each</div>' +
                '</div>' +
                '<div class="cartqty">' +
                    '<button type="button" data-step="-1">−</button>' +
                    '<span class="qv">' + line.qty + '</span>' +
                    '<button type="button" data-step="1">+</button>' +
                '</div>' +
                '<div class="lt">' + peso(lineTotal) + '</div>' +
            '</div>' +
            '<div class="cline-actions">' +
                '<button type="button" class="remove" data-remove="' + p.id + '">Remove</button>' +
            '</div>';
    });
    root.innerHTML = linesHtml;

    wireCartLineHandlers();   // make the buttons above clickable
    renderSummary();          // draw the totals box
}

// MAKE THE CART BUTTONS WORK (+, −, Remove)
// The buttons only exist after renderCartPage() draws them, so we
// attach the click actions here, right after.
function wireCartLineHandlers() {
    const root = document.getElementById("cartRoot");

    // + and − buttons
    root.querySelectorAll(".cartqty button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            // closest() finds the nearest parent row, so we know WHICH item.
            const lineEl = btn.closest(".cline");
            const id = lineEl.dataset.id;
            const step = parseInt(btn.dataset.step, 10) || 0;
            const cart = getCart();
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === id) {
                    setQty(id, cart[i].qty + step);
                    break;
                }
            }
            renderCartPage(); // redraw so numbers and totals are correct
        });
    });

    // "Remove" buttons
    root.querySelectorAll(".remove").forEach(function (btn) {
        btn.addEventListener("click", function () {
            removeFromCart(btn.dataset.remove);
            renderCartPage();
        });
    });
}

// DRAW THE "ORDER SUMMARY" BOX (subtotal, shipping, total)
function renderSummary() {
    const summary = document.getElementById("summaryBox");
    if (!summary) return;

    const subtotal = cartSubtotal();
    // Shipping is free at 3000+, otherwise it costs 150 pesos.
    const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : 150;
    const total = subtotal + shipping;

    // A little note telling the customer how close they are to free shipping.
    const freeNote = subtotal >= FREE_SHIP_THRESHOLD
        ? '<div class="free-note">✓ You qualified for free shipping!</div>'
        : '<div class="free-note">Add ' + peso(FREE_SHIP_THRESHOLD - subtotal) + ' more for free shipping.</div>';

    summary.innerHTML =
        '<div class="summary">' +
            '<h3 style="font-size:17px;margin-bottom:14px">Order summary</h3>' +
            freeNote +
            '<div class="row"><span>Items</span><span>' + cartCount() + '</span></div>' +
            '<div class="row"><span>Subtotal</span><span>' + peso(subtotal) + '</span></div>' +
            '<div class="row"><span>Shipping</span><span>' + (shipping === 0 ? "Free" : peso(shipping)) + '</span></div>' +
            '<div class="row total"><span>Total</span><span>' + peso(total) + '</span></div>' +
            // The checkout button only shows a demo alert (no real payment).
            '<button type="button" class="btn btn-block" style="margin-top:18px" onclick="startCheckout()">Proceed to checkout</button>' +
            '<a href="shop.html" class="see-all" style="display:inline-block;margin-top:14px">← Continue shopping</a>' +
        '</div>';
}


// ================================================================
// 9) SHIPPING PAGE  (banner, calculator, order tracker, returns)
// ================================================================

// DATE HELPER: get the date that is N business days from today
// (Saturdays and Sundays are skipped).
function addBusinessDays(n) {
    const d = new Date();      // today
    let added = 0;
    while (added < n) {
        d.setDate(d.getDate() + 1);   // move forward 1 day
        const day = d.getDay();       // 0 = Sunday, 6 = Saturday
        if (day !== 0 && day !== 6) added++;   // only count weekdays
    }
    return d;
}

// DATE HELPER: turn a date into readable text, e.g. "Mon, Sep 28".
function fmtDate(d) {
    return d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
}

// SET UP EVERYTHING ON THE SHIPPING PAGE
function initShippingTools() {
    const banner = document.getElementById("shipBanner");
    if (!banner) return;   // not the shipping page -> stop

    // ---------- PART A: free-shipping progress bar ----------
    // Uses the real cart total to show how close you are to free shipping.
    const sub = cartSubtotal();
    const title = document.getElementById("shipBannerTitle");
    const text = document.getElementById("shipBannerText");
    const bar = document.getElementById("shipBar");
    const btn = document.getElementById("shipBannerBtn");
    if (sub > 0) {
        // Percent of the goal reached (never more than 100).
        const pct = Math.min(100, Math.round(sub / FREE_SHIP_THRESHOLD * 100));
        bar.style.width = pct + "%";
        if (sub >= FREE_SHIP_THRESHOLD) {
            title.textContent = "Your cart qualifies for free shipping";
            text.textContent = "Cart subtotal " + peso(sub) + ". Standard delivery is on us.";
            btn.textContent = "Go to cart";
            btn.href = "cart.html";
        } else {
            title.textContent = "You are " + peso(FREE_SHIP_THRESHOLD - sub) + " away from free shipping";
            text.textContent = "Cart subtotal " + peso(sub) + " of " + peso(FREE_SHIP_THRESHOLD) + ".";
            btn.textContent = "Keep shopping";
            btn.href = "shop.html";
        }
        // Pre-fill the calculator's subtotal box with the cart total.
        const calcSub = document.getElementById("calcSubtotal");
        if (calcSub && !calcSub.value) calcSub.value = sub;
    }

    // ---------- PART B: shipping calculator ----------
    const calc = document.getElementById("shipCalc");
    calc.addEventListener("submit", function (e) {
        e.preventDefault();   // don't reload the page
        const zone = SHIP_ZONES[document.getElementById("calcRegion").value];
        const subtotal = parseFloat(document.getElementById("calcSubtotal").value);
        const bulky = document.getElementById("calcBulky").checked;
        const out = document.getElementById("calcResult");

        // Validate: the subtotal must be a real number, 0 or more.
        if (isNaN(subtotal) || subtotal < 0) {
            out.innerHTML = '<span class="err">Enter your order subtotal to continue.</span>';
            out.classList.add("show");
            return;
        }
        const free = subtotal >= FREE_SHIP_THRESHOLD;
        const extra = bulky ? 2 : 0;   // bulky items take 2 more days
        // Delivery window = today + processing (1 day) + region days (+ bulky).
        const from = fmtDate(addBusinessDays(zone.min + 1 + extra));
        const to = fmtDate(addBusinessDays(zone.max + 1 + extra));
        let feeHtml = free ? "Free" : peso(150);
        let note = free
            ? "Your order qualifies for free standard shipping."
            : "Add " + peso(FREE_SHIP_THRESHOLD - subtotal) + " more to get free shipping.";
        if (bulky) note += " Bulky items are freight-shipped, so the final fee is quoted at checkout.";
        out.innerHTML =
            '<div class="big">' + feeHtml + '</div>' +
            '<div style="margin-top:6px"><strong>' + zone.label + '</strong> · arrives ' + from + ' – ' + to + '</div>' +
            '<div style="margin-top:6px;color:var(--muted);font-size:13px">' + note + '</div>';
        out.classList.add("show");
    });

    // ---------- PART C: order tracker (DEMO - progress is faked) ----------
    const track = document.getElementById("trackForm");
    track.addEventListener("submit", function (e) {
        e.preventDefault();
        const no = document.getElementById("trackNo").value.trim().toUpperCase();
        const email = document.getElementById("trackEmail").value.trim();
        const out = document.getElementById("trackResult");

        // Order number must look like JJ-104582  (JJ- then 4 to 8 digits).
        if (!/^JJ-\d{4,8}$/.test(no)) {
            out.innerHTML = '<span class="err">Enter a valid order number, like JJ-104582.</span>';
            out.classList.add("show");
            return;
        }
        // Email must look like something@something.something
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            out.innerHTML = '<span class="err">Enter the email address used at checkout.</span>';
            out.classList.add("show");
            return;
        }
        const stages = ["Order placed", "Payment confirmed", "Packed and checked", "Handed to courier", "Out for delivery", "Delivered"];
        // There is no real database. We add up the letters of the order number
        // to get a number, so the same order number always shows the same progress.
        let seed = 0;
        for (let i = 0; i < no.length; i++) seed += no.charCodeAt(i);
        const reached = 2 + (seed % 4);   // between 2 and 5 steps done
        let items = "";
        stages.forEach(function (st, i) {
            items += '<li class="' + (i < reached ? "done" : "") + '">' + st + '</li>';
        });
        out.innerHTML = '<strong>Order ' + no + '</strong><ul class="track-steps">' + items + '</ul>';
        out.classList.add("show");
    });

    // ---------- PART D: return request / RMA (DEMO) ----------
    const rma = document.getElementById("rmaForm");
    rma.addEventListener("submit", function (e) {
        e.preventDefault();
        const no = document.getElementById("rmaOrder").value.trim().toUpperCase();
        const reason = document.getElementById("rmaReason").value;
        const out = document.getElementById("rmaResult");
        if (!/^JJ-\d{4,8}$/.test(no) || !reason) {
            out.innerHTML = '<span class="err">Enter your order number (like JJ-104582) and choose a reason.</span>';
            out.classList.add("show");
            return;
        }
        // Make a random 6-digit return reference number, e.g. RMA-482915.
        const ref = "RMA-" + Math.floor(100000 + Math.random() * 900000);
        out.innerHTML =
            '<div class="big">' + ref + '</div>' +
            '<div style="margin-top:6px">Return request received for order <strong>' + no + '</strong>.</div>' +
            '<div style="margin-top:6px;color:var(--muted);font-size:13px">Write this RMA number on the outside of the box. We will email the return address and next steps within 1 business day.</div>';
        out.classList.add("show");
        showToast("Return request submitted");
    });
}


// ================================================================
// 10) START-UP (BOOT)
// ----------------------------------------------------------------
// "DOMContentLoaded" fires when the page's HTML has finished loading.
// Only then is it safe to look for elements and fill them in.
// Every function below checks if its section exists on the current
// page, so it is fine that all pages run the same list.
// ================================================================

document.addEventListener("DOMContentLoaded", function () {
  (window.catalogReady || Promise.resolve()).then(function () {

    // --- every page ---
    updateCartBadge();      // show the cart number in the header
    renderPrebuilts();      // prebuilt PC cards (if the page has them)

    // --- home page ---
    renderFlashDeals();

    // --- shop page: draw the grid ---
    renderShopGrid();

    // Category pills (All, CPU, GPU...): clicking one highlights it
    // and refreshes the grid.
    document.querySelectorAll(".pill").forEach(function (pill) {
        pill.addEventListener("click", function () {
            document.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("on"); });
            pill.classList.add("on");
            applySearchAndSort();
        });
    });

    // Live search: on the shop page, filter as the user types.
    const s = document.getElementById("navSearch");
    if (s && document.getElementById("grid")) s.addEventListener("input", applySearchAndSort);
    // Sort menu: refresh the grid when the choice changes.
    const o = document.getElementById("sort");
    if (o) o.addEventListener("change", applySearchAndSort);

    // Read options from the web address, e.g. shop.html?q=ryzen&cat=CPU
    const urlParams = new URLSearchParams(window.location.search);

    // ?q=...  -> pre-fill the search box (when coming from another page)
    const navQ = urlParams.get("q");
    if (navQ !== null) {
        const navBox = document.getElementById("navSearch");
        if (navBox && !navBox.value) navBox.value = navQ;
        if (document.getElementById("grid")) applySearchAndSort();
    }

    // ?cat=... -> open that category on the shop page
    const selectedCat = urlParams.get("cat");
    if (selectedCat) {
        document.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("on"); });
        const matched = document.querySelector('.pill[data-cat="' + selectedCat + '"]');
        if (matched) {
            matched.classList.add("on");
            applySearchAndSort();
        }
    }

    // --- product page ---
    renderProductPage();
    renderAlsoLike();

    // --- cart page ---
    renderCartPage();

    // --- shipping page ---
    initShippingTools();
  });
});
