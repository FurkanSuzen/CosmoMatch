import { motion } from "framer-motion";

export function OrbitalRings() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2">
      <svg
        className="h-full w-full opacity-[0.4]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="160"
            ry="56"
            stroke="url(#ringGrad)"
            strokeWidth="0.6"
            transform="rotate(-18 200 200)"
          />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="140"
            ry="120"
            stroke="url(#ringGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.45"
            transform="rotate(12 200 200)"
          />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="190"
            ry="90"
            stroke="url(#ringGrad)"
            strokeWidth="0.4"
            strokeOpacity="0.35"
            transform="rotate(42 200 200)"
          />
        </motion.g>
      </svg>
      <motion.div
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.12),transparent_55%)]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
