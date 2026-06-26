"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeftRight,
  Database,
  Trash2,
  Wand2,
  ChevronDown,
  FileText,
  RotateCcw,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OPERATION_DEFS, runOperation } from "./operations";
import type {
  ParsedFile,
  OperationId,
  OperationConfig,
  ResultData,
  OperationGroup,
  ConfigField,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

const GROUPS: OperationGroup[] = ["lookup", "compare", "clean", "transform"];

const GROUP_META: Record<
  OperationGroup,
  { label: string; Icon: React.FC<{ className?: string }>; colorClass: string; bgClass: string }
> = {
  lookup:    { label: "Lookup",    Icon: Database,        colorClass: "text-blue-600",   bgClass: "bg-blue-50"   },
  compare:   { label: "Compare",   Icon: ArrowLeftRight,  colorClass: "text-violet-600", bgClass: "bg-violet-50" },
  clean:     { label: "Clean",     Icon: Filter,          colorClass: "text-emerald-600",bgClass: "bg-emerald-50"},
  transform: { label: "Transform", Icon: Wand2,           colorClass: "text-orange-600", bgClass: "bg-orange-50" },
};

const PREVIEW_ROWS = 200;

// ─── File Parsing ─────────────────────────────────────────────────────────────

async function parseFile(file: File): Promise<ParsedFile> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as Record<string, string>[];
          const headers = results.meta.fields ?? Object.keys(rows[0] ?? {});
          resolve({ name: file.name, headers, rows });
        },
        error: reject,
      });
    });
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const ab = e.target?.result as ArrayBuffer;
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
        const headers = raw.length > 0 ? Object.keys(raw[0]) : [];
        const rows = raw.map((r) => {
          const row: Record<string, string> = {};
          for (const h of headers) row[h] = String(r[h] ?? "");
          return row;
        });
        resolve({ name: file.name, headers, rows });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FileDropZoneProps {
  label: string;
  file: ParsedFile | null;
  onFile: (f: ParsedFile) => void;
  onClear: () => void;
  fileIndex: number;
}

function FileDropZone({ label, file, onFile, onClear, fileIndex }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    async (raw: File | null) => {
      if (!raw) return;
      setError(null);
      setLoading(true);
      try {
        const parsed = await parseFile(raw);
        if (parsed.headers.length === 0) throw new Error("No columns found — check the file format.");
        onFile(parsed);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse file");
      } finally {
        setLoading(false);
      }
    },
    [onFile]
  );

  const colors = fileIndex === 0 ? "border-blue-300 bg-blue-50/50" : "border-violet-300 bg-violet-50/50";
  const activeColor = fileIndex === 0 ? "border-blue-500 bg-blue-100/60" : "border-violet-500 bg-violet-100/60";

  if (file) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {file.rows.length.toLocaleString()} rows · {file.headers.length} columns
          </p>
        </div>
        <button
          onClick={onClear}
          className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleDrop(e.dataTransfer.files[0] ?? null);
        }}
        className={cn(
          "w-full rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-all cursor-pointer",
          dragging ? activeColor : colors,
          "hover:border-opacity-80"
        )}
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        ) : (
          <Upload className="h-6 w-6 text-gray-400" />
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Drop file here or click to browse</p>
          <p className="text-xs text-gray-400 mt-0.5">CSV, XLSX, or XLS</p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => handleDrop(e.target.files?.[0] ?? null)}
      />
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-500 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface ColumnSelectProps {
  field: ConfigField;
  headers: string[];
  value: string;
  onChange: (val: string) => void;
}

function ColumnSelect({ field, headers, value, onChange }: ColumnSelectProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
        {field.label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
      >
        <option value="">Select a column…</option>
        {headers.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </div>
  );
}

interface MultiColumnSelectProps {
  field: ConfigField;
  headers: string[];
  value: string[];
  onChange: (val: string[]) => void;
}

function MultiColumnSelect({ field, headers, value, onChange }: MultiColumnSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (h: string) => {
    onChange(value.includes(h) ? value.filter((v) => v !== h) : [...value, h]);
  };

  const buttonLabel =
    value.length === 0
      ? "Select columns…"
      : value.length === 1
      ? value[0]
      : `${value.length} columns selected`;

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
        {field.label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 hover:border-gray-300 transition-colors"
      >
        <span className={value.length === 0 ? "text-gray-400" : "text-gray-900"}>{buttonLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 top-full mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <button
                type="button"
                onClick={() => onChange(headers)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {headers.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggle(h)}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 text-left transition-colors"
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      value.includes(h)
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    )}
                  >
                    {value.includes(h) && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700 truncate">{h}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ConfigPanelProps {
  fields: ConfigField[];
  files: (ParsedFile | null)[];
  config: OperationConfig;
  onChange: (key: string, val: string | string[]) => void;
}

function ConfigPanel({ fields, files, config, onChange }: ConfigPanelProps) {
  if (fields.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((field) => {
        const fileHeaders = files[field.fileIndex ?? 0]?.headers ?? [];
        if (field.type === "column-select") {
          return (
            <ColumnSelect
              key={field.id}
              field={field}
              headers={fileHeaders}
              value={(config[field.id] as string) ?? ""}
              onChange={(v) => onChange(field.id, v)}
            />
          );
        }
        if (field.type === "column-multi-select") {
          return (
            <MultiColumnSelect
              key={field.id}
              field={field}
              headers={fileHeaders}
              value={(config[field.id] as string[]) ?? []}
              onChange={(v) => onChange(field.id, v)}
            />
          );
        }
        if (field.type === "select") {
          return (
            <div key={field.id}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                {field.label}
              </label>
              <select
                value={(config[field.id] as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              >
                <option value="">Select…</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }
        // text
        return (
          <div key={field.id}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              {field.label}
            </label>
            <input
              type="text"
              value={(config[field.id] as string) ?? ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-gray-400"
            />
          </div>
        );
      })}
    </div>
  );
}

interface ResultsTableProps {
  result: ResultData;
}

function ResultsTable({ result }: ResultsTableProps) {
  const preview = result.rows.slice(0, PREVIEW_ROWS);
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table className="text-xs w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {result.headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap border-r border-gray-100 last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-gray-100 last:border-b-0",
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                {result.headers.map((h) => (
                  <td
                    key={h}
                    className="px-3 py-1.5 text-gray-700 whitespace-nowrap max-w-[220px] truncate border-r border-gray-100 last:border-r-0"
                    title={row[h] ?? ""}
                  >
                    {row[h] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpreadsheetOps() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeGroup, setActiveGroup] = useState<OperationGroup>("lookup");
  const [selectedOpId, setSelectedOpId] = useState<OperationId | null>(null);
  const [files, setFiles] = useState<(ParsedFile | null)[]>([null, null]);
  const [config, setConfig] = useState<OperationConfig>({});
  const [result, setResult] = useState<ResultData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOp = OPERATION_DEFS.find((op) => op.id === selectedOpId) ?? null;
  const groupOps = OPERATION_DEFS.filter((op) => op.group === activeGroup);

  const selectOp = (id: OperationId) => {
    setSelectedOpId(id);
    setFiles([null, null]);
    setConfig({});
    setError(null);
    setResult(null);
    setStep(2);
  };

  const setFile = (idx: number, f: ParsedFile) => {
    setFiles((prev) => {
      const next = [...prev];
      next[idx] = f;
      return next;
    });
    setConfig({}); // reset config when file changes
  };

  const clearFile = (idx: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  const setConfigField = (key: string, val: string | string[]) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const filesReady = selectedOp
    ? files.slice(0, selectedOp.fileCount).every(Boolean)
    : false;

  const configReady = selectedOp
    ? selectedOp.configFields
        .filter((f) => f.required !== false)
        .every((f) => {
          const val = config[f.id];
          if (Array.isArray(val)) return val.length > 0;
          return val !== undefined && val !== "";
        })
    : false;

  const canRun = filesReady && (selectedOp?.configFields.length === 0 || configReady);

  const handleRun = () => {
    if (!selectedOp || !canRun) return;
    setError(null);
    setProcessing(true);
    // Yield to UI then run (keeps spinner visible even for large files)
    setTimeout(() => {
      try {
        const res = runOperation(selectedOp.id, files, config);
        setResult(res);
        setStep(3);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unexpected error occurred");
      } finally {
        setProcessing(false);
      }
    }, 20);
  };

  const downloadCSV = () => {
    if (!result) return;
    const csv = Papa.unparse({ fields: result.headers, data: result.rows });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `result_${selectedOpId}.csv`);
  };

  const downloadXLSX = () => {
    if (!result) return;
    const ws = XLSX.utils.json_to_sheet(result.rows, { header: result.headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `result_${selectedOpId}.xlsx`);
  };

  const reset = () => {
    setStep(1);
    setSelectedOpId(null);
    setFiles([null, null]);
    setConfig({});
    setResult(null);
    setError(null);
    setProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {(["Select", "Configure", "Results"] as const).map((label, i) => {
          const s = (i + 1) as 1 | 2 | 3;
          const active = step === s;
          const done = step > s;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    done ? "bg-emerald-500 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span className={cn("text-sm font-medium", active ? "text-gray-900" : done ? "text-emerald-600" : "text-gray-400")}>
                  {label}
                </span>
              </div>
              {i < 2 && <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Operation Selection ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
          >
            {/* Group tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
              {GROUPS.map((g) => {
                const { label, Icon, colorClass } = GROUP_META[g];
                const active = activeGroup === g;
                return (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      active ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", active && colorClass)} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Operation cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupOps.map((op) => {
                const { Icon, colorClass, bgClass } = GROUP_META[op.group];
                return (
                  <button
                    key={op.id}
                    onClick={() => selectOp(op.id)}
                    className="text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", bgClass)}>
                        <Icon className={cn("h-4 w-4", colorClass)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900">{op.label}</span>
                          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {op.fileCount === 2 ? "2 files" : "1 file"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{op.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Upload + Configure ── */}
        {step === 2 && selectedOp && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            {/* Op header */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => setStep(1)}
                className="mt-0.5 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
              </button>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{selectedOp.label}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedOp.description}</p>
              </div>
            </div>

            {/* File uploads */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {selectedOp.fileCount === 2 ? "Upload Files" : "Upload File"}
              </h3>
              <div className={cn("grid gap-3", selectedOp.fileCount === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                <FileDropZone
                  label="File 1"
                  fileIndex={0}
                  file={files[0]}
                  onFile={(f) => setFile(0, f)}
                  onClear={() => clearFile(0)}
                />
                {selectedOp.fileCount === 2 && (
                  <FileDropZone
                    label="File 2"
                    fileIndex={1}
                    file={files[1]}
                    onFile={(f) => setFile(1, f)}
                    onClear={() => clearFile(1)}
                  />
                )}
              </div>
            </div>

            {/* Column config — only shows when files are loaded */}
            {filesReady && selectedOp.configFields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Configure
                </h3>
                <ConfigPanel
                  fields={selectedOp.configFields}
                  files={files}
                  config={config}
                  onChange={setConfigField}
                />
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={!canRun || processing}
              className={cn(
                "w-full rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                canRun && !processing
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Run {selectedOp.label}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

            {!filesReady && (
              <p className="text-center text-xs text-gray-400">
                Upload {selectedOp.fileCount === 2 ? "both files" : "a file"} to continue
              </p>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: Results ── */}
        {step === 3 && result && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* Summary bar */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{result.summary}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {result.headers.length} columns ·{" "}
                    {result.rows.length.toLocaleString()} rows total
                    {result.rows.length > PREVIEW_ROWS && (
                      <> · showing first {PREVIEW_ROWS.toLocaleString()}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-1.5 rounded-lg bg-white border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </button>
                <button
                  onClick={downloadXLSX}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  XLSX
                </button>
              </div>
            </div>

            {/* Table */}
            {result.rows.length > 0 ? (
              <ResultsTable result={result} />
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center">
                <p className="text-sm text-gray-500">No rows returned by this operation.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep(2); setResult(null); setError(null); }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                New operation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
