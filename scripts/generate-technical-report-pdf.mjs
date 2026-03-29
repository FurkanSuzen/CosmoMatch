#!/usr/bin/env node
/**
 * Markdown teknik raporu PDF'e dönüştürür (basit ayrıştırma).
 * macOS: Arial Unicode. Linux için FONT_PATH ortam değişkeni verin.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "docs", "CosmoMatch-Teknik-Rapor.md");
const outPath = path.join(root, "docs", "CosmoMatch-Teknik-Rapor.pdf");

const fontPath =
  process.env.FONT_PATH ||
  "/System/Library/Fonts/Supplemental/Arial Unicode.ttf";

if (!fs.existsSync(fontPath)) {
  console.error("Unicode font bulunamadı:", fontPath);
  console.error("FONT_PATH ile .ttf yolu verin.");
  process.exit(1);
}

if (!fs.existsSync(mdPath)) {
  console.error("Markdown bulunamadı:", mdPath);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, "utf8");
const lines = md.split(/\r?\n/);

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 56, bottom: 56, left: 56, right: 56 },
  bufferPages: true,
});

doc.pipe(fs.createWriteStream(outPath));
doc.registerFont("Body", fontPath);

const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
let codeBlock = false;

function ensureSpace(needed = 80) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

for (const rawLine of lines) {
  const line = rawLine;

  if (line.trim().startsWith("```")) {
    codeBlock = !codeBlock;
    continue;
  }
  if (codeBlock) {
    ensureSpace(14);
    doc.font("Body").fontSize(9).fillColor("#333333");
    doc.text(line || " ", { width: contentWidth });
    continue;
  }

  if (line.trim() === "---") {
    ensureSpace(20);
    doc.moveDown(0.5);
    doc
      .strokeColor("#cccccc")
      .lineWidth(0.5)
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown(0.8);
    doc.fillColor("#000000");
    continue;
  }

  if (line.startsWith("# ")) {
    ensureSpace(40);
    doc.moveDown(0.6);
    doc.font("Body").fontSize(20).fillColor("#111111");
    doc.text(line.slice(2).trim(), { width: contentWidth });
    doc.moveDown(0.4);
    continue;
  }
  if (line.startsWith("## ")) {
    ensureSpace(36);
    doc.moveDown(0.5);
    doc.font("Body").fontSize(15).fillColor("#222222");
    doc.text(line.slice(3).trim(), { width: contentWidth });
    doc.moveDown(0.35);
    continue;
  }
  if (line.startsWith("### ")) {
    ensureSpace(30);
    doc.moveDown(0.4);
    doc.font("Body").fontSize(12).fillColor("#333333");
    doc.text(line.slice(4).trim(), { width: contentWidth });
    doc.moveDown(0.3);
    continue;
  }

  if (line.trim().startsWith("|") && line.includes("|")) {
    ensureSpace(16);
    doc.font("Body").fontSize(9.5).fillColor("#222222");
    doc.text(line.replace(/\|/g, "  |  "), { width: contentWidth });
    continue;
  }

  if (line.trim() === "") {
    doc.moveDown(0.35);
    continue;
  }

  ensureSpace(48);
  doc.font("Body").fontSize(10.5).fillColor("#000000");
  const text = line.replace(/^\*\*(.+)\*\*$/, "$1").replace(/\*\*/g, "");
  doc.text(text, { width: contentWidth, align: "left" });
}

doc.end();

doc.on("finish", () => {
  console.log("PDF yazıldı:", outPath);
});
