/* Shared pick behaviour for the section-preview pages. */
(function () {
  var KEY = 'sh-homepage-picks';
  var id = document.body.dataset.section;

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function write(o) { localStorage.setItem(KEY, JSON.stringify(o)); }

  function paint() {
    var cur = read()[id];
    document.querySelectorAll('[data-v]').forEach(function (el) {
      el.classList.toggle('on', el.dataset.v === cur);
    });
    var n = Object.keys(read()).length;
    var who = document.getElementById('who');
    if (who) who.textContent = cur ? cur.toUpperCase() + ' chosen' : 'nothing chosen';
  }

  function choose(v) {
    var o = read();
    o[id] = v;
    write(o);
    paint();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pick],[data-v]');
    if (!t) return;
    if (t.dataset.pick) { choose(t.dataset.pick); return; }
    var block = t.closest('.pv');
    if (block) {
      var v = block.dataset.variant;
      choose(v);
      location.hash = 'v' + v;
    }
  });

  paint();
  var h = location.hash.replace('#v', '');
  if (h && /^[abc]$/.test(h)) {
    var el = document.querySelector('.pv[data-variant="' + h + '"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();