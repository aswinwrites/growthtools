export interface ParsedFile {
  name: string;
  headers: string[];
  rows: Record<string, string>[];
}

export type OperationGroup = 'lookup' | 'compare' | 'clean' | 'transform';

export type OperationId =
  // Lookup (2-file)
  | 'vlookup'
  | 'xlookup'
  | 'index-match'
  | 'left-join'
  | 'right-join'
  | 'inner-join'
  | 'full-join'
  // Compare (2-file)
  | 'find-missing'
  | 'find-duplicates'
  | 'detect-changes'
  | 'highlight-diff'
  // Clean (1-file)
  | 'remove-duplicates'
  | 'remove-blank-rows'
  | 'remove-empty-cols'
  | 'trim-whitespace'
  | 'uppercase'
  | 'lowercase'
  | 'proper-case'
  // Transform (1-file)
  | 'split-column'
  | 'merge-columns'
  | 'extract-emails'
  | 'extract-domains'
  | 'extract-numbers'
  | 'extract-text';

export type ConfigFieldType = 'column-select' | 'column-multi-select' | 'text' | 'select';

export interface ConfigField {
  id: string;
  label: string;
  type: ConfigFieldType;
  fileIndex?: 0 | 1;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface OperationDef {
  id: OperationId;
  group: OperationGroup;
  label: string;
  description: string;
  fileCount: 1 | 2;
  configFields: ConfigField[];
}

export type OperationConfig = Record<string, string | string[]>;

export interface ResultData {
  headers: string[];
  rows: Record<string, string>[];
  summary: string;
}
