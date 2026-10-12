/* ==========================================================
   Shubharambha Consumer Society Shoppee — interactions
   Edit the CONFIG block to change the number / WhatsApp text.
   ========================================================== */
(function () {
  'use strict';

  var CONFIG = {
    phone: '9067755121',
    whatsappBase: 'https://wa.me/919067755121'
  };

  var waLink = function (message) {
    return CONFIG.whatsappBase + '?text=' + encodeURIComponent(message);
  };
  var contactMessage = function (subject) {
    return 'Hello Shubharambha Consumer Society Shoppee, I would like to ask about ' + subject +
      '. Please share current availability, pricing and applicable terms.';
  };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menu-toggle');
  var menu = $('#mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Category "ask" buttons: select + smooth-scroll to contact ---------- */
  var status = $('#category-status');
  $$('[data-category]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (status) status.textContent = 'Selected category: ' + btn.getAttribute('data-category-title');
      window.setTimeout(function () {
        var contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'smooth' });
      }, 30);
    });
  });

  /* ---------- Offer modal ---------- */
  var modal = $('#offer-modal');
  var lastFocus = null;
  function openModal(btn) {
    lastFocus = btn;
    $('#offer-modal-title').textContent = btn.getAttribute('data-offer-title');
    $('#offer-modal-text').textContent = btn.getAttribute('data-offer-text');
    $('#modal-whatsapp').setAttribute('href', waLink(
      'Hello Shubharambha Consumer Society Shoppee, I am interested in ' +
      btn.getAttribute('data-offer-subject') +
      '. Please share current price, availability and applicable terms.'
    ));
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    $('#modal-close').focus();
  }
  function hideModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
  function closeModal() {
    hideModal();
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-offer-title]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn); });
  });
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-whatsapp').addEventListener('click', hideModal);
  $$('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', hideModal);
  });
  // Close on backdrop click / Escape
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  /* ---------- "What are you shopping for today?" ---------- */
  var CHOICE_ON = 'border-[#193153] bg-[#193153] text-[#fffbea]';
  var CHOICE_OFF = 'border-[#193153]/25 bg-[#fffbea]/60 text-[#193153]';
  var CHOICE_BASE = 'choice-btn rounded-xl border-2 p-3 text-left text-xs font-bold transition-transform hover:-translate-y-0.5 ';
  var choiceBtns = $$('.choice-btn');
  choiceBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      choiceBtns.forEach(function (b) {
        var on = b === btn;
        b.className = CHOICE_BASE + (on ? CHOICE_ON : CHOICE_OFF);
        b.setAttribute('aria-pressed', String(on));
      });
      $('#choice-title').textContent = btn.getAttribute('data-choice-label');
      $('#choice-whatsapp').setAttribute('href', waLink(contactMessage(btn.getAttribute('data-choice-subject'))));
    });
  });

  /* ---------- Deal finder ---------- */
  var DEAL_ON = 'border-[#f6c84b] bg-[#f6c84b] font-bold text-[#193153]';
  var DEAL_OFF = 'border-[#fffbea2b] text-[#fffbea]/80 hover:border-[#b3ec36]';
  var DEAL_BASE = 'deal-btn flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ';
  var dealBtns = $$('.deal-btn');
  dealBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      dealBtns.forEach(function (b) {
        var on = b === btn;
        b.className = DEAL_BASE + (on ? DEAL_ON : DEAL_OFF);
        b.setAttribute('aria-pressed', String(on));
        $('.deal-check', b).classList.toggle('hidden', !on);
        $('.deal-arrow', b).classList.toggle('hidden', on);
      });
      var name = btn.getAttribute('data-deal');
      $('#deal-name').textContent = name;
      $('#deal-whatsapp').setAttribute('href', waLink(
        'Hello, I am looking for ' + name.toLowerCase() + '. Please share today’s available offers.'
      ));
    });
  });

  /* ---------- FAQ accordion (one open at a time, click again to close) ---------- */
  var faqBtns = $$('.faq-btn');
  function setFaq(btn, open) {
    var answer = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    if (open) answer.removeAttribute('hidden'); else answer.setAttribute('hidden', '');
    $('.faq-up', btn).classList.toggle('hidden', !open);
    $('.faq-down', btn).classList.toggle('hidden', open);
  }
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqBtns.forEach(function (b) { setFaq(b, false); });
      if (!wasOpen) setFaq(btn, true);
    });
  });

  /* ---------- Plan section: pick a step / level, then ask on WhatsApp ---------- */
  var planBtns = $$('.plan-pick');
  var planLabel = $('#plan-selected');
  var planWa = $('#plan-whatsapp');
  planBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      planBtns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-pressed', String(on));
        var row = b.closest('.plan-row');
        if (row) row.classList.toggle('is-active', on);
      });
      if (planLabel) planLabel.textContent = btn.getAttribute('data-plan-label');
      if (planWa) planWa.setAttribute('href', waLink(contactMessage(btn.getAttribute('data-plan-subject'))));
    });
  });
  /* ---------- Mobile menu: close on outside tap, Escape and resize ---------- */
  function closeMenu() {
    if (!menu || !menuBtn || menu.hasAttribute('hidden')) return;
    menu.setAttribute('hidden', '');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', function (e) {
    if (menu && menuBtn && !menu.hasAttribute('hidden') &&
        !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024) closeMenu(); });

  /* ---------- Mobile swipe carousels: dot indicators ----------
     The carousels themselves are pure CSS (see "MOBILE LAYER" in styles.css);
     the dots are hidden on desktop by CSS. */
  $$('.m-carousel').forEach(function (track) {
    var kids = Array.prototype.slice.call(track.children);
    if (kids.length < 2) return;
    var dots = document.createElement('div');
    dots.className = 'm-dots';
    dots.setAttribute('aria-hidden', 'true');
    var dotEls = kids.map(function () {
      var d = document.createElement('span');
      dots.appendChild(d);
      return d;
    });
    track.parentNode.insertBefore(dots, track.nextSibling);

    var ticking = false;
    function update() {
      ticking = false;
      var max = track.scrollWidth - track.clientWidth;
      var idx = max > 4 ? Math.round((track.scrollLeft / max) * (kids.length - 1)) : 0;
      dotEls.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    track.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
