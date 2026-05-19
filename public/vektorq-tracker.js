/**
 * VEKTORQ Tracker v2.0
 * ─────────────────────────────────────────────────────────────────
 * Drop-in analytics for small business websites.
 * Tracks: pageviews, clicks, scroll depth, rage clicks, dead clicks,
 *         session funnel, device info, time on page.
 *
 * Usage:
 *   <script src="https://vektorq.com/vektorq-tracker.js"
 *           data-site-id="YOUR_SITE_ID"
 *           data-debug="false">
 *   </script>
 *
 * Or manually:
 *   VEK.init('YOUR_SITE_ID', { debug: true });
 * ─────────────────────────────────────────────────────────────────
 */
(function (window, document) {
  'use strict';

  // ── Config ────────────────────────────────────────────────────
  var ENDPOINT = 'https://vektorq.com/api/events';
  var VERSION  = '2.0.0';
  var THROTTLE_MS = 120; // min ms between click events

  // ── Session state ─────────────────────────────────────────────
  var state = {
    siteId:        null,
    sessionId:     uid('s_'),
    pageId:        uid('p_'),
    pageStart:     Date.now(),
    scrollMax:     0,
    lastClick:     0,
    clickMap:      {},   // elementKey → { count, lastTs } — rage/dead detection
    initialized:   false,
    queue:         [],   // buffered events before init
  };

  // ── Helpers ───────────────────────────────────────────────────
  function uid(prefix) {
    return (prefix || '') +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 9);
  }

  function log() {
    if (window.VEK_DEBUG) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[VEKTORQ]');
      console.log.apply(console, args);
    }
  }

  function deviceType() {
    var w = window.innerWidth;
    return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  }

  function getPerf() {
    try {
      var t = performance.timing;
      return {
        loadMs:  t.loadEventEnd - t.navigationStart,
        domMs:   t.domContentLoadedEventEnd - t.navigationStart,
        ttfbMs:  t.responseStart - t.navigationStart,
      };
    } catch (e) { return null; }
  }

  function elementKey(el) {
    // Stable key for rage/dead click detection
    var tag  = el.tagName ? el.tagName.toLowerCase() : 'unknown';
    var id   = el.id   ? '#' + el.id : '';
    var cls  = typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    var text = el.textContent
      ? el.textContent.trim().slice(0, 30).replace(/\s+/g, ' ')
      : '';
    return tag + id + cls + '|' + text;
  }

  function isClickable(el) {
    if (!el) return false;
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (['a', 'button', 'input', 'select', 'textarea', 'label'].indexOf(tag) > -1) return true;
    if (el.onclick || el.getAttribute('onclick')) return true;
    if (el.getAttribute('role') === 'button') return true;
    if (el.getAttribute('href')) return true;
    var style = window.getComputedStyle ? window.getComputedStyle(el) : null;
    if (style && style.cursor === 'pointer') return true;
    return false;
  }

  // ── Send event ────────────────────────────────────────────────
  function send(type, data) {
    if (!state.siteId) {
      state.queue.push({ type: type, data: data });
      return;
    }

    var payload = {
      v:         VERSION,
      siteId:    state.siteId,
      sessionId: state.sessionId,
      pageId:    state.pageId,
      type:      type,
      url:       window.location.pathname + window.location.search,
      ts:        Date.now(),
      device:    deviceType(),
      meta: Object.assign({
        referrer:   document.referrer || 'direct',
        lang:       navigator.language,
        screen:     window.screen.width + 'x' + window.screen.height,
        viewport:   window.innerWidth  + 'x' + window.innerHeight,
        title:      document.title.slice(0, 80),
      }, data || {})
    };

    log('send', type, payload);

    // Beacon API — fire and forget, survives page unload
    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      } catch (e) { /* fall through */ }
    }

    // Fetch fallback
    if (window.fetch) {
      fetch(ENDPOINT, {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        body:      JSON.stringify(payload),
        keepalive: true,
      }).catch(function (e) { log('fetch error', e); });
      return;
    }

    // Image pixel last resort
    var img = new Image();
    img.src = ENDPOINT + '?d=' + encodeURIComponent(JSON.stringify(payload));
  }

  // ── Trackers ──────────────────────────────────────────────────

  function trackPageView() {
    state.pageId    = uid('p_');
    state.pageStart = Date.now();
    state.scrollMax = 0;
    send('pageview', {
      perf: getPerf(),
    });
    log('pageview', window.location.pathname);
  }

  function trackPageLeave() {
    send('pageleave', {
      timeOnPageMs: Date.now() - state.pageStart,
      scrollDepth:  state.scrollMax,
    });
  }

  function setupScrollTracking() {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var el     = document.documentElement;
        var total  = el.scrollHeight - el.clientHeight;
        var pct    = total > 0 ? Math.round((window.scrollY / total) * 100) : 100;
        if (pct > state.scrollMax) state.scrollMax = pct;
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setupClickTracking() {
    document.addEventListener('click', function (e) {
      var now = Date.now();
      if (now - state.lastClick < THROTTLE_MS) return;
      state.lastClick = now;

      var target = e.target;
      // Walk up to find meaningful element
      var el = target;
      for (var i = 0; i < 5 && el && el !== document.body; i++) {
        if (isClickable(el)) { target = el; break; }
        el = el.parentElement;
      }

      var key    = elementKey(target);
      var bucket = state.clickMap[key] || { count: 0, lastTs: 0, isClickable: isClickable(target) };
      bucket.count++;
      bucket.lastTs = now;
      state.clickMap[key] = bucket;

      // Rage click: 3+ clicks on same element within 2 seconds
      var isRage = bucket.count >= 3 && (now - bucket.firstTs) < 2000;
      if (bucket.count === 1) bucket.firstTs = now;

      // Dead click: element looks interactive but has no real handler
      var anchorEl  = target.closest ? target.closest('a') : null;
      var isDead    = !isClickable(target) &&
                      !anchorEl &&
                      target.tagName !== 'BODY' &&
                      target.tagName !== 'HTML';

      send('click', {
        tag:       target.tagName ? target.tagName.toLowerCase() : '',
        id:        target.id || '',
        cls:       typeof target.className === 'string'
                     ? target.className.trim().slice(0, 80) : '',
        text:      target.textContent
                     ? target.textContent.trim().slice(0, 60).replace(/\s+/g, ' ') : '',
        href:      target.href || (anchorEl ? anchorEl.href : '') || '',
        x:         Math.round((e.clientX / window.innerWidth) * 100),  // % of viewport
        y:         Math.round((e.clientY / window.innerHeight) * 100), // % of viewport
        xPx:       e.clientX,
        yPx:       e.clientY,
        rage:      isRage,
        dead:      isDead,
        clickN:    bucket.count,
      });
    }, { passive: true, capture: true });
  }

  function setupFormTracking() {
    // Track field focus (funnel step awareness)
    document.addEventListener('focusin', function (e) {
      var el = e.target;
      if (!el || !el.tagName) return;
      var tag = el.tagName.toLowerCase();
      if (['input', 'textarea', 'select'].indexOf(tag) === -1) return;
      send('form_field_focus', {
        tag:   tag,
        type:  el.type || '',
        name:  el.name || el.id || '',
      });
    }, { passive: true });

    // Track abandonment: focused a field but never submitted
    var formStarted = false;
    document.addEventListener('focusin', function (e) {
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (['input', 'textarea', 'select'].indexOf(tag) > -1) formStarted = true;
    }, { passive: true });

    document.addEventListener('submit', function (e) {
      formStarted = false;
      var form = e.target;
      send('form_submit', {
        id:     form.id || '',
        action: form.action || '',
      });
    }, { passive: true });

    // On page leave: if form was started but not submitted = abandonment
    window.addEventListener('beforeunload', function () {
      if (formStarted) {
        send('form_abandon', {});
      }
    });
  }

  function setupSPATracking() {
    if (!window.history || !window.history.pushState) return;
    var orig = history.pushState;
    history.pushState = function () {
      orig.apply(this, arguments);
      setTimeout(trackPageView, 80);
    };
    window.addEventListener('popstate', function () {
      setTimeout(trackPageView, 80);
    });
  }

  function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        trackPageLeave();
      }
    });
    window.addEventListener('pagehide', trackPageLeave);
  }

  // ── Public API ────────────────────────────────────────────────
  window.VEK = {
    init: function (siteId, opts) {
      if (state.initialized) return;
      state.initialized = true;
      state.siteId      = siteId;

      if (opts && opts.debug) window.VEK_DEBUG = true;
      if (opts && opts.endpoint) ENDPOINT = opts.endpoint;

      log('init', siteId);

      // Flush queued events
      var q = state.queue.splice(0);
      for (var i = 0; i < q.length; i++) send(q[i].type, q[i].data);

      // Track initial pageview
      if (document.readyState === 'complete') {
        trackPageView();
      } else {
        window.addEventListener('load', trackPageView, { once: true });
      }

      setupScrollTracking();
      setupClickTracking();
      setupFormTracking();
      setupSPATracking();
      setupVisibilityTracking();
    },

    // Manual event tracking
    track: function (type, data) { return send(type, data || {}); },

    // Identify a user (for booking confirmations etc)
    identify: function (userId, traits) {
      send('identify', { userId: userId, traits: traits || {} });
    },

    getSessionId: function () { return state.sessionId; },
    version:      VERSION,
  };

  // ── Auto-init from script tag ─────────────────────────────────
  var script = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  if (script) {
    var siteId = script.getAttribute('data-site-id');
    var debug  = script.getAttribute('data-debug');
    var ep     = script.getAttribute('data-endpoint');
    if (siteId) {
      setTimeout(function () {
        window.VEK.init(siteId, {
          debug:    debug === 'true',
          endpoint: ep || undefined,
        });
      }, 0);
    }
  }

  window.VEK_VERSION = VERSION;

}(window, document));
