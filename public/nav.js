/*
 * Closes the mobile <details> menu when a link inside it is clicked.
 *
 * This lives in public/ and is loaded with a src rather than written inline, so that the
 * Content-Security-Policy can keep script-src at 'self' with no 'unsafe-inline'. Astro inlines
 * small hoisted scripts, and this one was small enough to be inlined — which would have forced
 * the policy open for the sake of four lines of nav behaviour.
 */
document.querySelectorAll('details nav a').forEach(function (a) {
  a.addEventListener('click', function () {
    var d = a.closest('details');
    if (d) d.removeAttribute('open');
  });
});
