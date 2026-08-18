(function () {
  "use strict";

  var state = {
    data: null,
    flatItems: [], // {number, title, caption, chapterRoman, chapterTitle}
    currentIndex: -1,
  };

  function paragraphs(text) {
    return text
      .split(/\n\n+/)
      .map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; })
      .join("");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  fetch("content.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      state.data = data;
      buildFrontMatter(data);
      buildContentsNav(data);
      buildChapters(data);
      wireLightbox();
      wireContentsPanel();
      observeReveals();
    })
    .catch(function (err) {
      console.error("Failed to load content.json", err);
      document.getElementById("chapters").innerHTML =
        '<p style="padding:40px;color:#e8875c;font-family:sans-serif;">Could not load content.json &mdash; make sure you\'re serving this folder (not opening index.html directly), or that content.json sits alongside index.html.</p>';
    });

  function buildFrontMatter(data) {
    document.getElementById("forewordText").innerHTML = escapeHtml(data.foreword);
    document.getElementById("introductionText").innerHTML = paragraphs(data.introduction);
  }

  function buildContentsNav(data) {
    var listEl = document.getElementById("contentsList");
    var tocEl = document.getElementById("tocList");
    data.sections.forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#chapter-" + s.roman;
      a.innerHTML =
        '<span class="cl-roman">' + s.roman + "</span>" +
        '<span class="cl-title">' + escapeHtml(s.title) + "</span>" +
        '<span class="cl-count">' + s.items.length + "</span>";
      li.appendChild(a);
      listEl.appendChild(li);

      var tocLi = document.createElement("li");
      var tocA = document.createElement("a");
      tocA.href = "#chapter-" + s.roman;
      tocA.innerHTML =
        '<span class="toc-roman">' + s.roman + "</span>" +
        '<span class="toc-title">' + escapeHtml(s.title) + "</span>" +
        '<span class="toc-count">' + s.items.length + (s.items.length === 1 ? " piece" : " pieces") + "</span>";
      tocLi.appendChild(tocA);
      tocEl.appendChild(tocLi);
    });
  }

  function buildChapters(data) {
    var container = document.getElementById("chapters");
    var flat = [];

    data.sections.forEach(function (s) {
      var solemn = s.roman === "VI";
      var section = document.createElement("section");
      section.className = "chapter" + (solemn ? " chapter--solemn" : "");
      section.id = "chapter-" + s.roman;

      var head = document.createElement("div");
      head.className = "chapter-head";
      head.innerHTML =
        '<div class="chapter-head-inner">' +
          '<p class="chapter-roman">Chapter ' + s.roman + "</p>" +
          '<h2 class="chapter-title">' + escapeHtml(s.title) + "</h2>" +
          '<div class="chapter-intro">' + paragraphs(s.intro) + "</div>" +
        "</div>";
      section.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "item-grid";

      s.items.forEach(function (it) {
        var globalIndex = flat.length;
        flat.push({
          number: it.number,
          title: it.title,
          caption: it.caption,
          chapterRoman: s.roman,
          chapterTitle: s.title,
        });

        var card = document.createElement("button");
        card.className = "item-card";
        card.type = "button";
        card.setAttribute("data-index", globalIndex);
        card.innerHTML =
          '<span class="item-card-img-wrap">' +
            '<img src="images/thumbs/' + it.number + '.jpg" alt="' + escapeHtml(it.title) + '" loading="lazy">' +
          "</span>" +
          '<span class="item-card-label">' +
            '<span class="item-card-number">No. ' + it.number + "</span>" +
            '<span class="item-card-title">' + escapeHtml(it.title) + "</span>" +
          "</span>";
        card.addEventListener("click", function () {
          openLightbox(globalIndex);
        });
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });

    state.flatItems = flat;
  }

  /* ---------------- Lightbox ---------------- */

  function wireLightbox() {
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxScrim").addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
    document.getElementById("lbNext").addEventListener("click", function () { step(1); });

    document.addEventListener("keydown", function (e) {
      var lb = document.getElementById("lightbox");
      if (lb.hasAttribute("hidden")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  function openLightbox(index) {
    state.currentIndex = index;
    renderLightbox();
    var lb = document.getElementById("lightbox");
    lb.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    document.getElementById("lightbox").setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function step(delta) {
    var n = state.flatItems.length;
    state.currentIndex = (state.currentIndex + delta + n) % n;
    renderLightbox();
  }

  function renderLightbox() {
    var it = state.flatItems[state.currentIndex];
    if (!it) return;
    var img = document.getElementById("lbImage");
    img.src = "images/full/" + it.number + ".jpg";
    img.alt = it.title;
    document.getElementById("lbChapter").textContent = "Chapter " + it.chapterRoman + " \u2014 " + it.chapterTitle;
    document.getElementById("lbNumber").textContent = "No. " + it.number;
    document.getElementById("lbTitle").textContent = it.title;
    document.getElementById("lbStory").innerHTML = paragraphs(it.caption);
    document.querySelector(".lb-card").scrollTop = 0;
  }

  /* ---------------- Contents panel (mobile/desktop drawer) ---------------- */

  function wireContentsPanel() {
    var toggle = document.getElementById("contentsToggle");
    var panel = document.getElementById("contentsPanel");
    var scrim = document.getElementById("contentsScrim");

    function open() {
      panel.removeAttribute("hidden");
      scrim.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      panel.setAttribute("hidden", "");
      scrim.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      if (panel.hasAttribute("hidden")) open(); else close();
    });
    scrim.addEventListener("click", close);
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hasAttribute("hidden")) close();
    });
  }

  /* ---------------- Scroll reveal ---------------- */

  function observeReveals() {
    var cards = document.querySelectorAll(".item-card");
    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (c) { c.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );
    cards.forEach(function (c) { io.observe(c); });
  }
})();
