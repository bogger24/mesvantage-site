/*
 * The motion runtime. Lives in public/ and loads with a src because the CSP has no
 * unsafe-inline — this is the same reason nav.js exists.
 *
 * Contract with global.css:
 *   - `html.js` gates the hidden initial state of `.reveal` elements, so a browser without
 *     JavaScript renders everything visible and nothing is ever lost to a script failure.
 *   - `prefers-reduced-motion: reduce` disables the hidden state at the CSS level, so this
 *     file does not need to check it for correctness — the observer just adds a class that
 *     no longer does anything.
 *
 * Loaded early in <head> without defer, deliberately: the class must be on <html> before
 * first paint or revealed elements flash visible-then-hidden.
 */
document.documentElement.classList.add('js');

addEventListener('DOMContentLoaded', function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('in');
          io.unobserve(entries[j].target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  for (var k = 0; k < els.length; k++) io.observe(els[k]);
});
