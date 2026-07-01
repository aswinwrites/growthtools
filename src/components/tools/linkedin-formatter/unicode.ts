// ─── Unicode text transformation utilities ────────────────────────────────────
// LinkedIn doesn't support native formatting, so we use Unicode math symbols.

function mapChar(
  char: string,
  upperBase: number,
  lowerBase: number,
  digitBase?: number,
  exceptions?: Record<string, string>
): string {
  if (exceptions?.[char]) return exceptions[char];
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + (code - 65));
  if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + (code - 97));
  if (digitBase !== undefined && code >= 48 && code <= 57)
    return String.fromCodePoint(digitBase + (code - 48));
  return char;
}

function transform(
  text: string,
  upperBase: number,
  lowerBase: number,
  digitBase?: number,
  exceptions?: Record<string, string>
): string {
  return text
    .split("")
    .map((c) => mapChar(c, upperBase, lowerBase, digitBase, exceptions))
    .join("");
}

// Italic has a gap at U+1D455 (italic h → ℎ)
const ITALIC_EXCEPTIONS: Record<string, string> = { h: "ℎ" };

// Script has several replacements
const SCRIPT_EXCEPTIONS: Record<string, string> = {
  B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ",
  I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ",
  e: "ℯ", g: "ℊ", o: "ℴ",
};

// Double-struck exceptions
const DOUBLE_STRUCK_EXCEPTIONS: Record<string, string> = {
  C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ",
  Q: "ℚ", R: "ℝ", Z: "ℤ",
};

export type FormatKey =
  | "normal" | "bold" | "italic" | "boldItalic"
  | "sansBold" | "sansItalic" | "sansBoldItalic"
  | "script" | "monospace" | "doubleStruck"
  | "strikethrough" | "underline"
  | "uppercase" | "lowercase"
  | "bulletList" | "numberList" | "checkList" | "arrowList";

export function applyFormat(text: string, key: FormatKey): string {
  switch (key) {
    case "normal":
      return text;
    case "bold":
      return transform(text, 0x1D400, 0x1D41A, 0x1D7CE);
    case "italic":
      return transform(text, 0x1D434, 0x1D44E, undefined, ITALIC_EXCEPTIONS);
    case "boldItalic":
      return transform(text, 0x1D468, 0x1D482);
    case "sansBold":
      return transform(text, 0x1D5D4, 0x1D5EE, 0x1D7EC);
    case "sansItalic":
      return transform(text, 0x1D608, 0x1D622);
    case "sansBoldItalic":
      return transform(text, 0x1D63C, 0x1D656);
    case "script":
      return transform(text, 0x1D49C, 0x1D4B6, undefined, SCRIPT_EXCEPTIONS);
    case "monospace":
      return transform(text, 0x1D670, 0x1D68A, 0x1D7F6);
    case "doubleStruck":
      return transform(text, 0x1D538, 0x1D552, 0x1D7D8, DOUBLE_STRUCK_EXCEPTIONS);
    case "strikethrough":
      return text.split("").map((c) => (c === " " ? c : c + "̶")).join("");
    case "underline":
      return text.split("").map((c) => (c === " " ? c : c + "̲")).join("");
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "bulletList":
      return text
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `• ${l.trim()}`)
        .join("\n");
    case "numberList":
      return text
        .split("\n")
        .filter((l) => l.trim())
        .map((l, i) => `${i + 1}. ${l.trim()}`)
        .join("\n");
    case "checkList":
      return text
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `☐ ${l.trim()}`)
        .join("\n");
    case "arrowList":
      return text
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `→ ${l.trim()}`)
        .join("\n");
    default:
      return text;
  }
}

// Preview snippet for format buttons
const PREVIEW_TEXT = "LinkedIn";

export const FORMAT_PREVIEW: Record<FormatKey, string> = {
  normal:        PREVIEW_TEXT,
  bold:          applyFormat(PREVIEW_TEXT, "bold"),
  italic:        applyFormat(PREVIEW_TEXT, "italic"),
  boldItalic:    applyFormat(PREVIEW_TEXT, "boldItalic"),
  sansBold:      applyFormat(PREVIEW_TEXT, "sansBold"),
  sansItalic:    applyFormat(PREVIEW_TEXT, "sansItalic"),
  sansBoldItalic:applyFormat(PREVIEW_TEXT, "sansBoldItalic"),
  script:        applyFormat(PREVIEW_TEXT, "script"),
  monospace:     applyFormat(PREVIEW_TEXT, "monospace"),
  doubleStruck:  applyFormat(PREVIEW_TEXT, "doubleStruck"),
  strikethrough: applyFormat(PREVIEW_TEXT, "strikethrough"),
  underline:     applyFormat(PREVIEW_TEXT, "underline"),
  uppercase:     PREVIEW_TEXT.toUpperCase(),
  lowercase:     PREVIEW_TEXT.toLowerCase(),
  bulletList:    "• Items",
  numberList:    "1. Items",
  checkList:     "☐ Items",
  arrowList:     "→ Items",
};
