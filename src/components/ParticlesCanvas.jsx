import { useEffect, useRef } from "react";

const COLORS = ["#2e7d32", "#4caf50", "#81c784", "#ffb300", "#ffffff"];

function rnd(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(w, h) {
  return {
    x:     rnd(0, w),
    y:     rnd(0, h),
    r:     rnd(2.5, 6),
    dx:    rnd(-0.6, 0.6) || 0.3,
    dy:    rnd(-0.6, 0.6) || 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: rnd(0.35, 0.75),
  };
}

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;
    let particles = [];
    const COUNT     = 70;
    const LINK_DIST = 120;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const opacity = 0.35 * (1 - dist / LINK_DIST);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(46,125,50,${opacity})`;
            ctx.lineWidth   = 1.2;
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach((p) => {
        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Move
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
