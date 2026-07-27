export function exportToCsv(filename: string, rows: Record<string, unknown>[], headers?: string[]) {
  if (rows.length === 0) return
  const keys = headers || Object.keys(rows[0])
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }
  const csv = [
    keys.map(escape).join(','),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(',')),
  ].join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
