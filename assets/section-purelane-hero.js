function initHero(section) {
  var hstage = section.querySelector('#hstage');
  if (!hstage) return;
  var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
  var hd = [].slice.call(section.querySelectorAll('#hdots button'));
  var hi = 0, htimer = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hgo(n) {
    hi = (n + hs.length) % hs.length;
    hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
    hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
  }

  function hplay() {
    if (!htimer && !reduce) {
      htimer = setInterval(function () { hgo(hi + 1); }, 3800);
    }
  }

  function hstop() {
    if (htimer) {
      clearInterval(htimer);
      htimer = null;
    }
  }

  hd.forEach(function (d, i) {
    d.addEventListener('click', function () { hstop(); hgo(i); hplay(); });
  });

  hstage.addEventListener('mouseenter', hstop);
  hstage.addEventListener('mouseleave', hplay);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? hplay() : hstop(); });
    }, { threshold: 0.2 });
    observer.observe(hstage);
    section.sliderObserver = observer;
  } else {
    hplay();
  }

  section.stopSlider = hstop;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.purelane-hero-section').forEach(initHero);
});

// Shopify Theme Editor support
document.addEventListener('shopify:section:load', function(event) {
  var section = event.target.querySelector('.purelane-hero-section');
  if (section) initHero(section);
});

document.addEventListener('shopify:section:unload', function(event) {
  var section = event.target.querySelector('.purelane-hero-section');
  if (section) {
    if (section.stopSlider) section.stopSlider();
    if (section.sliderObserver) section.sliderObserver.disconnect();
  }
});
