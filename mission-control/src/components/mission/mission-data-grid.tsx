import { ReactNode } from "react";

export interface MissionColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
}

interface MissionDataGridProps<T> {
  columns: Array<MissionColumn<T>>;
  rows: T[];
  emptyText: string;
}

export default function MissionDataGrid<T>({ columns, rows, emptyText }: MissionDataGridProps<T>) {
  return (
    <div className="mc-table-wrap">
      <table className="mc-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={
                  column.align === "right"
                    ? "text-right"
                    : column.align === "center"
                      ? "text-center"
                      : "text-left"
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="mc-empty-cell">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => {
                  const key = column.key as keyof T;
                  const value = row[key];
                  return (
                    <td
                      key={String(column.key)}
                      className={
                        column.align === "right"
                          ? "text-right"
                          : column.align === "center"
                            ? "text-center"
                            : "text-left"
                      }
                    >
                      {column.render ? column.render(row) : String(value ?? "-")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
