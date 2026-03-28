import { useEffect, useRef } from "react";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Star = { x: number; y: number; r: number; o: number; tw: number };

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let raf = 0;
    const reducedMotion = prefersReducedMotion();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((w * h) / 9000);
      stars = Array.from({ length: Math.max(48, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      frame += reducedMotion ? 0 : 0.012;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = reducedMotion
          ? 1
          : 0.55 + Math.sin(frame * 1.2 + s.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,232,240,${s.o * twinkle})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
