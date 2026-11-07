/* Starfield background - Canvas-based, optimized for low CPU usage */
(function starfield() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TINTS = [
    [255, 255, 255],
    [205, 222, 255],
    [255, 236, 214],
    [186, 205, 255]
  ];

  const BASE_SIZE = [1.8, 3.2, 6.4, 11];

  const spriteCache = new Map();
  let flareSprite = null;

  let W = 0;
  let H = 0;
  let dpr = 1;

  let stars = [];
  let shooting = null;
  let nextShot = 3200;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  let lastT = performance.now();
  let rafId = null;

  function getSprite(tint, bucket) {
    const key = tint + ':' + bucket;
    const cached = spriteCache.get(key);
    if (cached) return cached;

    const radius = [1.5, 2.6, 4.6, 7.4][bucket];
    const size = Math.max(2, Math.ceil(radius * 2));
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;

    const g = c.getContext('2d');
    const t = TINTS[tint];
    const cx = size / 2;

    const grad = g.createRadialGradient(cx, cx, 0, cx, cx, cx);
    grad.addColorStop(0.00, 'rgba(255,255,255,1)');
    grad.addColorStop(0.14, 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',0.80)');
    grad.addColorStop(0.38, 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',0.20)');
    grad.addColorStop(0.72, 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',0.04)');
    grad.addColorStop(1.00, 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',0)');

    g.fillStyle = grad;
    g.beginPath();
    g.arc(cx, cx, cx, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath();
    g.arc(cx, cx, Math.max(0.4, cx * 0.15), 0, Math.PI * 2);
    g.fill();

    spriteCache.set(key, c);
    return c;
  }

  function getFlare() {
    if (flareSprite) return flareSprite;

    const s = 64;
    const c = document.createElement('canvas');
    c.width = s;
    c.height = s;

    const g = c.getContext('2d');
    const mid = s / 2;

    const h = g.createLinearGradient(0, mid, s, mid);
    h.addColorStop(0, 'rgba(255,255,255,0)');
    h.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    h.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = h;
    g.fillRect(0, mid - 0.55, s, 1.1);

    const v = g.createLinearGradient(mid, 0, mid, s);
    v.addColorStop(0, 'rgba(255,255,255,0)');
    v.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    v.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = v;
    g.fillRect(mid - 0.55, 0, 1.1, s);

    flareSprite = c;
    return flareSprite;
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = Math.round((W * H) / 1500);
    const count = Math.min(1500, Math.max(420, density));

    stars = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let bucket = 0;
      if (roll > 0.9955) bucket = 3;
      else if (roll > 0.972) bucket = 2;
      else if (roll > 0.85) bucket = 1;

      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        depth: 0.25 + Math.random() * 0.75,
        bucket: bucket,
        tint: [0, 0, 0, 1, 3, 2][Math.floor(Math.random() * 6)],
        base: 0.28 + Math.random() * 0.62,
        speed: 0.35 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI,
        hasFlare: bucket === 3
      });
    }
  }

  function spawnShooting() {
    const goLeft = Math.random() > 0.5;
    const speed = 380 + Math.random() * 320;

    shooting = {
      x: W * (0.15 + Math.random() * 0.7),
      y: H * (0.05 + Math.random() * 0.35),
      vx: (goLeft ? -1 : 1) * speed * 0.85,
      vy: speed * 0.45,
      life: 0,
      max: 0.9 + Math.random() * 0.5
    };
  }

  function draw(now) {
    const t = now / 1000;
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    ctx.clearRect(0, 0, W, H);

    mouseX += (targetX - mouseX) * 0.045;
    mouseY += (targetY - mouseY) * 0.045;
    const px = mouseX * 16;
    const py = mouseY * 16;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = 0.7 + 0.3 * Math.sin(t * s.speed + s.phase);
      const alpha = Math.min(1, s.base * twinkle);

      const size = BASE_SIZE[s.bucket] * (0.6 + s.depth * 0.8);
      const x = s.x + px * s.depth;
      const y = s.y + py * s.depth;

      ctx.globalAlpha = alpha;
      ctx.drawImage(getSprite(s.tint, s.bucket), x - size / 2, y - size / 2, size, size);

      if (s.hasFlare) {
        const fs = size * 6;
        ctx.globalAlpha = alpha * 0.3;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(s.angle);
        ctx.drawImage(getFlare(), -fs / 2, -fs / 2, fs, fs);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;

    if (!reduceMotion) {
      if (!shooting) {
        nextShot -= dt * 1000;
        if (nextShot <= 0) {
          spawnShooting();
          nextShot = 7000 + Math.random() * 12000;
        }
      } else {
        const p = shooting;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;

        const tailX = p.x - p.vx * 0.13;
        const tailY = p.y - p.vy * 0.13;
        const fade = Math.max(0, 1 - p.life / p.max);

        const grad = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.35, 'rgba(190,220,255,0.32)');
        grad.addColorStop(1, 'rgba(190,220,255,0)');

        ctx.globalAlpha = fade;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.globalAlpha = fade * 0.85;
        ctx.drawImage(getSprite(0, 3), p.x - 8, p.y - 8, 16, 16);
        ctx.globalAlpha = 1;

        if (p.life > p.max || p.x < -300 || p.x > W + 300 || p.y > H + 300) {
          shooting = null;
        }
      }
    }
  }

  function loop(now) {
    draw(now);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    lastT = performance.now();

    if (reduceMotion) {
      draw(performance.now());
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      build();
      if (reduceMotion) draw(performance.now());
    }, 140);
  });

  window.addEventListener('pointermove', function (e) {
    targetX = (e.clientX / W) * 2 - 1;
    targetY = (e.clientY / H) * 2 - 1;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (reduceMotion) return;
    if (document.hidden) stop();
    else start();
  });

  build();
  start();
})();
