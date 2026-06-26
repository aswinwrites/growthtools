import type { OperationDef, ParsedFile, OperationConfig, ResultData } from './types';

// ─── Operation Definitions ────────────────────────────────────────────────────

export const OPERATION_DEFS: OperationDef[] = [
  // ── LOOKUP ──────────────────────────────────────────────────────────────────
  {
    id: 'vlookup',
    group: 'lookup',
    label: 'VLOOKUP',
    description: 'Look up rows in File 2 by a key and append selected columns to File 1',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Lookup column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Match column (File 2)', type: 'column-select', fileIndex: 1, required: true },
      { id: 'returnCols', label: 'Columns to add from File 2', type: 'column-multi-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'xlookup',
    group: 'lookup',
    label: 'XLOOKUP',
    description: 'Like VLOOKUP but return exactly one column with a custom fallback value',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Lookup column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Match column (File 2)', type: 'column-select', fileIndex: 1, required: true },
      { id: 'returnCol', label: 'Return column (File 2)', type: 'column-select', fileIndex: 1, required: true },
      { id: 'fallback', label: 'Value if not found', type: 'text', placeholder: 'Leave blank for empty', required: false },
    ],
  },
  {
    id: 'index-match',
    group: 'lookup',
    label: 'INDEX-MATCH',
    description: 'Match a value in one File 2 column, return a value from a different File 2 column',
    fileCount: 2,
    configFields: [
      { id: 'lookupValue', label: 'Lookup column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'matchCol', label: 'Match in column (File 2)', type: 'column-select', fileIndex: 1, required: true },
      { id: 'indexCol', label: 'Return from column (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'left-join',
    group: 'lookup',
    label: 'Left Join',
    description: 'Keep all rows from File 1, merge matching columns from File 2 (SQL LEFT JOIN)',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Join key (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Join key (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'right-join',
    group: 'lookup',
    label: 'Right Join',
    description: 'Keep all rows from File 2, merge matching columns from File 1 (SQL RIGHT JOIN)',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Join key (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Join key (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'inner-join',
    group: 'lookup',
    label: 'Inner Join',
    description: 'Keep only rows that match in both files (SQL INNER JOIN)',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Join key (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Join key (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'full-join',
    group: 'lookup',
    label: 'Full Outer Join',
    description: 'Keep all rows from both files, merging where keys match (SQL FULL OUTER JOIN)',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Join key (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Join key (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  // ── COMPARE ─────────────────────────────────────────────────────────────────
  {
    id: 'find-missing',
    group: 'compare',
    label: 'Find Missing',
    description: 'Return rows in File 1 whose key does not exist in File 2',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Key column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Key column (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'find-duplicates',
    group: 'compare',
    label: 'Find Duplicates',
    description: 'Return rows from File 1 whose key also exists in File 2',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Key column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Key column (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  {
    id: 'detect-changes',
    group: 'compare',
    label: 'Detect Changes',
    description: 'Find rows where values changed between File 1 (old) and File 2 (new)',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Key column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Key column (File 2)', type: 'column-select', fileIndex: 1, required: true },
      { id: 'compareCols', label: 'Columns to compare (File 1)', type: 'column-multi-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'highlight-diff',
    group: 'compare',
    label: 'Highlight Differences',
    description: 'Side-by-side view of matched rows showing File 1 vs File 2 values',
    fileCount: 2,
    configFields: [
      { id: 'keyCol1', label: 'Key column (File 1)', type: 'column-select', fileIndex: 0, required: true },
      { id: 'keyCol2', label: 'Key column (File 2)', type: 'column-select', fileIndex: 1, required: true },
    ],
  },
  // ── CLEAN ───────────────────────────────────────────────────────────────────
  {
    id: 'remove-duplicates',
    group: 'clean',
    label: 'Remove Duplicates',
    description: 'Remove duplicate rows based on selected columns (blank = dedupe on all columns)',
    fileCount: 1,
    configFields: [
      { id: 'dedupCols', label: 'Deduplicate by (leave blank for all columns)', type: 'column-multi-select', fileIndex: 0, required: false },
    ],
  },
  {
    id: 'remove-blank-rows',
    group: 'clean',
    label: 'Remove Blank Rows',
    description: 'Delete rows where every cell is empty or whitespace-only',
    fileCount: 1,
    configFields: [],
  },
  {
    id: 'remove-empty-cols',
    group: 'clean',
    label: 'Remove Empty Columns',
    description: 'Drop columns that contain no data across all rows',
    fileCount: 1,
    configFields: [],
  },
  {
    id: 'trim-whitespace',
    group: 'clean',
    label: 'Trim Whitespace',
    description: 'Strip leading and trailing spaces from every cell in the spreadsheet',
    fileCount: 1,
    configFields: [],
  },
  {
    id: 'uppercase',
    group: 'clean',
    label: 'UPPERCASE',
    description: 'Convert text in selected columns to UPPERCASE',
    fileCount: 1,
    configFields: [
      { id: 'cols', label: 'Columns to convert', type: 'column-multi-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'lowercase',
    group: 'clean',
    label: 'lowercase',
    description: 'Convert text in selected columns to lowercase',
    fileCount: 1,
    configFields: [
      { id: 'cols', label: 'Columns to convert', type: 'column-multi-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'proper-case',
    group: 'clean',
    label: 'Proper Case',
    description: 'Convert text in selected columns to Title Case',
    fileCount: 1,
    configFields: [
      { id: 'cols', label: 'Columns to convert', type: 'column-multi-select', fileIndex: 0, required: true },
    ],
  },
  // ── TRANSFORM ───────────────────────────────────────────────────────────────
  {
    id: 'split-column',
    group: 'transform',
    label: 'Split Column',
    description: 'Split one column into multiple columns by a delimiter character',
    fileCount: 1,
    configFields: [
      { id: 'col', label: 'Column to split', type: 'column-select', fileIndex: 0, required: true },
      { id: 'delimiter', label: 'Delimiter', type: 'text', placeholder: 'e.g. , or | or space', required: true },
    ],
  },
  {
    id: 'merge-columns',
    group: 'transform',
    label: 'Merge Columns',
    description: 'Combine multiple columns into a single new column with a separator',
    fileCount: 1,
    configFields: [
      { id: 'cols', label: 'Columns to merge (in order)', type: 'column-multi-select', fileIndex: 0, required: true },
      { id: 'separator', label: 'Separator', type: 'text', placeholder: 'e.g.  (space) or , or |', required: false },
      { id: 'newColName', label: 'New column name', type: 'text', placeholder: 'merged', required: false },
    ],
  },
  {
    id: 'extract-emails',
    group: 'transform',
    label: 'Extract Emails',
    description: 'Extract email addresses from a text column into a new column',
    fileCount: 1,
    configFields: [
      { id: 'col', label: 'Source column', type: 'column-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'extract-domains',
    group: 'transform',
    label: 'Extract Domains',
    description: 'Extract domain names from email addresses or full URLs',
    fileCount: 1,
    configFields: [
      { id: 'col', label: 'Email or URL column', type: 'column-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'extract-numbers',
    group: 'transform',
    label: 'Extract Numbers',
    description: 'Pull all numeric values out of a text column into a new column',
    fileCount: 1,
    configFields: [
      { id: 'col', label: 'Source column', type: 'column-select', fileIndex: 0, required: true },
    ],
  },
  {
    id: 'extract-text',
    group: 'transform',
    label: 'Extract Text',
    description: 'Extract the text before or after a delimiter in a column',
    fileCount: 1,
    configFields: [
      { id: 'col', label: 'Source column', type: 'column-select', fileIndex: 0, required: true },
      { id: 'delimiter', label: 'Delimiter', type: 'text', placeholder: 'e.g. @ or - or :', required: true },
      { id: 'position', label: 'Extract', type: 'select', options: ['before', 'after'], required: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Rows = Record<string, string>[];

function buildLookup(rows: Rows, keyCol: string): Map<string, Record<string, string>> {
  const map = new Map<string, Record<string, string>>();
  for (const row of rows) {
    const key = (row[keyCol] ?? '').trim().toLowerCase();
    if (!map.has(key)) map.set(key, row);
  }
  return map;
}

function toProper(s: string): string {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

function extractDomain(val: string): string {
  const emailMatch = val.match(EMAIL_RE)?.[0];
  if (emailMatch) return emailMatch.split('@')[1].toLowerCase();
  try {
    const url = val.startsWith('http') ? val : `https://${val}`;
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// ─── Operation Implementations ────────────────────────────────────────────────

function opVlookup(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const returnCols = Array.isArray(cfg.returnCols) ? cfg.returnCols : [cfg.returnCols as string];
  const lookup = buildLookup(f2.rows, keyCol2);
  let matched = 0;
  const rows = f1.rows.map((row) => {
    const key = (row[keyCol1] ?? '').trim().toLowerCase();
    const match = lookup.get(key);
    if (match) matched++;
    const extra: Record<string, string> = {};
    for (const col of returnCols) extra[col] = match ? (match[col] ?? '') : '';
    return { ...row, ...extra };
  });
  const newCols = returnCols.filter((c) => !f1.headers.includes(c));
  return {
    headers: [...f1.headers, ...newCols],
    rows,
    summary: `${matched.toLocaleString()} of ${f1.rows.length.toLocaleString()} rows matched`,
  };
}

function opXlookup(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const returnCol = cfg.returnCol as string;
  const fallback = (cfg.fallback as string) ?? '';
  const lookup = buildLookup(f2.rows, keyCol2);
  let matched = 0;
  const rows = f1.rows.map((row) => {
    const key = (row[keyCol1] ?? '').trim().toLowerCase();
    const match = lookup.get(key);
    if (match) matched++;
    return { ...row, [returnCol]: match ? (match[returnCol] ?? fallback) : fallback };
  });
  const headers = [...f1.headers, ...(f1.headers.includes(returnCol) ? [] : [returnCol])];
  return {
    headers,
    rows,
    summary: `${matched.toLocaleString()} of ${f1.rows.length.toLocaleString()} rows matched`,
  };
}

function opIndexMatch(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const lookupCol = cfg.lookupValue as string;
  const matchCol = cfg.matchCol as string;
  const indexCol = cfg.indexCol as string;
  const lookup = buildLookup(f2.rows, matchCol);
  let matched = 0;
  const rows = f1.rows.map((row) => {
    const key = (row[lookupCol] ?? '').trim().toLowerCase();
    const match = lookup.get(key);
    if (match) matched++;
    return { ...row, [indexCol]: match ? (match[indexCol] ?? '') : '' };
  });
  const headers = [...f1.headers, ...(f1.headers.includes(indexCol) ? [] : [indexCol])];
  return {
    headers,
    rows,
    summary: `${matched.toLocaleString()} of ${f1.rows.length.toLocaleString()} rows matched`,
  };
}

function opLeftJoin(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const extraHeaders = f2.headers.filter((h) => !f1.headers.includes(h));
  const lookup = buildLookup(f2.rows, keyCol2);
  const rows = f1.rows.map((row) => {
    const key = (row[keyCol1] ?? '').trim().toLowerCase();
    const match = lookup.get(key);
    const extra: Record<string, string> = {};
    for (const h of extraHeaders) extra[h] = match ? (match[h] ?? '') : '';
    return { ...row, ...extra };
  });
  return {
    headers: [...f1.headers, ...extraHeaders],
    rows,
    summary: `${rows.length.toLocaleString()} rows (all from File 1)`,
  };
}

function opRightJoin(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const lookup1 = buildLookup(f1.rows, keyCol1);
  const extraHeaders1 = f1.headers.filter((h) => h !== keyCol1 && !f2.headers.includes(h));
  const allHeaders = [...f2.headers, ...extraHeaders1];
  const rows = f2.rows.map((row) => {
    const key = (row[keyCol2] ?? '').trim().toLowerCase();
    const match = lookup1.get(key);
    const extra: Record<string, string> = {};
    for (const h of extraHeaders1) extra[h] = match ? (match[h] ?? '') : '';
    return { ...row, ...extra };
  });
  return {
    headers: allHeaders,
    rows,
    summary: `${rows.length.toLocaleString()} rows (all from File 2)`,
  };
}

function opInnerJoin(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const extraHeaders = f2.headers.filter((h) => !f1.headers.includes(h));
  const lookup = buildLookup(f2.rows, keyCol2);
  const rows: Rows = [];
  for (const row of f1.rows) {
    const key = (row[keyCol1] ?? '').trim().toLowerCase();
    const match = lookup.get(key);
    if (!match) continue;
    const extra: Record<string, string> = {};
    for (const h of extraHeaders) extra[h] = match[h] ?? '';
    rows.push({ ...row, ...extra });
  }
  return {
    headers: [...f1.headers, ...extraHeaders],
    rows,
    summary: `${rows.length.toLocaleString()} rows matched in both files`,
  };
}

function opFullJoin(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const extraHeaders2 = f2.headers.filter((h) => !f1.headers.includes(h));
  const allHeaders = [...f1.headers, ...extraHeaders2];
  const lookup2 = buildLookup(f2.rows, keyCol2);
  const matchedKeys = new Set<string>();
  // Left side: all from f1
  const rows: Rows = f1.rows.map((row) => {
    const key = (row[keyCol1] ?? '').trim().toLowerCase();
    const match = lookup2.get(key);
    if (match) matchedKeys.add(key);
    const extra: Record<string, string> = {};
    for (const h of extraHeaders2) extra[h] = match ? (match[h] ?? '') : '';
    return { ...row, ...extra };
  });
  // Right side: f2 rows with no match in f1
  for (const row2 of f2.rows) {
    const key = (row2[keyCol2] ?? '').trim().toLowerCase();
    if (matchedKeys.has(key)) continue;
    const merged: Record<string, string> = {};
    for (const h of f1.headers) merged[h] = h === keyCol1 ? (row2[keyCol2] ?? '') : '';
    for (const h of extraHeaders2) merged[h] = row2[h] ?? '';
    rows.push(merged);
  }
  return {
    headers: allHeaders,
    rows,
    summary: `${rows.length.toLocaleString()} total rows from both files`,
  };
}

function opFindMissing(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const keys2 = new Set(f2.rows.map((r) => (r[keyCol2] ?? '').trim().toLowerCase()));
  const rows = f1.rows.filter((r) => !keys2.has((r[keyCol1] ?? '').trim().toLowerCase()));
  return {
    headers: f1.headers,
    rows,
    summary: `${rows.length.toLocaleString()} rows in File 1 are missing from File 2`,
  };
}

function opFindDuplicates(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const keys2 = new Set(f2.rows.map((r) => (r[keyCol2] ?? '').trim().toLowerCase()));
  const rows = f1.rows.filter((r) => keys2.has((r[keyCol1] ?? '').trim().toLowerCase()));
  return {
    headers: f1.headers,
    rows,
    summary: `${rows.length.toLocaleString()} rows exist in both files`,
  };
}

function opDetectChanges(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const compareCols = Array.isArray(cfg.compareCols) ? cfg.compareCols : [cfg.compareCols as string];
  const lookup2 = buildLookup(f2.rows, keyCol2);
  const resultRows: Rows = [];
  for (const row1 of f1.rows) {
    const key = (row1[keyCol1] ?? '').trim().toLowerCase();
    const row2 = lookup2.get(key);
    if (!row2) continue;
    const changed: string[] = [];
    for (const col of compareCols) {
      if ((row1[col] ?? '') !== (row2[col] ?? '')) changed.push(col);
    }
    if (changed.length === 0) continue;
    const result: Record<string, string> = { ...row1, _changed_columns: changed.join(', ') };
    for (const col of compareCols) result[`${col} (new)`] = row2[col] ?? '';
    resultRows.push(result);
  }
  const newCols = compareCols.map((c) => `${c} (new)`);
  return {
    headers: [...f1.headers, '_changed_columns', ...newCols],
    rows: resultRows,
    summary: `${resultRows.length.toLocaleString()} rows with changes detected`,
  };
}

function opHighlightDiff(f1: ParsedFile, f2: ParsedFile, cfg: OperationConfig): ResultData {
  const keyCol1 = cfg.keyCol1 as string;
  const keyCol2 = cfg.keyCol2 as string;
  const lookup2 = buildLookup(f2.rows, keyCol2);
  const commonCols = f1.headers.filter((h) => h !== keyCol1 && f2.headers.includes(h));
  const resultRows: Rows = [];
  for (const row1 of f1.rows) {
    const key = (row1[keyCol1] ?? '').trim().toLowerCase();
    const row2 = lookup2.get(key);
    if (!row2) continue;
    const result: Record<string, string> = { [keyCol1]: row1[keyCol1] ?? '' };
    let hasDiff = false;
    for (const col of commonCols) {
      const v1 = row1[col] ?? '';
      const v2 = row2[col] ?? '';
      result[`${col} (File 1)`] = v1;
      result[`${col} (File 2)`] = v2;
      if (v1 !== v2) hasDiff = true;
    }
    result['_changed'] = hasDiff ? 'YES' : 'no';
    resultRows.push(result);
  }
  const diffCount = resultRows.filter((r) => r['_changed'] === 'YES').length;
  const headers = [
    keyCol1,
    ...commonCols.flatMap((c) => [`${c} (File 1)`, `${c} (File 2)`]),
    '_changed',
  ];
  return {
    headers,
    rows: resultRows,
    summary: `${diffCount.toLocaleString()} rows differ out of ${resultRows.length.toLocaleString()} matched`,
  };
}

function opRemoveDuplicates(f: ParsedFile, cfg: OperationConfig): ResultData {
  const cols = Array.isArray(cfg.dedupCols)
    ? cfg.dedupCols
    : cfg.dedupCols
    ? [cfg.dedupCols as string]
    : [];
  const keyCols = cols.length > 0 ? cols : f.headers;
  const seen = new Set<string>();
  const rows = f.rows.filter((row) => {
    const key = keyCols.map((c) => row[c] ?? '').join('\x00');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const removed = f.rows.length - rows.length;
  return {
    headers: f.headers,
    rows,
    summary: `Removed ${removed.toLocaleString()} duplicates — ${rows.length.toLocaleString()} rows remain`,
  };
}

function opRemoveBlankRows(f: ParsedFile): ResultData {
  const rows = f.rows.filter((row) => f.headers.some((h) => (row[h] ?? '').trim() !== ''));
  return {
    headers: f.headers,
    rows,
    summary: `Removed ${(f.rows.length - rows.length).toLocaleString()} blank rows`,
  };
}

function opRemoveEmptyCols(f: ParsedFile): ResultData {
  const nonEmpty = f.headers.filter((h) => f.rows.some((r) => (r[h] ?? '').trim() !== ''));
  const rows = f.rows.map((r) => {
    const out: Record<string, string> = {};
    for (const h of nonEmpty) out[h] = r[h] ?? '';
    return out;
  });
  return {
    headers: nonEmpty,
    rows,
    summary: `Removed ${f.headers.length - nonEmpty.length} empty columns`,
  };
}

function opTrimWhitespace(f: ParsedFile): ResultData {
  const rows = f.rows.map((r) => {
    const out: Record<string, string> = {};
    for (const h of f.headers) out[h] = (r[h] ?? '').trim();
    return out;
  });
  return { headers: f.headers, rows, summary: `Trimmed whitespace from ${f.rows.length.toLocaleString()} rows` };
}

function opChangeCase(f: ParsedFile, cfg: OperationConfig, mode: 'upper' | 'lower' | 'proper'): ResultData {
  const cols = Array.isArray(cfg.cols) ? cfg.cols : [cfg.cols as string];
  const colSet = new Set(cols);
  const rows = f.rows.map((r) => {
    const out: Record<string, string> = { ...r };
    for (const h of cols) {
      if (!colSet.has(h)) continue;
      const v = r[h] ?? '';
      out[h] = mode === 'upper' ? v.toUpperCase() : mode === 'lower' ? v.toLowerCase() : toProper(v);
    }
    return out;
  });
  const label = mode === 'upper' ? 'UPPERCASE' : mode === 'lower' ? 'lowercase' : 'Proper Case';
  return {
    headers: f.headers,
    rows,
    summary: `Applied ${label} to ${cols.join(', ')}`,
  };
}

function opSplitColumn(f: ParsedFile, cfg: OperationConfig): ResultData {
  const col = cfg.col as string;
  const delim = (cfg.delimiter as string) || ',';
  const maxParts = Math.max(...f.rows.map((r) => (r[col] ?? '').split(delim).length), 1);
  const newCols = Array.from({ length: maxParts }, (_, i) => `${col}_${i + 1}`);
  const colIdx = f.headers.indexOf(col);
  const headers = [
    ...f.headers.slice(0, colIdx + 1),
    ...newCols,
    ...f.headers.slice(colIdx + 1),
  ];
  const rows = f.rows.map((r) => {
    const parts = (r[col] ?? '').split(delim);
    const out: Record<string, string> = { ...r };
    for (let i = 0; i < maxParts; i++) out[newCols[i]] = (parts[i] ?? '').trim();
    return out;
  });
  return {
    headers,
    rows,
    summary: `Split "${col}" into ${maxParts} columns using "${delim}"`,
  };
}

function opMergeColumns(f: ParsedFile, cfg: OperationConfig): ResultData {
  const cols = Array.isArray(cfg.cols) ? cfg.cols : [cfg.cols as string];
  const sep = (cfg.separator as string) ?? ' ';
  const newName = (cfg.newColName as string) || cols.join('_');
  const rows = f.rows.map((r) => ({
    ...r,
    [newName]: cols.map((c) => r[c] ?? '').join(sep),
  }));
  return {
    headers: [...f.headers, ...(f.headers.includes(newName) ? [] : [newName])],
    rows,
    summary: `Merged ${cols.join(' + ')} → "${newName}"`,
  };
}

function opExtractEmails(f: ParsedFile, cfg: OperationConfig): ResultData {
  const col = cfg.col as string;
  const newCol = `${col}_email`;
  const rows = f.rows.map((r) => {
    const matches = (r[col] ?? '').match(new RegExp(EMAIL_RE.source, 'g')) ?? [];
    return { ...r, [newCol]: matches.join(', ') };
  });
  const found = rows.filter((r) => r[newCol]).length;
  return {
    headers: [...f.headers, newCol],
    rows,
    summary: `Found emails in ${found.toLocaleString()} of ${f.rows.length.toLocaleString()} rows`,
  };
}

function opExtractDomains(f: ParsedFile, cfg: OperationConfig): ResultData {
  const col = cfg.col as string;
  const newCol = `${col}_domain`;
  const rows = f.rows.map((r) => ({ ...r, [newCol]: extractDomain(r[col] ?? '') }));
  const found = rows.filter((r) => r[newCol]).length;
  return {
    headers: [...f.headers, newCol],
    rows,
    summary: `Extracted domains from ${found.toLocaleString()} rows`,
  };
}

function opExtractNumbers(f: ParsedFile, cfg: OperationConfig): ResultData {
  const col = cfg.col as string;
  const newCol = `${col}_numbers`;
  const rows = f.rows.map((r) => {
    const nums = (r[col] ?? '').match(/-?\d+(?:\.\d+)?/g) ?? [];
    return { ...r, [newCol]: nums.join(', ') };
  });
  const found = rows.filter((r) => r[newCol]).length;
  return {
    headers: [...f.headers, newCol],
    rows,
    summary: `Extracted numbers from ${found.toLocaleString()} rows`,
  };
}

function opExtractText(f: ParsedFile, cfg: OperationConfig): ResultData {
  const col = cfg.col as string;
  const delim = cfg.delimiter as string;
  const pos = cfg.position as string;
  const newCol = `${col}_extracted`;
  const rows = f.rows.map((r) => {
    const val = r[col] ?? '';
    const idx = val.indexOf(delim);
    let result = '';
    if (idx !== -1) {
      result = pos === 'before' ? val.slice(0, idx).trim() : val.slice(idx + delim.length).trim();
    }
    return { ...r, [newCol]: result };
  });
  const found = rows.filter((r) => r[newCol]).length;
  return {
    headers: [...f.headers, newCol],
    rows,
    summary: `Extracted text ${pos} "${delim}" from ${found.toLocaleString()} rows`,
  };
}

// ─── Main Dispatcher ──────────────────────────────────────────────────────────

export function runOperation(
  opId: string,
  files: (ParsedFile | null)[],
  config: OperationConfig
): ResultData {
  const f1 = files[0]!;
  const f2 = files[1]!;
  switch (opId) {
    case 'vlookup':          return opVlookup(f1, f2, config);
    case 'xlookup':          return opXlookup(f1, f2, config);
    case 'index-match':      return opIndexMatch(f1, f2, config);
    case 'left-join':        return opLeftJoin(f1, f2, config);
    case 'right-join':       return opRightJoin(f1, f2, config);
    case 'inner-join':       return opInnerJoin(f1, f2, config);
    case 'full-join':        return opFullJoin(f1, f2, config);
    case 'find-missing':     return opFindMissing(f1, f2, config);
    case 'find-duplicates':  return opFindDuplicates(f1, f2, config);
    case 'detect-changes':   return opDetectChanges(f1, f2, config);
    case 'highlight-diff':   return opHighlightDiff(f1, f2, config);
    case 'remove-duplicates':return opRemoveDuplicates(f1, config);
    case 'remove-blank-rows':return opRemoveBlankRows(f1);
    case 'remove-empty-cols':return opRemoveEmptyCols(f1);
    case 'trim-whitespace':  return opTrimWhitespace(f1);
    case 'uppercase':        return opChangeCase(f1, config, 'upper');
    case 'lowercase':        return opChangeCase(f1, config, 'lower');
    case 'proper-case':      return opChangeCase(f1, config, 'proper');
    case 'split-column':     return opSplitColumn(f1, config);
    case 'merge-columns':    return opMergeColumns(f1, config);
    case 'extract-emails':   return opExtractEmails(f1, config);
    case 'extract-domains':  return opExtractDomains(f1, config);
    case 'extract-numbers':  return opExtractNumbers(f1, config);
    case 'extract-text':     return opExtractText(f1, config);
    default: throw new Error(`Unknown operation: ${opId}`);
  }
}
