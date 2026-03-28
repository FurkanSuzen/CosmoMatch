import XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const xlsxPath = join(root, "src/assets/skills.xlsx");
const outPath = join(root, "src/data/skillsCatalog.json");

const wb = XLSX.read(readFileSync(xlsxPath), { type: "buffer" });
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const set = new Set();
for (const row of rows) {
  const ex = String(row["Example"] ?? "").trim();
  const ct = String(row["Commodity Title"] ?? "").trim();
  if (ex) set.add(ex);
  if (ct) set.add(ct);
}

const skills = [...set].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

writeFileSync(outPath, JSON.stringify({ source: sheetName, count: skills.length, skills }, null, 0), "utf8");
console.log(`Wrote ${skills.length} unique skills to ${outPath}`);
