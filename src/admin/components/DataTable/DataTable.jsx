export default function DataTable({
  columns = [],
  data = [],
  pagination,
  loading,
  search,
  onSearchChange,
  emptyMessage = 'Nenhum registro encontrado.',
}) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {onSearchChange !== undefined && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <input
            type="text"
            placeholder="Buscar registros..."
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Carregando dados...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border)' }}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: '0.875rem 1rem' }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div style={{
          padding: '0.875rem 1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}>
          <div>
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} itens)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn btn-secondary"
              style={{ padding: '0.375rem 0.75rem' }}
            >
              Anterior
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="btn btn-secondary"
              style={{ padding: '0.375rem 0.75rem' }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
