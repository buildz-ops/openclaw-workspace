import fs from "fs";
import path from "path";

export function readFileIfExists(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function fileMtime(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.statSync(filePath).mtime.toISOString();
}

export function fileSize(filePath: string): number {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

export function listFilesRecursive(root: string, extension?: string): string[] {
  if (!fs.existsSync(root)) return [];
  const output: string[] = [];

  const visit = (dirPath: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (extension && !entry.name.endsWith(extension)) {
        continue;
      }

      output.push(fullPath);
    }
  };

  visit(root);
  return output;
}

export function parseNumber(input: string | undefined): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[,$%]/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
