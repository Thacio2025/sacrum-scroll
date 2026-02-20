#!/usr/bin/env node
/**
 * Gera ícones PWA 192x192 e 512x512 a partir de public/og-image.png.
 * Necessário para o manifest e para a Google Play (TWA).
 * Uso: node scripts/generate-pwa-icons.mjs
 */
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");
const srcPath = join(publicDir, "og-image.png");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Instale sharp: npm i -D sharp");
    process.exit(1);
  }

  const sizes = [192, 512];
  mkdirSync(iconsDir, { recursive: true });

  const buf = readFileSync(srcPath);
  for (const size of sizes) {
    const outPath = join(iconsDir, `icon-${size}.png`);
    await sharp(buf)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log("Gerado:", outPath);
  }
  console.log("Ícones PWA gerados em public/icons/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
