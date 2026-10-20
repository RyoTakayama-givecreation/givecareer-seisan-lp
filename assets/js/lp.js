document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ 出現アニメーション ============ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      io.unobserve(en.target);
    });
  }, { threshold: .2, rootMargin: "0px 0px -5% 0px" });
  document.querySelectorAll(".rev, .mark").forEach(function (el) { io.observe(el); });
  /* FVはロード直後に必ず表示 */
  document.querySelectorAll(".hero .rev, .hero .mark").forEach(function (el) { el.classList.add("is-visible"); });

  /* ============ スマホ：理由カードは自然な高さのまま、下に重なったカードからはみ出す部分だけクリップ ============ */
  var reasonCards = [
    document.getElementById("reason-1"),
    document.getElementById("reason-2"),
    document.getElementById("reason-3")
  ];
  if (!reasonCards.some(function (card) { return !card; })) {
    var reasonEndMargin = 92;
    var reasonPeek = 24;
    var reasonsListEl = document.querySelector(".reasons-list");
    var syncReasonStackLayout = function () {
      if (innerWidth > 720) {
        reasonCards.forEach(function (card) { card.style.marginBottom = ""; });
        if (reasonsListEl) reasonsListEl.style.marginBottom = "";
        return;
      }
      var heights = reasonCards.map(function (card) { return card.getBoundingClientRect().height; });
      var last = heights.length - 1;
      var endMargin = reasonEndMargin;
      heights.forEach(function (h, i) {
        endMargin = Math.max(endMargin, 24 + h - heights[last] - reasonPeek * (last - i));
      });
      endMargin = Math.round(endMargin);
      reasonCards.forEach(function (card, i) {
        var margin = Math.round(endMargin + reasonPeek * (last - i) + heights[last] - heights[i]);
        card.style.marginBottom = margin + "px";
      });
      if (reasonsListEl) reasonsListEl.style.marginBottom = -endMargin + "px";
    };
    var updateReasonStack = function () {
      if (innerWidth > 720) {
        reasonCards.forEach(function (card) { card.style.clipPath = ""; });
        return;
      }
      var rects = reasonCards.map(function (card) { return card.getBoundingClientRect(); });
      reasonCards.forEach(function (card, i) {
        var visibleBottom = rects[i].bottom;
        for (var j = i + 1; j < rects.length; j++) {
          var safeBottom = rects[j].bottom - 48;
          if (rects[j].top < visibleBottom && safeBottom < visibleBottom) {
            visibleBottom = safeBottom;
          }
        }
        var cut = rects[i].bottom - visibleBottom;
        card.style.clipPath = cut > 0.5 ? "inset(0 0 " + Math.ceil(cut) + "px 0)" : "";
      });
    };
    syncReasonStackLayout();
    updateReasonStack();
    addEventListener("scroll", updateReasonStack, { passive: true });
    addEventListener("resize", function () {
      syncReasonStackLayout();
      updateReasonStack();
    }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        syncReasonStackLayout();
        updateReasonStack();
      });
    }
  }

  /* ============ 理由セクション：現在地＋進捗 ============ */
  var spyLinks = document.querySelectorAll("[data-spy]");
  if (spyLinks.length) {
    var spyIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.toggle("is-current", a.dataset.spy === en.target.id); });
        }
      });
    }, { rootMargin: "-38% 0px -52% 0px" });
    document.querySelectorAll(".reason").forEach(function (el) { spyIo.observe(el); });
    var bar = document.getElementById("reasonsBar");
    var list = document.querySelector(".reasons-list");
    addEventListener("scroll", function () {
      if (!bar || !list) return;
      var r = list.getBoundingClientRect();
      var total = r.height - innerHeight * .5;
      var done = Math.min(Math.max(-r.top + innerHeight * .5, 0), total);
      bar.style.width = (done / total * 100).toFixed(1) + "%";
    }, { passive: true });
  }

  /* ============ 求人タブ ============ */
  var JOBS = {
    "life": [
      {
        "logo": "assets/img/jobs/10656.png",
        "cat": "椿本チエイン",
        "role": "自動化・省人化設備の電気制御設計",
        "loc": "京都",
        "pay": "500–750",
        "tags": [
          "年休124日",
          "PLC設計",
          "残業月10h程度"
        ],
        "note": "休日出勤は大型設備の搬入時に年2〜3回程度。平日搬入が基本で、長期休暇中の出勤はほぼありません。"
      },
      {
        "logo": "assets/img/jobs/10704.gif",
        "cat": "クボタ",
        "role": "新ライン向け設備の生産技術開発",
        "loc": "兵庫",
        "pay": "500–850",
        "tags": [
          "年休125日",
          "1案件2〜4名",
          "残業月25h程度"
        ],
        "note": "1案件2〜4名のチームで担当。祝日工事には代休を取得できます。"
      },
      {
        "logo": "assets/img/jobs/11151.jpeg",
        "cat": "マキタ",
        "role": "組立工程設計・電気制御設計",
        "loc": "愛知",
        "pay": "609–983",
        "tags": [
          "年休129日",
          "設備の一貫担当"
        ],
        "note": "国内主力工場と海外工場の生産性・品質に、構想から成果まで一貫して関われます。"
      },
      {
        "logo": "assets/img/jobs/10730.jpeg",
        "cat": "ダイハツ工業",
        "role": "次世代車両の工法開発（接合・プレス）",
        "loc": "大阪",
        "pay": "550–1000",
        "tags": [
          "年休121日",
          "在宅一部可",
          "転勤ほぼなし"
        ],
        "note": "残業は月20〜30時間。軽量化に向けた上流の工法開発に挑戦できます。"
      },
      {
        "logo": "assets/img/jobs/11255.jpeg",
        "cat": "小糸製作所",
        "role": "生産技術",
        "loc": "静岡",
        "pay": "470–750",
        "tags": [
          "年休121日",
          "安全教育3日間",
          "独り立ちまで約1年"
        ],
        "note": "配属後は各グループを理解する期間があり、独り立ちまで先輩がフォローします。"
      }
    ],
    "skill": [
      {
        "logo": "assets/img/jobs/11365.jpeg",
        "cat": "神戸製鋼所",
        "role": "生産技術開発・プロセス改善",
        "loc": "兵庫",
        "pay": "614–1092",
        "tags": [
          "年休121日",
          "チーム内ローテ",
          "海外拠点あり"
        ],
        "note": "要素技術・生産改善・生産開発・海外拠点などのキャリア例を提示しています。"
      },
      {
        "logo": "assets/img/jobs/11174.jpeg",
        "cat": "住友電装",
        "role": "自動車用端子の製造設備・金型開発",
        "loc": "三重",
        "pay": "550–950",
        "tags": [
          "年休121日",
          "社宅・寮あり",
          "研修センター"
        ],
        "note": "設備・金型の開発を担当。生産技術や設備保全の経験は歓迎されます。"
      },
      {
        "logo": "assets/img/jobs/11177.jpeg",
        "cat": "IHI",
        "role": "航空・ロケットエンジン部品の特殊工程開発",
        "loc": "神奈川",
        "pay": "600–1050",
        "tags": [
          "年休125日",
          "新素材CMC",
          "専門家コース"
        ],
        "note": "先端材料に触れながら、専門家・リーダーのキャリアや海外技術交流も描けます。"
      },
      {
        "logo": "assets/img/jobs/11543.png",
        "cat": "日本電子",
        "role": "理科学機器の電気系生産技術",
        "loc": "東京",
        "pay": "410–770",
        "tags": [
          "年休129日",
          "治具・自動化",
          "検査品質"
        ],
        "note": "電気・ソフト・機構を融合した治具や自動化、データ活用で検査品質と効率を高めます。"
      },
      {
        "logo": "assets/img/jobs/11496.jpeg",
        "cat": "MARUWA",
        "role": "設備技術（改善・保守・新規導入）",
        "loc": "岐阜",
        "pay": "580–990",
        "tags": [
          "年休125日",
          "新規設備導入",
          "AI/DX"
        ],
        "note": "保守にとどまらず、新機構・工法やAI/DXを取り入れたライン構築にも関われます。"
      }
    ],
    "dx": [
      {
        "logo": "assets/img/jobs/10885.jpeg",
        "cat": "オムロン",
        "role": "製造DXのソリューションアーキテクト",
        "loc": "京都/東京",
        "pay": "650–1000",
        "tags": [
          "年休125日",
          "新規事業",
          "MES/ERP"
        ],
        "note": "生産技術・工場SEの経験を、他社にも提供する製造DXソリューションへ活かせます。"
      },
      {
        "logo": "assets/img/jobs/11289.jpeg",
        "cat": "日立ハイテク",
        "role": "生産技術DXエンジニア（ロボット）",
        "loc": "東京/茨城",
        "pay": "694–1000",
        "tags": [
          "年休126日",
          "週4出社・週1在宅",
          "研究開発へも"
        ],
        "note": "リーダー・管理職、研究開発、生産技術など、本人の希望に応じたキャリア設計が可能です。"
      },
      {
        "logo": "assets/img/jobs/11546.png",
        "cat": "積水化学工業",
        "role": "工場DXを推進する設備設計",
        "loc": "滋賀",
        "pay": "600–1000",
        "tags": [
          "年休125日",
          "在宅週1〜2回",
          "教育制度充実"
        ],
        "note": "生産ライン・レイアウト設計に、データ活用を掛け合わせます。階層別・グローバル研修あり。"
      },
      {
        "logo": "assets/img/jobs/11138.jpeg",
        "cat": "コニカミノルタ",
        "role": "化学プロセスの自動化・安全を支える生産技術",
        "loc": "東京",
        "pay": "600–850",
        "tags": [
          "年休125日",
          "リモート一部可",
          "化学未経験可"
        ],
        "note": "構想・設計から導入・立上げ・改善まで一貫して関われます。"
      },
      {
        "logo": "assets/img/jobs/11356.png",
        "cat": "ダイキン工業",
        "role": "生産技術（プリント基板生産工場革新）",
        "loc": "滋賀",
        "pay": "500–900",
        "tags": [
          "年休124日",
          "IoT・AI・自動化",
          "海外展開"
        ],
        "note": "実装ライン構築や、材料・工法・設備の標準化と海外展開を担当します。"
      }
    ],
    "secret": [
      {
        "logo": "",
        "cat": "大手自動車メーカー（非公開）",
        "role": "次世代EV工場の生産技術（技術専門職コース）",
        "loc": "東海",
        "pay": "800–1200",
        "tags": [
          "年休128日",
          "勤務地限定",
          "残業月15h以内",
          "在宅週2"
        ],
        "note": "専門職として昇格できる評価制度。休日工事は事前計画と代休が原則で、突発対応は輪番制です。"
      },
      {
        "logo": "",
        "cat": "外資系半導体製造装置メーカー（非公開）",
        "role": "装置立上げ・プロセスエンジニア",
        "loc": "九州",
        "pay": "750–1100",
        "tags": [
          "年休130日",
          "完全週休2日",
          "海外技術移管",
          "転勤なし"
        ],
        "note": "PLC・ロボット・データ分析を研修から実機導入まで経験。国内に腰を据えて、海外拠点を技術面で支えます。"
      },
      {
        "logo": "",
        "cat": "大手電機メーカー（非公開）",
        "role": "工場DX推進（生産技術）",
        "loc": "関東",
        "pay": "700–1000",
        "tags": [
          "年休125日",
          "フレックス",
          "在宅週3",
          "社内公募あり"
        ],
        "note": "解析・設計・資料作成は在宅、立上げ・現物確認は現場。改善提案を自分で実行できる裁量があります。"
      }
    ]
  };
  /* ============ 求人スワイパー：公開求人の間に非公開求人を混ぜ、中央は非公開から表示 ============ */
  var ALL = [].concat(JOBS.life, JOBS.skill, JOBS.dx);
  function byCat(name) { return ALL.filter(function (j) { return j.cat === name; })[0]; }
  var SEC = JOBS.secret;
  var ORDER = [
    byCat("椿本チエイン"), byCat("クボタ"), byCat("日立ハイテク"), SEC[0],
    byCat("神戸製鋼所"), byCat("オムロン"), byCat("マキタ"), SEC[1],
    byCat("ダイハツ工業"), byCat("積水化学工業"), byCat("IHI"), SEC[2],
    byCat("ダイキン工業"), byCat("日本電子"), byCat("コニカミノルタ")
  ].filter(Boolean);
  var swiper = document.getElementById("jobsGrid");
  var jobsPrev = document.getElementById("jobsPrev");
  var jobsNext = document.getElementById("jobsNext");
  var jobsCount = document.getElementById("jobsCount");
  if (swiper) {
    swiper.innerHTML = ORDER.map(function (j) {
      var head = j.logo
        ? '<div class="job-head"><span class="job-logo"><img src="' + j.logo + '" alt="' + j.cat + '" loading="lazy"></span><small>' + j.cat + '</small></div>'
        : '<div class="job-head"><span class="job-logo job-logo--lock" aria-hidden="true">非公開</span><small>' + j.cat + '</small></div>';
      return '<article class="job' + (j.logo ? '' : ' job--secret') + '">'
        + head
        + '<h3>' + j.role + '</h3>'
        + '<p class="salary"><span class="num">' + j.pay + '</span><span class="unit">万円</span><span class="job-loc">' + j.loc + '</span></p>'
        + '<div class="job-tags">' + j.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + '</div>'
        + '<p>' + j.note + '</p>'
        + '</article>';
    }).join("");
    var jobCards = Array.from(swiper.querySelectorAll(".job"));
    var centerIdx = Math.floor(jobCards.length / 2);
    var jobIdx = centerIdx;
    function jobCenterLeft(i) {
      var c = jobCards[i];
      return c.offsetLeft - (swiper.clientWidth - c.offsetWidth) / 2;
    }
    function markActive() {
      var mid = swiper.scrollLeft + swiper.clientWidth / 2, best = 0, bestD = 1e9;
      jobCards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      jobIdx = best;
      jobCards.forEach(function (c, i) { c.classList.toggle("is-active", i === best); });
      if (jobsCount) jobsCount.innerHTML = '<b>' + String(best + 1).padStart(2, "0") + '</b> / ' + String(jobCards.length).padStart(2, "0");
      if (jobsPrev) jobsPrev.disabled = best <= 0;
      if (jobsNext) jobsNext.disabled = best >= jobCards.length - 1;
    }
    function goJob(i, instant) {
      jobIdx = Math.min(jobCards.length - 1, Math.max(0, i));
      swiper.scrollTo({ left: jobCenterLeft(jobIdx), behavior: instant || reduceMotion ? "auto" : "smooth" });
    }
    var jobTick = false;
    swiper.addEventListener("scroll", function () {
      if (jobTick) return;
      jobTick = true;
      requestAnimationFrame(function () { jobTick = false; markActive(); });
    }, { passive: true });
    if (jobsPrev) jobsPrev.addEventListener("click", function () { goJob(jobIdx - 1); });
    if (jobsNext) jobsNext.addEventListener("click", function () { goJob(jobIdx + 1); });
    jobCards.forEach(function (c, i) { c.addEventListener("click", function () { if (!dragMoved && i !== jobIdx) goJob(i); }); });
    /* マウスドラッグ（タッチは標準スクロール） */
    var dragging = false, dragMoved = false, dragX = 0, dragLeft = 0;
    swiper.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      dragging = true; dragMoved = false; dragX = e.clientX; dragLeft = swiper.scrollLeft;
    });
    addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - dragX;
      if (Math.abs(dx) > 4 && !dragMoved) { dragMoved = true; swiper.classList.add("is-dragging"); }
      if (dragMoved) swiper.scrollLeft = dragLeft - dx;
    });
    addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false;
      if (dragMoved) {
        swiper.classList.remove("is-dragging");
        goJob(jobIdx);
        setTimeout(function () { dragMoved = false; }, 0);
      }
    });
    var jobsInit = function () { goJob(centerIdx, true); markActive(); };
    jobsInit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(jobsInit);
    addEventListener("resize", function () { goJob(jobIdx, true); markActive(); }, { passive: true });
  }

  /* ============ アドバイザー：手動カルーセル(矢印・ドット・スワイプ。自動送りなし) ============ */
  var advisersCarousel = document.querySelector(".advisers-grid");
  var advisersPrev = document.getElementById("advisersPrev");
  var advisersNext = document.getElementById("advisersNext");
  var advisersDots = document.getElementById("advisersDots");
  if (advisersCarousel && advisersPrev && advisersNext && advisersDots) {
    var adviserCards = Array.from(advisersCarousel.querySelectorAll(".adviser"));
    var adviserIndex = 0;
    var adviserPages = 1;

    function adviserStep() {
      if (!adviserCards.length) return 0;
      return adviserCards[0].getBoundingClientRect().width + 18;
    }
    function adviserVisibleCount() {
      var stepWidth = adviserStep();
      return stepWidth ? Math.max(1, Math.round((advisersCarousel.clientWidth + 18) / stepWidth)) : 1;
    }
    function adviserName(card) {
      var h = card.querySelector(".adviser-name h3");
      return h && h.firstChild ? h.firstChild.textContent.trim() : "";
    }
    function buildAdviserDots() {
      adviserPages = Math.max(1, adviserCards.length - adviserVisibleCount() + 1);
      adviserIndex = Math.min(adviserIndex, adviserPages - 1);
      advisersDots.innerHTML = "";
      adviserCards.forEach(function (card, i) {
        var seg = document.createElement("button");
        seg.type = "button";
        seg.setAttribute("aria-label", (adviserName(card) || (i + 1) + "人目") + "を表示");
        seg.dataset.index = String(i);
        seg.addEventListener("click", function () { goToAdviser(Number(this.dataset.index)); });
        advisersDots.appendChild(seg);
      });
      updateAdviserDots();
    }
    function updateAdviserDots() {
      var visible = adviserVisibleCount();
      advisersDots.querySelectorAll("button").forEach(function (seg, i) {
        seg.classList.toggle("is-active", i >= adviserIndex && i < adviserIndex + visible);
      });
      advisersPrev.disabled = adviserIndex <= 0;
      advisersNext.disabled = adviserIndex >= adviserPages - 1;
    }
    function goToAdviser(index) {
      adviserIndex = Math.min(adviserPages - 1, Math.max(0, index));
      advisersCarousel.scrollTo({ left: adviserIndex * adviserStep(), behavior: reduceMotion ? "auto" : "smooth" });
      updateAdviserDots();
    }
    advisersPrev.addEventListener("click", function () { goToAdviser(adviserIndex - 1); });
    advisersNext.addEventListener("click", function () { goToAdviser(adviserIndex + 1); });
    advisersCarousel.addEventListener("scroll", function () {
      var stepWidth = adviserStep();
      if (!stepWidth) return;
      adviserIndex = Math.min(adviserPages - 1, Math.max(0, Math.round(advisersCarousel.scrollLeft / stepWidth)));
      updateAdviserDots();
    }, { passive: true });
    addEventListener("resize", buildAdviserDots);
    buildAdviserDots();
  }

  /* ============ モバイル固定CTA：ヒーローCTA通過後に出現・フォーム表示中は隠す ============ */
  var stickyBar = document.querySelector(".sticky-cta");
  var heroCtaEl = document.querySelector(".hero-cta");
  var formSection = document.getElementById("entry");
  if (stickyBar && heroCtaEl && formSection) {
    var heroCtaPassed = false;
    var formInView = false;
    var updateStickyBar = function () {
      stickyBar.classList.toggle("is-shown", heroCtaPassed && !formInView);
    };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        heroCtaPassed = !en.isIntersecting && en.boundingClientRect.top < 0;
      });
      updateStickyBar();
    }).observe(heroCtaEl);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { formInView = en.isIntersecting; });
      updateStickyBar();
    }).observe(formSection);
  }
});
