/*
 * Fills the template from window.CONFIG (config.js).
 * Runs synchronously at the end of <body>, before the deferred animation
 * scripts initialise, so they see the final markup.
 */
(function () {
  'use strict';
  var C = window.CONFIG;
  if (!C) return;

  var TZ = 'Asia/Kolkata';
  var toDate = function (s) { return new Date(s + ':00+05:30'); };
  var fmt = function (d, opts) {
    return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: TZ }, opts)).format(d);
  };
  var dateLabel = function (d) {
    // e.g. "Thu, 26 Nov 2026"
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      .formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
    return p.weekday + ', ' + p.day + ' ' + p.month + ' ' + p.year;
  };
  var timeLabel = function (d) {
    return fmt(d, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?(am|pm)/i, function (m) { return ' ' + m.trim().toUpperCase(); });
  };
  var gcal = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var wedding = toDate(C.wedding);
  var vars = {
    groomName: C.groom.name,
    brideName: C.bride.name,
    groomInitial: C.groom.name.charAt(0),
    brideInitial: C.bride.name.charAt(0),
    weddingDate: dateLabel(wedding),
    weddingTime: timeLabel(wedding),
    countdown: wedding.toISOString(),
    venueName: C.venue.name,
    venueShort: C.venue.short || C.venue.name,
    venueAddress: C.venue.address,
    mapUrl: C.venue.mapUrl,
    venueImage: C.venue.image,
    groomPhoto: C.groom.photo,
    bridePhoto: C.bride.photo,
  };
  var fill = function (s) {
    return s.replace(/\{\{(\w+)\}\}/g, function (m, k) { return k in vars ? vars[k] : m; });
  };

  // 1. {{tokens}} in text nodes and attributes.
  document.title = fill(document.title);
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue.indexOf('{{') !== -1) n.nodeValue = fill(n.nodeValue);
  }
  document.querySelectorAll('*').forEach(function (el) {
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.value.indexOf('{{') !== -1) a.value = fill(a.value);
    }
  });

  document.querySelectorAll('[data-cfg-src]').forEach(function (img) {
    var v = vars[img.getAttribute('data-cfg-src')];
    if (v && img.getAttribute('src') !== v) img.src = v;
  });

  // 2. Event calendar: contents list + one spread per event.
  var ICON_CLOCK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b3a4b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  var ICON_PIN = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b3a4b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICON_NAV = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>';
  var ICON_CAL = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M19 16v6"/><path d="M16 19h6"/></svg>';
  var F_SANS = "font-family:'Quicksand', sans-serif";

  var contents = document.querySelector('[data-cfg-contents]');
  var slot = document.getElementById('cfg-event-pages');
  if (contents && slot) {
    var listHtml = '';
    var pagesHtml = '';
    C.events.forEach(function (ev, i) {
      var start = toDate(ev.start);
      var end = new Date(start.getTime() + (ev.durationHours || 2) * 3600e3);
      var dLabel = dateLabel(start);
      var tLabel = ev.timeLabel || (timeLabel(start) + ' onwards');
      var prev = i === 0 ? 'Close' : 'Previous';
      var corners =
        '<button type="button" class="im-flipcal__corner im-flipcal__corner--prev" data-flipcal-go="-1"><span aria-hidden="true">&lsaquo;</span> ' + prev + '</button>' +
        '<button type="button" class="im-flipcal__corner im-flipcal__corner--next" data-flipcal-go="1">Next <span aria-hidden="true">&rsaquo;</span></button>';
      var cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(ev.name + ' — ' + C.groom.name + ' & ' + C.bride.name) +
        '&details=' + encodeURIComponent(ev.note || '') +
        '&location=' + encodeURIComponent(C.venue.name + ', ' + C.venue.address) +
        '&ctz=Asia%2FKolkata&dates=' + gcal(start) + '/' + gcal(end);

      listHtml +=
        '<li><span class="im-flipcal__contents-name">' + esc(ev.name) + '</span>' +
        '<span class="im-flipcal__contents-dots" aria-hidden="true"></span>' +
        '<span class="im-flipcal__contents-date">' + esc(dLabel) + '</span></li>';

      pagesHtml +=
        '<div class="im-flipcal__page im-flipcal__page--left" data-flipcal-page>' + corners +
          '<div class="im-flipcal__face"><div class="im-flipcal__content" data-flipcal-content>' +
            '<span class="im-flipcal__flourish" aria-hidden="true">&#10086;</span>' +
            '<p class="im-flipcal__card-eyebrow" style="font-size:13px;' + F_SANS + ';font-weight:600;color:#6b4434">Event · ' + String(i + 1).padStart(2, '0') + '</p>' +
            '<div class="im-flipcal__media"><img class="im-flipcal__image" src="' + esc(ev.image) + '" alt="' + esc(ev.name) + '" decoding="async"></div>' +
            '<p class="im-flipcal__note" style="font-size:17px;font-family:\'Cormorant Garamond\', serif;font-weight:400;color:#8c5c68">' + esc(ev.note || '') + '</p>' +
            '<span class="im-flipcal__flourish im-flipcal__flourish--end" aria-hidden="true">&#10086;</span>' +
          '</div></div>' +
        '</div>' +
        '<div class="im-flipcal__page im-flipcal__page--right" data-flipcal-page>' + corners +
          '<div class="im-flipcal__face"><div class="im-flipcal__content" data-flipcal-content>' +
            '<span class="im-flipcal__flourish" aria-hidden="true">&#10086;</span>' +
            '<h3 class="im-flipcal__name" style="font-size:44px;font-family:\'Great Vibes\', cursive;font-weight:400;color:#8b3a4b;--im-flipcal-name-size:44px">' + esc(ev.name) + '</h3>' +
            '<p class="im-flipcal__date" style="font-size:15px;' + F_SANS + ';font-weight:600;color:#b8893f">' + esc(dLabel) + '</p>' +
            '<span class="im-flipcal__flourish im-flipcal__flourish--diamond" aria-hidden="true">&#10022;</span>' +
            '<ul class="im-flipcal__meta" style="font-size:14px;font-family:\'Jost\', sans-serif;font-weight:400;color:#2b1f1d">' +
              '<li class="im-flipcal__meta-row">' + ICON_CLOCK + '<span>' + esc(tLabel) + '</span></li>' +
              '<li class="im-flipcal__meta-row">' + ICON_PIN + '<span class="im-flipcal__venue"><span class="im-flipcal__venue-address">' + esc(vars.venueShort) + '</span></span></li>' +
            '</ul>' +
            '<div class="im-flipcal__actions">' +
              '<a class="im-flipcal__btn im-flipcal__btn--directions" href="' + esc(C.venue.mapUrl) + '" target="_blank" rel="noopener noreferrer">' + ICON_NAV + ' Get Directions</a>' +
              '<a class="im-flipcal__btn im-flipcal__btn--calendar" href="' + esc(cal) + '" target="_blank" rel="noopener noreferrer">' + ICON_CAL + ' Add to Calendar</a>' +
            '</div>' +
          '</div></div>' +
        '</div>';
    });
    contents.innerHTML = listHtml;
    slot.insertAdjacentHTML('beforebegin', pagesHtml);
    slot.remove();
  }

  // 3. Gallery photos (supports 1–6 images).
  var photos = (C.gallery || []).slice(0, 6);
  var stack = document.querySelector('.im-gallery-stack');
  if (stack && photos.length) {
    stack.querySelectorAll('[data-stack-card]').forEach(function (card, i) {
      if (i >= photos.length) return card.remove();
      card.querySelector('img').src = photos[i];
    });
    stack.querySelectorAll('.im-gallery-coverflow__lightbox-slide').forEach(function (s, i) {
      if (i >= photos.length) return s.remove();
      s.querySelector('img').setAttribute('data-src', photos[i]);
    });
    stack.style.setProperty('--im-stack-count', photos.length);
    var counter = stack.querySelector('[data-stack-counter]');
    if (counter) counter.textContent = '01 / ' + String(photos.length).padStart(2, '0');
  }

  // 4. Background music — hide the toggle when no file is configured.
  var music = document.querySelector('.im-music-toggle');
  if (music) {
    if (!C.music) music.remove();
    else music.querySelector('audio').src = C.music;
  }
})();
