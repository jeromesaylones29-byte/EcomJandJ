// ================================================================
//  journal.js  --  THE BLOG / JOURNAL PAGE
// ================================================================
//
//  WHAT IS THIS FILE?
//  It powers journal.html: a list of articles with a featured post,
//  category buttons, a search box, a "read article" pop-up window,
//  and a newsletter form.
//
//  TABLE OF CONTENTS:
//     1. THE ARTICLE DATA ........ JOURNAL_POSTS (edit this to add posts)
//     2. HELPERS ................. $(), fmt(), esc(), state, meta()
//     3. DRAWING FUNCTIONS ....... renderFeatured, renderGrid, renderFilters
//     4. READING POP-UP .......... openPost
//     5. START-UP ................ click, search and form actions
//
//  HOW TO ADD A NEW ARTICLE:
//  Copy one { ... } block in JOURNAL_POSTS, paste it at the TOP of
//  the list (the first post is the "Featured" one), and change the
//  text. Don't forget the comma between blocks!
// ================================================================


// ================================================================
// 1) THE ARTICLE DATA
// ----------------------------------------------------------------
// An array (list) written with [ ... ]. Each article is an object
// written with { ... } that has these fields:
//    id      -> unique short name (used to open the right article)
//    date    -> "YYYY-MM-DD"
//    cat     -> category name (becomes a filter button)
//    read    -> minutes to read
//    author  -> who wrote it,  avatar -> author's picture
//    cover   -> big picture
//    title   -> headline,      excerpt -> one-line summary
//    body    -> list of paragraphs (each in quotes)
//    points  -> "Key takeaways" bullet list
// The FIRST article in the list is shown as the FEATURED post.
// ================================================================
var JOURNAL_POSTS = [
  {
    id: "9800x3d-5070ti", date: "2026-09-12", cat: "Build Guides", read: 6,
    author: "Jerome", avatar: "assets/LogOwner/Jerome.jpg",
    cover: "assets/Front img/com3.jpg",
    title: "Ryzen 7 9800X3D + RTX 5070 Ti build guide",
    excerpt: "The exact combo from our featured pre-built, explained part by part.",
    body: [
      "Pair the Ryzen 7 9800X3D with an ROG Strix B850-F, 64GB of 6000MHz DDR5 and a fast NVMe drive, and you get a rig that chews through 1440p gaming and rendering alike.",
      "The 3D V-Cache on the CPU is what makes this combination special in games. It keeps frame times steady in CPU-heavy titles, while the RTX 5070 Ti has the horsepower to run 1440p at high refresh rates and handle entry-level 4K.",
      "The build takes about an hour with a modular PSU and a case with good cable routing. Install the CPU, RAM and cooler on the board first, then mount everything in the case."
    ],
    points: ["Target: 1440p high refresh, light 4K", "Memory: 2 x 32GB DDR5-6000 CL30", "PSU: 850W 80+ Gold, modular"]
  },
  {
    id: "ddr4-vs-ddr5", date: "2026-09-05", cat: "Buying Advice", read: 4,
    author: "Johnny", avatar: "assets/LogOwner/Johnny.jpg",
    cover: "assets/Front img/RAM.jpeg",
    title: "DDR4 vs DDR5: should you upgrade?",
    excerpt: "The memory question everyone asks when buying RAM.",
    body: [
      "If you are building new, DDR5 is the easy pick. It is now barely more expensive than DDR4, and games gain a few percent on average.",
      "If you already own a solid DDR4 board like a B550, an upgrade is not worth a full platform swap just yet. Your money will go further on a better GPU or a faster SSD.",
      "Whichever you choose, buy a matched kit rather than mixing sticks, and check your motherboard manual for the correct slot order."
    ],
    points: ["New build: choose DDR5", "Existing DDR4 board: keep it for now", "Always buy matched kits"]
  },
  {
    id: "air-vs-liquid", date: "2026-08-28", cat: "Build Guides", read: 5,
    author: "Jerome", avatar: "assets/LogOwner/Jerome.jpg",
    cover: "assets/Front img/Cooling System.jpeg",
    title: "Air cooling vs liquid cooling",
    excerpt: "Which one is right for your CPU?",
    body: [
      "For most builds, a good dual-tower air cooler is quieter, cheaper and has nothing to leak. It will also outlast most pumps.",
      "Go with an AIO liquid cooler if you want the clean look, run a high-end CPU under a heavy overclock, or your case is too tight for a tower cooler."
    ],
    points: ["Air: quiet, cheap, reliable", "AIO: cleaner look, better for hot CPUs", "Check radiator and cooler clearance first"]
  },
  {
    id: "choose-a-psu", date: "2026-08-21", cat: "Buying Advice", read: 4,
    author: "Johnny", avatar: "assets/LogOwner/Johnny.jpg",
    cover: "assets/Front img/PSU.jpg",
    title: "How to choose a power supply",
    excerpt: "The one part you should never cheap out on.",
    body: [
      "Buy a certified 80+ Gold unit from a known brand, sized at about 1.5x your estimated power draw. For a 5070 Ti build that works out to 750 to 850W.",
      "Leave headroom for future upgrades. A bad PSU can take other parts down with it, so this is the wrong place to save a few pesos."
    ],
    points: ["80+ Gold or better", "750 to 850W for a 5070 Ti build", "Modular cables make building easier"]
  },
  {
    id: "rtx-5070-ti", date: "2026-08-14", cat: "Reviews & Tech", read: 5,
    author: "Jerome", avatar: "assets/LogOwner/Jerome.jpg",
    cover: "assets/Front img/GPU.JPEG",
    title: "RTX 5070 Ti: worth the upgrade?",
    excerpt: "A quick look at where this card fits in the lineup.",
    body: [
      "The 5070 Ti is a big jump over the previous generation for 1440p and entry-level 4K play.",
      "If you are on a 30-series card, the upgrade is very noticeable. On a 40-series card, you can probably wait one more generation."
    ],
    points: ["Great for 1440p high refresh", "Big upgrade from 30-series", "40-series owners can wait"]
  },
  {
    id: "first-pc-build", date: "2026-08-07", cat: "Beginner Tips", read: 3,
    author: "Johnny", avatar: "assets/LogOwner/Johnny.jpg",
    cover: "assets/Front img/Motherboard.jpeg",
    title: "5 tips for your first PC build",
    excerpt: "A short checklist before you open the boxes.",
    body: [
      "Building your first PC is easier than it looks. Take your time and follow this checklist.",
      "1) Ground yourself before touching parts. 2) Install the CPU, RAM and cooler before the board goes in the case. 3) Check your RAM slot order in the manual. 4) Do a test boot outside the case. 5) Cable management is easier with a modular PSU."
    ],
    points: ["Test boot before final assembly", "Read the motherboard manual", "Keep every box until it works"]
  }
];


// ================================================================
// THE CODE PART
// Wrapped in  (function () { ... })();  so our helper names stay
// private to this file and can't clash with names in app.js.
// (JOURNAL_POSTS above is outside on purpose so it stays global.)
// ================================================================
(function () {

  // ==============================================================
  // 2) HELPERS
  // ==============================================================

  // SHORTCUT: $("abc") = document.getElementById("abc")
  function $(id) { return document.getElementById(id); }

  // FORMAT A DATE:  "2026-09-12"  ->  "Sep 12, 2026"
  // (the "T00:00:00" makes the date use local time, avoiding a
  //  "one day off" bug in some time zones)
  function fmt(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // MAKE TEXT SAFE before putting it inside HTML.
  // It swaps the special characters  & < > "  for harmless codes,
  // so text like "<script>" can't break (or hack) the page.
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // THE PAGE'S CURRENT CHOICES (its "memory"):
  //   cat = which category button is selected ("All" = no filter)
  //   q   = what is typed in the search box
  var state = { cat: "All", q: "" };

  // BUILD THE SMALL INFO LINE under a title:
  //   [photo] Jerome • Sep 12, 2026 • 6 min read
  function meta(p) {
    return '<div class="j-meta"><img src="' + p.avatar + '" alt="">' +
      '<span>' + esc(p.author) + '</span><i></i><span>' + fmt(p.date) + '</span><i></i><span>' + p.read + ' min read</span></div>';
  }


  // ==============================================================
  // 3) DRAWING FUNCTIONS  (each one fills a part of the page)
  // ==============================================================

  // DRAW THE BIG "FEATURED" POST at the top (always the FIRST post).
  function renderFeatured() {
    var p = JOURNAL_POSTS[0];   // [0] = first item in the list
    // data-open="..." stores the article id so that a click (see
    // section 5) knows which article to open.
    $("jFeatured").innerHTML =
      '<button type="button" class="jf-media" data-open="' + p.id + '" aria-label="Read ' + esc(p.title) + '"><img src="' + p.cover + '" alt=""></button>' +
      '<div class="jf-body">' +
        '<span class="j-tag">Featured &middot; ' + esc(p.cat) + '</span>' +
        '<h2>' + esc(p.title) + '</h2>' +
        '<p>' + esc(p.excerpt) + ' ' + esc(p.body[0]) + '</p>' +
        meta(p) +
        '<button type="button" class="btn" data-open="' + p.id + '">Read the guide</button>' +
      '</div>';
  }

  // DRAW THE GRID OF OTHER ARTICLES, respecting category + search.
  function renderGrid() {
    var q = state.q.toLowerCase();

    // slice(1) = every post EXCEPT the first (it's already featured).
    // filter() keeps only posts that pass BOTH checks below.
    var list = JOURNAL_POSTS.slice(1).filter(function (p) {
      // Check 1: matches the chosen category (or "All")?
      var okCat = state.cat === "All" || p.cat === state.cat;
      // Check 2: search box empty, OR the text appears in title/excerpt/category?
      var okQ = !q || (p.title + " " + p.excerpt + " " + p.cat).toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });

    var grid = $("jGrid");

    // Nothing matched -> show a friendly message.
    if (!list.length) {
      grid.innerHTML = '<p class="j-empty">No articles match your search. Try another topic.</p>';
      return;
    }

    // map() turns each article into a piece of HTML,
    // join("") glues all the pieces into one long string.
    grid.innerHTML = list.map(function (p) {
      return '<article class="jpost">' +
        '<button type="button" class="jp-media" data-open="' + p.id + '" aria-label="Read ' + esc(p.title) + '"><img src="' + p.cover + '" alt="" loading="lazy"><span class="j-tag">' + esc(p.cat) + '</span></button>' +
        '<div class="jp-body">' +
          '<h3><button type="button" class="jp-title" data-open="' + p.id + '">' + esc(p.title) + '</button></h3>' +
          '<p>' + esc(p.excerpt) + '</p>' +
          meta(p) +
        '</div></article>';
    }).join("");
  }

  // DRAW THE CATEGORY BUTTONS ("All", "Build Guides", ...).
  // The list is built automatically from the posts, so a new
  // category shows up on its own.
  function renderFilters() {
    var cats = ["All"];
    JOURNAL_POSTS.forEach(function (p) {
      // Add each category only once (-1 means "not in the list yet").
      if (cats.indexOf(p.cat) === -1) cats.push(p.cat);
    });
    $("jFilters").innerHTML = cats.map(function (c) {
      // The selected category gets the extra class "on" (highlighted).
      return '<button type="button" class="pill' + (c === state.cat ? ' on' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join("");
  }


  // ==============================================================
  // 4) READING POP-UP  (the window that shows a full article)
  // ==============================================================

  // OPEN AN ARTICLE by its id, inside the <dialog> pop-up.
  function openPost(id) {
    // Find the article that has this id.
    var p = JOURNAL_POSTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;   // unknown id -> do nothing

    var dlg = $("jDialog");
    // Fill the pop-up: cover, tag, title, info line, paragraphs,
    // key takeaways and a "Shop the parts" button.
    $("jdContent").innerHTML =
      '<img class="jd-cover" src="' + p.cover + '" alt="">' +
      '<div class="jd-body">' +
        '<span class="j-tag solid">' + esc(p.cat) + '</span>' +
        '<h2>' + esc(p.title) + '</h2>' +
        meta(p) +
        // one <p> for each paragraph in body
        p.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join("") +
        '<div class="jd-points"><h4>Key takeaways</h4><ul>' +
          // one <li> for each bullet in points
          p.points.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") +
        '</ul></div>' +
        '<a class="btn" href="shop.html">Shop the parts</a>' +
      '</div>';

    // showModal() opens the pop-up over the page. Very old browsers
    // don't have it, so we fall back to just setting the "open" attribute.
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.scrollTop = 0;   // start reading from the top
  }


  // ==============================================================
  // 5) START-UP  (runs when the page has finished loading)
  // ==============================================================
  document.addEventListener("DOMContentLoaded", function () {

    // Not the journal page? (no #jGrid) -> do nothing.
    if (!$("jGrid")) return;

    // Draw the first version of the page.
    renderFeatured(); renderFilters(); renderGrid();

    // ONE click listener for the WHOLE page ("event delegation").
    // Instead of attaching a listener to every button (they get
    // redrawn often), we listen once and look at what was clicked.
    document.addEventListener("click", function (e) {

      // Did the user click something with data-open (an article)?
      // closest() also catches clicks on an image INSIDE that button.
      var open = e.target.closest("[data-open]");
      if (open) { openPost(open.dataset.open); return; }

      // Did the user click a category button?
      var pill = e.target.closest("#jFilters .pill");
      if (pill) {
        state.cat = pill.dataset.cat;   // remember the choice
        renderFilters();                // re-highlight the buttons
        renderGrid();                   // show matching articles
      }
    });

    // SEARCH BOX: every time the user types, update and redraw the grid.
    $("jSearch").addEventListener("input", function (e) { state.q = e.target.value.trim(); renderGrid(); });

    // CLOSE BUTTON of the pop-up.
    var dlg = $("jDialog");
    $("jdClose").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    // Clicking the dark area OUTSIDE the pop-up box also closes it.
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

    // NEWSLETTER FORM (demo: nothing is really sent).
    $("jNews").addEventListener("submit", function (e) {
      e.preventDefault();   // stop the page from reloading
      var v = $("jNewsEmail").value.trim();
      var note = $("jNewsNote");
      // Not a valid email? Show a red message and stop.
      if (!/^\S+@\S+\.\S+$/.test(v)) { note.textContent = "Please enter a valid email address."; note.className = "form-note err"; return; }
      // Valid -> show a green thank-you message and clear the box.
      note.textContent = "Thanks for subscribing! (Demo: no email is actually sent.)"; note.className = "form-note ok";
      $("jNewsEmail").value = "";
    });
  });
})();
