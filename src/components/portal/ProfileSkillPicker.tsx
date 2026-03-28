import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const MAX_SKILLS = 40;
const MAX_SUGGESTIONS = 50;
const MIN_QUERY = 2;

type ProfileSkillPickerProps = {
  catalog: string[] | null;
  value: string[];
  onChange: (skills: string[]) => void;
};

function skillKey(s: string): string {
  return s.trim().toLowerCase();
}

function filterSuggestions(
  catalog: string[],
  query: string,
  exclude: Set<string>,
): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY) return [];
  const out: string[] = [];
  for (const s of catalog) {
    if (out.length >= MAX_SUGGESTIONS) break;
    const k = skillKey(s);
    if (exclude.has(k)) continue;
    if (k.includes(q)) out.push(s);
  }
  return out;
}

export function ProfileSkillPicker({ catalog, value, onChange }: ProfileSkillPickerProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const exclude = useMemo(() => new Set(value.map(skillKey)), [value]);

  const suggestions = useMemo(() => {
    if (!catalog || !query.trim()) return [];
    return filterSuggestions(catalog, query, exclude);
  }, [catalog, query, exclude]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const addSkill = useCallback(
    (label: string) => {
      const t = label.trim();
      if (!t || value.length >= MAX_SKILLS) return;
      const k = skillKey(t);
      if (exclude.has(k)) return;
      onChange([...value, t]);
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [value, exclude, onChange],
  );

  const removeSkill = useCallback(
    (idx: number) => {
      onChange(value.filter((_, i) => i !== idx));
    },
    [value, onChange],
  );

  const showPanel = open && query.trim().length >= MIN_QUERY && catalog !== null;

  return (
    <div ref={containerRef} className="space-y-3">
      <div>
        <label
          htmlFor={`${listId}-skill-input`}
          className="block text-xs font-medium uppercase tracking-wider text-slate-500"
        >
          Yetenekler
        </label>
        <p className="mt-1 text-xs text-slate-500">
          En az {MIN_QUERY} harf yazın; listeden seçin veya Enter ile ilk öneriyi ekleyin.
        </p>
      </div>

      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Seçili yetenekler">
          {value.map((skill, idx) => (
            <li key={`${skill}-${idx}`}>
              <span className="group inline-flex max-w-full items-center gap-1.5 rounded-lg border border-indigo-400/25 bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-100">
                <span className="truncate">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="shrink-0 rounded p-0.5 text-indigo-200/80 transition hover:bg-white/10 hover:text-white"
                  aria-label={`${skill} kaldır`}
                >
                  <span aria-hidden className="block text-[10px] leading-none">
                    ✕
                  </span>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <input
          ref={inputRef}
          id={`${listId}-skill-input`}
          type="text"
          autoComplete="off"
          disabled={catalog === null || value.length >= MAX_SKILLS}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? `${listId}-listbox` : undefined}
          aria-autocomplete="list"
          placeholder={
            catalog === null
              ? "Katalog yükleniyor…"
              : value.length >= MAX_SKILLS
                ? `En fazla ${MAX_SKILLS} yetenek`
                : "Örn. react, sql, proje…"
          }
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!showPanel || suggestions.length === 0) return;
              setActive((i) => (i + 1) % suggestions.length);
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!showPanel || suggestions.length === 0) return;
              setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
              return;
            }
            if (e.key === "Enter") {
              e.preventDefault();
              if (showPanel && suggestions.length > 0) {
                addSkill(suggestions[active] ?? suggestions[0]);
              }
            }
          }}
        />

        {catalog === null ? (
          <p className="mt-2 text-xs text-slate-500">Yetenek listesi hazırlanıyor…</p>
        ) : null}

        {showPanel ? (
          <ul
            id={`${listId}-listbox`}
            role="listbox"
            className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-white/[0.1] bg-slate-950/95 py-1 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500">
                {query.trim().length < MIN_QUERY
                  ? `Öneri için en az ${MIN_QUERY} karakter yazın.`
                  : "Eşleşen yetenek yok; farklı bir arama deneyin."}
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li key={s} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    className={`flex w-full px-4 py-2.5 text-left text-sm transition ${
                      i === active
                        ? "bg-indigo-500/25 text-white"
                        : "text-slate-200 hover:bg-white/[0.06]"
                    }`}
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => addSkill(s)}
                  >
                    <span className="line-clamp-2">{s}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
