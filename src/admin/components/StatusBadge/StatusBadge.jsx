export default function StatusBadge({ status }) {
  let bg = '#475569';
  let text = '#ffffff';
  let label = status;

  const statusLower = String(status).toLowerCase();

  if (['ativo', 'publicado', 'enviada', 'true'].includes(statusLower)) {
    bg = 'rgba(34, 197, 94, 0.2)';
    text = '#4ade80';
    label = statusLower === 'true' ? 'Ativo' : status;
  } else if (['inativo', 'despublicado', 'false'].includes(statusLower)) {
    bg = 'rgba(100, 116, 139, 0.2)';
    text = '#94a3b8';
    label = statusLower === 'false' ? 'Inativo' : status;
  } else if (['destaque'].includes(statusLower)) {
    bg = 'rgba(245, 158, 11, 0.2)';
    text = '#fbbf24';
  } else if (['falha', 'bloqueado'].includes(statusLower)) {
    bg = 'rgba(239, 68, 68, 0.2)';
    text = '#f87171';
  } else if (['agendada', 'enviando'].includes(statusLower)) {
    bg = 'rgba(59, 130, 246, 0.2)';
    text = '#60a5fa';
  } else if (['rascunho'].includes(statusLower)) {
    bg = 'rgba(148, 163, 184, 0.2)';
    text = '#cbd5e1';
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.625rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: bg,
      color: text,
      textTransform: 'capitalize',
    }}>
      {label}
    </span>
  );
}
