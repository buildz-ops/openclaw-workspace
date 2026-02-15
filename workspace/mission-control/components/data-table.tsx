interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  title?: string;
  columns: Column[];
  data: Record<string, any>[];
  icon?: React.ReactNode;
}

export default function DataTable({ title, columns, data, icon }: DataTableProps) {
  return (
    <div className="glass-panel rounded-sm p-5">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-mission-cyan">{icon}</span>}
          <h3 className="text-mono-upper text-sm tracking-widest">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align || "left" }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || "left" }}>
                    {row[col.key]}
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
