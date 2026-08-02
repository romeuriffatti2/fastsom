import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/dashboard.service';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Package, Image, Users, Send } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Carregando indicadores...</div>;
  }

  const { totais, ultimos_contatos, ultimas_campanhas } = stats || {};

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', backgroundColor: 'rgba(108, 99, 255, 0.15)', borderRadius: 'var(--radius)', color: 'var(--color-primary)' }}>
            <Package size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Locações Ativas</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totais?.locacoes || 0}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', backgroundColor: 'rgba(240, 165, 0, 0.15)', borderRadius: 'var(--radius)', color: 'var(--color-secondary)' }}>
            <Image size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fotos na Galeria</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totais?.fotos || 0}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', borderRadius: 'var(--radius)', color: 'var(--color-success)' }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Contatos Base</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totais?.contatos || 0}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius)', color: 'var(--color-info)' }}>
            <Send size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Campanhas (Mês)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totais?.campanhas_mes || 0}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Últimos Contatos Cadastrados</h3>
          {ultimos_contatos?.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nenhum contato recente.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ultimos_contatos?.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.nome}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{c.email}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Campanhas Recentes</h3>
          {ultimas_campanhas?.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nenhuma campanha recente.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ultimas_campanhas?.map((camp) => (
                <div key={camp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{camp.nome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {camp.enviado_em ? `Enviado em ${new Date(camp.enviado_em).toLocaleDateString('pt-BR')}` : 'Não enviada'}
                    </div>
                  </div>
                  <StatusBadge status={camp.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
