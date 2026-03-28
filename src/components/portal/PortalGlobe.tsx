import createGlobe from "cobe";
import type { Marker } from "cobe";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { projectMarkerToNormalized, latLngToUnitVector } from "../../lib/cobeProjectMarker";

const AUTO_SPEED = 0.00135;
const DRAG_PHI = 0.0065;
const DRAG_THETA = 0.0045;
const DRAG_THRESHOLD_PX = 8;
/** Normalize [0,1] uzayında yaklaşık tıklama yarıçapı */
const HIT_RADIUS = 0.092;

const SCALE = 1.05;
const OFFSET: [number, number] = [0, 0];

export type GlobeMarkerInfo = {
  id: string;
  title: string;
  subtitle: string;
  location: [number, number];
  size: number;
};

export const GLOBE_MARKER_LIST: GlobeMarkerInfo[] = [
  {
    id: "tusas",
    title: "TUSAŞ Merkez",
    subtitle: "Kahramankazan, Ankara · Havacılık & Uzay Sanayi",
    location: [40.2063, 32.6816],
    size: 0.045,
  },
  {
    id: "sx",
    title: "Space X Merkez",
    subtitle: "Starbase, Texas · Uzay & Araştırma",
    location: [25.9913, -97.1836],
    size: 0.035,
  },
  {
    id: "jaxa",
    title: "JAXA Merkez",
    subtitle: "Chōfu, Tokyo · Uzay AR-GE Merkezi",
    location: [35.6506, 139.5406],
    size: 0.038,
  },
  {
    id: "airbus",
    title: "Airbus Defence and Space Merkez",
    subtitle: "Taufkirchen, Almanya · Uzay & Savunma Sanayi",
    location: [48.05, 11.6166],
    size: 0.032,
  },
  {
    id: "roscosmos",
    title: "Roscosmos Merkez",
    subtitle: "Moskova, Rusya · Uzay & Savunma Sanayi",
    location: [55.7558, 37.6177],
    size: 0.03,
  },
  {
    id:"casc",
    title: "CASC Merkez",
    subtitle: "Haidan, Beijing · Uzay & Teknoloji",
    location: [39.96, 116.2983],
    size: 0.03,
  },
  {
    id: "isro",
    title: "ISRO Merkez",
    subtitle: "Bangalore, Hindistan · Uzay & Araştırma",
    location: [12.9716, 77.5946],
    size: 0.03,
  },
  {
    id:"blueorigin",
    title: "Blue Origin Merkez",
    subtitle: "Vandenberg, ABD · Uzay & Araştırma",
    location: [34.6322, -120.6109],
    size: 0.03,
  },
  {
    id:"nasa",
    title: "NASA Merkez",
    subtitle: "Washington, D.C. · Uzay & Araştırma",
    location: [38.8891, -77.0364],
    size: 0.03,
  },
  {
    id:"esa",
    title: "ESA Merkez",
    subtitle: "Noordwijk, Hollanda · Uzay & Araştırma",
    location: [52.31, 4.54],
    size: 0.03,
  },
  {
    id:"jsc",
    title: "JSC Merkez",
    subtitle: "Houston, ABD · Uzay & Araştırma",
    location: [29.7604, -95.3698],
    size: 0.03,
  },
  {
    id:"esa",
    title: "ESA Merkez",
    subtitle: "Noordwijk, Hollanda · Uzay & Araştırma",
    location: [52.31, 4.54],
    size: 0.03,
  },
];

const COBE_MARKERS: Marker[] = GLOBE_MARKER_LIST.map((m) => ({
  location: m.location,
  size: m.size,
}));

const GLOBE_OPTS = {
  dark: 1,
  diffuse: 1.35,
  mapSamples: 18000,
  mapBrightness: 5.5,
  mapBaseBrightness: 0.12,
  baseColor: [0.12, 0.14, 0.22] as [number, number, number],
  markerColor: [0.35, 0.65, 1] as [number, number, number],
  glowColor: [0.2, 0.45, 0.75] as [number, number, number],
  scale: SCALE,
  markers: COBE_MARKERS,
  arcs: [
    {
      from: [40.2063, 32.6816] as [number, number],
      to: [25.9913, -97.1836] as [number, number],
      color: [0.35, 0.55, 0.95] as [number, number, number],
    },
    {
      from: [35.6762, 139.6503] as [number, number],
      to: [48.05, 11.6166] as [number, number],
      color: [0.45, 0.4, 0.95] as [number, number, number],
    },
    {
      from: [55.7558, 37.6177] as [number, number],
      to: [12.9716, 77.5946] as [number, number],
      color: [0.35, 0.55, 0.95] as [number, number, number],
    },
    {
      from: [52.31, 4.54] as [number, number],
      to: [34.6322, -120.6109] as [number, number],
      color: [0.45, 0.4, 0.95] as [number, number, number],
    },
    {
      from: [39.96, 116.2983] as [number, number],
      to: [38.8891, -77.0364] as [number, number],
      color: [0.35, 0.55, 0.95] as [number, number, number],
    },
  ],
  arcColor: [0.3, 0.5, 0.9] as [number, number, number],
  arcWidth: 0.42,
  arcHeight: 0.22,
  markerElevation: 0.025,
};

export function PortalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.28);
  const dprRef = useRef(2);
  const sizeRef = useRef(400);
  const dragActiveRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const lastRef = useRef({ x: 0, y: 0 });
  const movedPastThresholdRef = useRef(false);

  const [popup, setPopup] = useState<{
    marker: GlobeMarkerInfo;
    anchor: { left: number; top: number };
  } | null>(null);

  const closePopup = useCallback(() => setPopup(null), []);

  const pickMarkerAtClientPoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const ux = (clientX - rect.left) / rect.width;
      const uy = (clientY - rect.top) / rect.height;

      const phi = phiRef.current;
      const theta = thetaRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = dprRef.current;

      let best: { marker: GlobeMarkerInfo; d: number } | null = null;

      for (const marker of GLOBE_MARKER_LIST) {
        const t = latLngToUnitVector(marker.location[0], marker.location[1]);
        const { x, y, visible } = projectMarkerToNormalized(phi, theta, t, {
          width: w,
          height: h,
          dpr,
          scale: SCALE,
          offset: OFFSET,
          markerElevation: GLOBE_OPTS.markerElevation,
        });
        if (!visible) continue;
        const dx = ux - x;
        const dy = uy - y;
        const d = Math.hypot(dx, dy);
        const hitR = HIT_RADIUS + marker.size * 0.35;
        if (d <= hitR && (!best || d < best.d)) {
          best = { marker, d };
        }
      }
      return best?.marker ?? null;
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const canvasEl = canvas;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf = 0;

    function syncSize() {
      const el = containerRef.current;
      if (!el) return sizeRef.current;
      const w = el.clientWidth;
      const s = Math.min(Math.max(w, 280), 620);
      sizeRef.current = s;
      return s;
    }

    const dpr = Math.min(window.devicePixelRatio ?? 2, 2);
    dprRef.current = dpr;
    const s = syncSize();
    const px = Math.floor(s * dpr);

    globe = createGlobe(canvasEl, {
      devicePixelRatio: dpr,
      width: px,
      height: px,
      phi: phiRef.current,
      theta: thetaRef.current,
      ...GLOBE_OPTS,
    });

    function loop() {
      if (!globe) return;
      if (!dragActiveRef.current) {
        phiRef.current += AUTO_SPEED;
      }
      const size = sizeRef.current;
      const p = Math.floor(size * dpr);
      globe.update({
        width: p,
        height: p,
        phi: phiRef.current,
        theta: thetaRef.current,
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function onPointerDown(e: PointerEvent) {
      dragActiveRef.current = true;
      movedPastThresholdRef.current = false;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      lastRef.current = { x: e.clientX, y: e.clientY };
      canvasEl.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragActiveRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      const ox = e.clientX - pointerStartRef.current.x;
      const oy = e.clientY - pointerStartRef.current.y;
      if (ox * ox + oy * oy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        movedPastThresholdRef.current = true;
      }
      lastRef.current = { x: e.clientX, y: e.clientY };
      phiRef.current += dx * DRAG_PHI;
      thetaRef.current += dy * DRAG_THETA;
      thetaRef.current = Math.max(
        -Math.PI * 0.45,
        Math.min(Math.PI * 0.45, thetaRef.current),
      );
    }

    function onPointerUp(e: PointerEvent) {
      const wasDrag = movedPastThresholdRef.current;
      dragActiveRef.current = false;
      try {
        canvasEl.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (!wasDrag) {
        const hit = pickMarkerAtClientPoint(e.clientX, e.clientY);
        if (hit) {
          setPopup({
            marker: hit,
            anchor: { left: e.clientX, top: e.clientY },
          });
        } else {
          setPopup(null);
        }
      }
    }

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointercancel", onPointerUp);

    const ro = new ResizeObserver(() => {
      syncSize();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("pointercancel", onPointerUp);
      ro.disconnect();
      globe?.destroy();
      globe = null;
    };
  }, [pickMarkerAtClientPoint]);

  useEffect(() => {
    if (!popup) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") setPopup(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popup]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[min(100%,620px)] lg:mx-0"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[40%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.18),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,211,238,0.08),transparent_50%)]" />
      <div
        className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-b from-slate-900/80 to-space-void/95 p-1 shadow-[0_0_80px_-20px_rgba(99,102,241,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        style={{ aspectRatio: "1" }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
          style={{ display: "block" }}
          aria-label="Etkileşimli dünya küresi — noktalara tıklayın veya sürükleyin"
        />
      </div>

      <AnimatePresence>
        {popup ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] cursor-default bg-black/40 backdrop-blur-[2px]"
              aria-label="Kapat"
              onClick={closePopup}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`globe-popup-${popup.marker.id}`}
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="fixed z-[70] w-[min(calc(100vw-2rem),320px)] rounded-2xl border border-white/[0.12] bg-slate-950/95 p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85),0_0_40px_-12px_rgba(99,102,241,0.35)] backdrop-blur-xl"
              style={{
                left: Math.min(
                  Math.max(popup.anchor.left, 16),
                  typeof window !== "undefined"
                    ? window.innerWidth - 320 - 16
                    : popup.anchor.left,
                ),
                top: Math.min(
                  Math.max(popup.anchor.top + 12, 16),
                  typeof window !== "undefined"
                    ? window.innerHeight - 200
                    : popup.anchor.top,
                ),
                transform: "translate(-50%, 0)",
              }}
            >
              <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-300/90">
                Konum
              </p>
              <h3
                id={`globe-popup-${popup.marker.id}`}
                className="mt-2 text-lg font-semibold tracking-tight text-white"
              >
                {popup.marker.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {popup.marker.subtitle}
              </p>
              <p className="mt-3 font-mono text-[11px] text-slate-500">
                {popup.marker.location[0].toFixed(2)}°,{" "}
                {popup.marker.location[1].toFixed(2)}°
              </p>
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  closePopup();
                }}
                className="mt-5 w-full rounded-xl border border-white/[0.1] bg-white/[0.06] py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.1]"
              >
                Kapat
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
        Noktalara tıklayın · sürükleyerek döndürün
      </p>
    </div>
  );
}
