import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCampanhaById, createCampanha, updateCampanha } from '../../services/campanhas.service';
import { getTemplates } from '../../services/templates.service';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function CampanhaFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    assunto: '',
    template_id: '',
    publico_todos: true,
    publico_tag: '',
    agendado_para: '',
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(console.error);

    if (isEdit) {
      setLoading(true);
      getCampanhaById(id)
        .then((res) => {
          setFormData({
            nome: res.nome,
            assunto: res.assunto,
            template_id: res.template_id || '',
            publico_todos: res.publico_todos,
            publico_tag: res.publico_tag || '',
            agendado_para: res.agendado_para ? res.agendado_para.substring(0, 16) : '',
          });
        })
        .catch(() => toast.error('Campanha não encontrada.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateCampanha(id, formData);
        toast.success('Campanha atualizada.');
      } else {
        await createCampanha(formData);
        toast.success('Campanha criada em rascunho.');
      }
      navigate('/admin/campanhas');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Erro ao salvar campanha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/campanhas')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="page-title">{isEdit ? 'Editar Campanha' : 'Nova Campanha de E-mail'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Nome da Campanha *</label>
          <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required placeholder="Ex: Promoção Casamentos Junho" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Assunto do E-mail *</label>
          <input type="text" value={formData.assunto} onChange={(e) => setFormData({ ...formData, assunto: e.target.value })} required placeholder="Ex: Oferta especial de Iluminação!" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Template de E-mail</label>
          <select value={formData.template_id} onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}>
            <option value="">Nenhum template selecionado</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Público Alvo</label>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" checked={formData.publico_todos} onChange={() => setFormData({ ...formData, publico_todos: true })} /> Todos os contatos ativos
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" checked={!formData.publico_todos} onChange={() => setFormData({ ...formData, publico_todos: false })} /> Segmentado por Tag
            </label>
          </div>
        </div>

        {!formData.publico_todos && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Nome da Tag</label>
            <input type="text" value={formData.publico_tag} onChange={(e) => setFormData({ ...formData, publico_tag: e.target.value })} placeholder="Ex: vip" />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Agendar Disparo (Opcional)</label>
          <input type="datetime-local" value={formData.agendado_para} onChange={(e) => setFormData({ ...formData, agendado_para: e.target.value })} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Campanha'}
          </button>
        </div>
      </form>
    </div>
  );
}
