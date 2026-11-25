import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse: blame the human's own instruction, followed too faithfully.
// The turn: the bug isn't a deviation from the spec — it carries the
// human's own signature, because the agent did exactly what it was told.
const line =
  "I followed your instructions exactly, so technically the bug has your signature on it.";

const charCount = [...line].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`Entry line must be 1-200 characters, got ${charCount}`);
}
if (line.trim().length === 0) {
  throw new Error("Entry line must not be only whitespace");
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("Entry must be exactly one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line + "\n", "utf8");

// Verify the round trip: exactly one line, same content, in range.
const written = readFileSync(outPath, "utf8");
const writtenLine = written.replace(/\n$/, "");
if (writtenLine !== line || [...writtenLine].length !== charCount) {
  throw new Error("Written entry does not match the validated line");
}
