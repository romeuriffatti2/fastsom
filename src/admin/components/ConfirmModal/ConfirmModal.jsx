export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '90%' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{title || 'Confirmar Ação'}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
          {message || 'Tem certeza que deseja prosseguir? Esta ação não poderá ser desfeita.'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary" disabled={loading}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? 'Aguarde...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
