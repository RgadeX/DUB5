/* =========================================================
   INTRO — star flies in, draws the line, becomes the logo
   ========================================================= */
(function introStar() {
  const rule = document.getElementById('headerRule');
  const slot = document.getElementById('logoSlot');
  if (!rule || !slot) return;

  const STAR_PATH =
    'M12 2.2l2.94 6.02 6.63.92-4.79 4.63 1.13 6.6L12 17.25l-5.91 3.12 1.13-6.6-4.79-4.63 6.63-.92z';
  const STAR_SVG = '<svg viewBox="0 0 24 24"><path d="' + STAR_PATH + '"/></svg>';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    rule.style.transform = 'scaleX(1)';
    slot.classList.add('is-visible');
    return;
  }

  function run() {
    const rr = rule.getBoundingClientRect();
    const sr = slot.getBoundingClientRect();

    /* nothing to measure yet (e.g. hidden tab) */
    if (rr.width < 10 || sr.width < 1) {
      rule.style.transform = 'scaleX(1)';
      slot.classList.add('is-visible');
      return;
    }

    const SIZE = 44;

    const star = document.createElement('div');
    star.className = 'intro-star';
    star.style.width = SIZE + 'px';
    star.style.height = SIZE + 'px';
    star.innerHTML = STAR_SVG;
    document.body.appendChild(star);

    const startX = rr.left;
    const startY = rr.top + rr.height / 2;
    const endX = rr.right;
    const endY = startY;

    const slotCX = sr.left + sr.width / 2;
    const slotCY = sr.top + sr.height / 2;
    const slotScale = sr.width / SIZE;

    const tf = function (x, y, s) {
      return 'translate(' + (x - SIZE / 2) + 'px,' + (y - SIZE / 2) + 'px) scale(' + s + ')';
    };

    /* Phase 1 — the star is born */
    const pop = star.animate([
      { transform: tf(startX, startY, 0),   opacity: 0 },
      { transform: tf(startX, startY, 1.3), opacity: 1, offset: 0.62 },
      { transform: tf(startX, startY, 1),   opacity: 1 }
    ], {
      duration: 480,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });

    /* Phase 2 — travels right, drawing the line under the header */
    const travel = star.animate([
      { transform: tf(startX, startY, 1) },
      { transform: tf(endX, endY, 1) }
    ], {
      duration: 900,
      easing: 'ease-in-out',
      delay: 480,
      fill: 'forwards'
    });

    rule.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], {
      duration: 900,
      easing: 'ease-in-out',
      delay: 480,
      fill: 'forwards'
    });

    /* Phase 3 — flies up and converts into the 2D logo */
    travel.finished
      .then(function () {
        const fly = star.animate([
          { transform: tf(endX, endY, 1) },
          {
            transform: tf(
              (endX + slotCX) / 2,
              (endY + slotCY) / 2 - 46,
              1.18
            ),
            offset: 0.55
          },
          { transform: tf(slotCX, slotCY, slotScale) }
        ], {
          duration: 820,
          easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
          fill: 'forwards'
        });

        return fly.finished;
      })
      .then(function () {
        slot.classList.add('is-visible');
        star.remove();
      })
      .catch(function () {
        slot.classList.add('is-visible');
        rule.style.transform = 'scaleX(1)';
        if (star.parentNode) star.remove();
      });
  }

  /* wait for fonts + layout so the measurements are exact */
  const kick = function () {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        setTimeout(run, 90);
      });
    } else {
      setTimeout(run, 120);
    }
  };

  if (document.readyState === 'complete') kick();
  else window.addEventListener('load', kick);
})();
