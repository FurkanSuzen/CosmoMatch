/**
 * COBE küresi ile aynı projeksiyon (fragment tarafındaki O mantığı).
 * Tıklama isabeti için normalize [0,1] ekran koordinatları üretir.
 */
export function latLngToUnitVector(lat: number, lng: number): [number, number, number] {
  const r = (lat * Math.PI) / 180;
  const a = (lng * Math.PI) / 180 - Math.PI;
  const cr = Math.cos(r);
  return [-cr * Math.cos(a), Math.sin(r), cr * Math.sin(a)];
}

/** cobe `Pe` içindeki `ee` ile aynı — marker `p * (.8 + markerElevation)` ile çiziliyor */
export const COBE_BASE_RADIUS = 0.8;

type ProjectOpts = {
  width: number;
  height: number;
  dpr: number;
  scale: number;
  offset: [number, number];
  /** createGlobe `markerElevation` — birim küre `U(lat,lng)` bu kadar ölçeklenir */
  markerElevation?: number;
};

/**
 * cobe `O(t)` ile birebir: `c=a*t0+i*t2`, `s=i*o*t0+r*t1-a*o*t2`
 * (f=phi, l=theta → a=cosφ, i=sinφ, r=cosθ, o=sinθ)
 */
export function projectMarkerToNormalized(
  phi: number,
  theta: number,
  unit: [number, number, number],
  opts: ProjectOpts,
): { x: number; y: number; visible: boolean } {
  const { width: w, height: h, dpr: n, scale: B, offset: T } = opts;
  const elev = opts.markerElevation ?? 0.05;
  const r = COBE_BASE_RADIUS + elev;
  const t: [number, number, number] = [
    unit[0] * r,
    unit[1] * r,
    unit[2] * r,
  ];

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const c = cosP * t[0] + sinP * t[2];
  const s = sinP * sinT * t[0] + cosT * t[1] - cosP * sinT * t[2];

  const aspect = w / h;
  const x = (c / aspect) * B + (T[0] * B * n) / w;
  const nx = (x + 1) / 2;
  const y = -s * B + (T[1] * B * n) / h;
  const ny = (y + 1) / 2;

  const zFront =
    -sinP * cosT * t[0] + sinT * t[1] + cosP * cosT * t[2];
  const visible = zFront >= 0 || c * c + s * s >= 0.64;

  return { x: nx, y: ny, visible };
}
