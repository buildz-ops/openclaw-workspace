import { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  className?: string;
}

export default function DataTable<T>({ columns, data, className = "" }: DataTableProps<T>) {
  return (
    <table className={`data-table ${className}`.trim()}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className={`data-table-header ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-8 text-meta">
              NO DATA AVAILABLE
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="data-table-row">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`${col.className || ""} ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
