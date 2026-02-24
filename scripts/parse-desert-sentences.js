#!/usr/bin/env node
/**
 * Lê desert-fathers-700.txt (NUMBER\tAUTHOR\tTEXT, primeira linha = cabeçalho)
 * e imprime entradas no formato do desert-fathers.ts
 */
const fs = require("fs");
const path = process.argv[2] || "src/data/desert-fathers-700.txt";
const raw = fs.readFileSync(path, "latin1");
const lines = raw.split(/\r?\n/).filter((l) => l.trim());

function fixMojibake(s) {
  return s
    .replace(/\u008b/g, "ã")
    .replace(/\u0087/g, "á")
    .replace(/\u0097/g, "ó")
    .replace(/\u0090/g, "É")
    .replace(/\u009b/g, "õ")
    .replace(/\u008d/g, "í")
    .replace(/\u008e/g, "ê")
    .replace(/\u009a/g, "ú")
    .replace(/\u0094/g, "ô")
    .replace(/\u0089/g, "é")
    .replace(/\u0092/g, "ó")
    .replace(/\u0095/g, "õ")
    .replace(/\u008c/g, "ì")
    .replace(/\u0099/g, "ù")
    .replace(/\u0098/g, "ø")
    .replace(/\u008f/g, "ï")
    .replace(/\u0096/g, "ö")
    .replace(/\u0091/g, "ò")
    .replace(/\u0093/g, "ó")
    .replace(/\u009e/g, "þ")
    .replace(/\u009f/g, "ÿ")
    .replace(/\u009c/g, "œ")
    .replace(/\u00c3\u00a3/g, "ã")
    .replace(/\u00c3\u00a7/g, "ç")
    .replace(/\u00c3\u00a9/g, "é")
    .replace(/\u00c3\u00ad/g, "í")
    .replace(/\u00c3\u00b3/g, "ó")
    .replace(/\u00c3\u00b5/g, "õ")
    .replace(/\u00c3\u00ba/g, "ú")
    .replace(/\u00c3\u00b4/g, "ô")
    .replace(/\u00c2\u00ba/g, "º")
    .replace(/\u00ef\u00bb\u00bf/g, "");
}

function normAuthor(a) {
  let s = a.trim();
  if (/^Abade\s/.test(s)) s = "Abba " + s.slice(6);
  else if (/^Pai\s/.test(s)) s = "Abba " + s.slice(4);
  else if (/^São\s/.test(s)) s = "Abba " + s.slice(4);
  return s;
}

function escapeText(t) {
  return t
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ");
}

const out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idx = line.indexOf("\t");
  if (idx === -1) continue;
  const rest = line.slice(idx + 1);
  const idx2 = rest.indexOf("\t");
  if (idx2 === -1) continue;
  const author = rest.slice(0, idx2).trim();
  let text = rest.slice(idx2 + 1).trim();
  if (i === 0 && (author === "Padre do Deserto" || author === "Padre do Deserto Sentença")) continue;
  text = text.replace(/^"+|"+$/g, "").trim();
  if (!text) continue;
  const authorNorm = fixMojibake(normAuthor(author));
  const textFixed = fixMojibake(text);
  out.push(
    `  { category: "patristic", author: "${authorNorm}", source: "Apotegmas", text: "${escapeText(textFixed)}" },`
  );
}
const outPath = process.argv[3] || path.replace(/\.(txt|csv)$/i, "-generated.txt");
fs.writeFileSync(outPath, out.join("\n") + "\n", "utf8");
console.log(out.length);
