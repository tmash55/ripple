// Generates the permanent card codes for the GENESIS batch — ONCE.
//
// These codes are printed and laminated. They can never change. The script
// refuses to run if data/genesis-codes.json already exists; do not delete
// that file to "regenerate" — every printed card would stop working.
//
//   node scripts/generate-genesis-codes.mjs
import { randomInt } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "genesis-codes.json",
);
const COUNT = 50;
const LENGTH = 6;
// No 0/O/1/I/L (look-alikes) and no vowels at all, so a code can never
// accidentally spell a word.
const ALPHABET = "23456789BCDFGHJKMNPQRSTVWXYZ";

if (existsSync(OUT)) {
  console.error(`Refusing to overwrite ${OUT} — genesis codes are permanent.`);
  process.exit(1);
}

const codes = new Set();
while (codes.size < COUNT) {
  let code = "";
  for (let i = 0; i < LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  codes.add(code);
}

const cards = [...codes].map((code, i) => ({
  number: String(i + 1).padStart(6, "0"),
  code,
}));

writeFileSync(
  OUT,
  JSON.stringify(
    {
      _warning:
        "PERMANENT. These codes are printed on laminated cards. Never edit, reorder, or regenerate.",
      batch: "GENESIS",
      generatedAt: new Date().toISOString(),
      alphabet: ALPHABET,
      cards,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Wrote ${cards.length} codes to ${OUT}`);
