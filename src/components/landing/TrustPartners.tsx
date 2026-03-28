import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";

const partners = [
  "SPACE X",
  "NASA",
  "ESA",
  "TUSAŞ",
  "ROKETSAN",
  "TUA",
];

export function TrustPartners() {
  return (
    <section
      id="partners"
      className="relative scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Güven"
          title="Geleceği şekillendiren kurumlar için geliştirildi"
          subtitle=""
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8 }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6"
        >
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.45 }}
              className="flex h-16 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold tracking-[0.35em] text-slate-500"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
