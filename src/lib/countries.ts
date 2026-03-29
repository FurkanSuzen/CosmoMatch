export type CountryOption = { readonly code: string; readonly name: string };

/**
 * ISO bölgeleri, Türkçe ada göre A–Z sıralı.
 * Aynı ada sahip eski kodlar (ör. DD/DE) için sözlük sırasına göre en büyük kod tutulur.
 */
function buildCountriesSortedTr(): CountryOption[] {
  const dn = new Intl.DisplayNames(["tr"], { type: "region" });
  const bestCodeByName = new Map<string, string>();

  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      const code = String.fromCharCode(65 + i) + String.fromCharCode(65 + j);
      const name = dn.of(code);
      if (
        typeof name !== "string" ||
        name.length === 0 ||
        name === code ||
        name === "Bilinmeyen Bölge"
      ) {
        continue;
      }
      const prev = bestCodeByName.get(name);
      if (!prev || code > prev) bestCodeByName.set(name, code);
    }
  }

  const entries: CountryOption[] = [...bestCodeByName.entries()].map(
    ([name, code]) => ({ code, name }),
  );
  entries.sort((a, b) =>
    a.name.localeCompare(b.name, "tr", { sensitivity: "base" }),
  );
  return entries;
}

/** Kayıt ve formlar için Türkçe ülke adları (sıralı). */
export const COUNTRIES_TR_SORTED: readonly CountryOption[] = buildCountriesSortedTr();
