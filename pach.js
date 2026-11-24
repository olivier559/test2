(function () {
  'use strict';

  function lock() {
    var res = [];

    // 1. Веб-способ
    try {
      var el = document.documentElement;
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      Promise.resolve(req && req.call(el))
        .then(function () { return screen.orientation.lock('landscape'); })
        .then(function () { Lampa.Noty.show('Ориентация: web OK'); })
        .catch(function (e) { Lampa.Noty.show('Ориентация: web не вышло (' + (e && e.name) + ')'); });
    } catch (e) { res.push('web error'); }

    // 2. Нативный мост приложения, если есть методы про ориентацию
    try {
      if (window.AndroidJS) {
        for (var k in window.AndroidJS) {
          if (/orient|rotat/i.test(k)) {
            try { window.AndroidJS[k]('landscape'); res.push(k); } catch (e) {}
          }
        }
      }
    } catch (e) {}

    if (res.length) Lampa.Noty.show('Нативные методы: ' + res.join(', '));
  }

  function unlock() {
    try { screen.orientation.unlock(); } catch (e) {}
  }

  function start() {
    Lampa.Player.listener.follow('start', lock);
    Lampa.Player.listener.follow('destroy', unlock);
  }

  if (window.appready) start();
  else Lampa.Listener.follow('app', function (e) {
    if (e.type === 'ready') start();
  });
})();