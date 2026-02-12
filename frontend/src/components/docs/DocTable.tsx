interface DocTableProps {
  headers: [string, string];
  rows: [string, string][];
  highlightFirst?: boolean;
}

export default function DocTable({
  headers,
  rows,
  highlightFirst = true,
}: DocTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-800">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-3 px-4 text-surface-400 font-mono font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-surface-800/50">
              <td
                className={`py-3 px-4 font-mono ${highlightFirst ? "text-brand-400" : "text-surface-200"}`}
              >
                {row[0]}
              </td>
              <td className="py-3 px-4 text-surface-300">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
