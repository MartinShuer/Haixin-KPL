// Lightweight lazy loader for background-images
document.addEventListener('DOMContentLoaded', function () {
  // Lazy-load background images for elements with data-bg
  var bgElems = [].slice.call(document.querySelectorAll('[data-bg]'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var url = el.getAttribute('data-bg');
          if (url) {
            el.style.backgroundImage = "url('" + url + "')";
            el.removeAttribute('data-bg');
          }
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });

    bgElems.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: load all immediately
    bgElems.forEach(function (el) {
      var url = el.getAttribute('data-bg');
      if (url) {
        el.style.backgroundImage = "url('" + url + "')";
        el.removeAttribute('data-bg');
      }
    });
  }

  // Ensure all <img> tags have loading=lazy where supported
  try {
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img) {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  } catch (e) {
    // ignore
  }
});
