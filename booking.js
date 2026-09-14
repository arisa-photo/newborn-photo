/* 予約フォーム選択モーダル ＋ FAB表示制御（全ページ共通） */
(function () {
  var FORMS = [
    { name: "ニューボーンフォト", url: "newborn-booking.html" },
    { name: "マタニティフォト", url: "https://friendly-pudding-f16.notion.site/2e5e9930523b804cb512e67c7d5b98cb?pvs=105" },
    { name: "お宮参り", url: "https://friendly-pudding-f16.notion.site/2e5e9930523b80dbb3f1d70336d7ef40?pvs=105" },
    { name: "アニバーサリー", url: "https://friendly-pudding-f16.notion.site/2e5e9930523b8108b4eef72567890280?pvs=105" }
  ];

  var arrow = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var ov = document.createElement("div");
  ov.className = "book-overlay";
  ov.innerHTML =
    '<div class="book-card" role="dialog" aria-modal="true" aria-label="予約フォームを選ぶ">' +
      '<button class="book-close" type="button" aria-label="閉じる">&times;</button>' +
      '<span class="eyebrow">Reservation</span>' +
      '<h2>ご希望の撮影を選ぶ</h2>' +
      '<p class="book-note">選んだメニューの予約フォームが開きます</p>' +
      '<div class="book-options">' +
        FORMS.map(function (f) {
          var ext = /^https?:/.test(f.url);
          return '<a class="book-option" href="' + f.url + '"' + (ext ? ' target="_blank" rel="noreferrer"' : "") + "><span>" + f.name + "</span>" + arrow + "</a>";
        }).join("") +
      "</div>" +
    "</div>";
  document.body.appendChild(ov);

  function open() {
    ov.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function close() {
    ov.classList.remove("show");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".js-book");
    if (trigger) { e.preventDefault(); open(); return; }
    if (e.target === ov || e.target.closest(".book-close")) { close(); return; }
    if (e.target.closest(".book-option")) { setTimeout(close, 120); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && ov.classList.contains("show")) close();
  });

  /* ハンバーガーメニュー内のリンクを押したらメニューを閉じる */
  var navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (!navToggle.checked) return; // PCなど：メニュー未展開時は通常動作
        var href = a.getAttribute("href");
        var samePageAnchor = href && href.charAt(0) === "#";
        navToggle.checked = false; // 閉じるアニメーションを開始
        if (!samePageAnchor && href) {
          // 別ページへ移動するリンクは、閉じるアニメーションを見せてから遷移
          e.preventDefault();
          setTimeout(function () { window.location.href = href; }, 340);
        }
      });
    });
  }

  /* 右下ボタンの表示制御（全ページ共通）
     - コンセプト以降で表示（ヒーロー内は非表示。コンセプトが無いページは常に対象）
     - CONTACTの予約ボタンが画面内にある間は非表示 */
  var fab = document.querySelector(".fab");
  var concept = document.querySelector(".message");
  var contactBook = document.querySelector(".cta .js-book") || document.querySelector("#contact");
  if (fab) {
    // 予約FABが隠れている（＝CONTACTの予約ボタンが見えている）ときに出す「TOPへ戻る」ボタン
    var fabTop = document.createElement("button");
    fabTop.type = "button";
    fabTop.className = "fab-top";
    fabTop.setAttribute("aria-label", "ページの先頭へ戻る");
    fabTop.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6M6 12l6-6 6 6"/></svg><span>TOPへ戻る</span>';
    fabTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(fabTop);

    var updateFab = function () {
      var afterConcept = concept ? (concept.getBoundingClientRect().top <= window.innerHeight * 0.4) : true;
      var contactVisible = false;
      if (contactBook) {
        var r = contactBook.getBoundingClientRect();
        contactVisible = r.top < window.innerHeight && r.bottom > 0;
      }
      fab.classList.toggle("fab-hidden", !(afterConcept && !contactVisible));
      fabTop.classList.toggle("fab-top-show", contactVisible);
    };
    window.addEventListener("scroll", updateFab, { passive: true });
    window.addEventListener("resize", updateFab);
    updateFab();
  }
})();

/* 上品なスクロールアニメーション（下からふわっとフェードイン） */
(function () {
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    var sel = ".section-title,.pf-heading,.plan,.service,.intro-card,.info-card,.goods-card,.goods-image,.goods-content,.step,.pose-item,.portfolio-item,.story-carousel,.profile-table,.pf-message,.hero-card,.faq details";
    var els = [].slice.call(document.querySelectorAll(sel));
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) return; // 既に画面内のものはアニメなし（チラつき防止）
      var p = el.parentElement;
      if (p) {
        var sibs = [].slice.call(p.children).filter(function (c) { return c.matches && c.matches(sel); });
        var i = sibs.indexOf(el);
        if (i > 0) el.style.transitionDelay = (Math.min(i, 3) * 0.09) + "s";
      }
      el.classList.add("reveal");
      io.observe(el);
    });
  } catch (err) {
    try { document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); }); } catch (e) {}
  }
})();
