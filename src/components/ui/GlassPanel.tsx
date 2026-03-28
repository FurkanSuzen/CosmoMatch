import type { HTMLAttributes } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article" | "section";
};

export function GlassPanel({
  className = "",
  as: Tag = "div",
  ...props
}: GlassPanelProps) {
  return (
    <Tag
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl ${className}`}
      {...props}
    />
  );
}
