import { useState, useEffect } from 'react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../../services/templates.service';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Plus, Edit, Trash2, Code } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', assunto: '', corpo_html: '' });
  const [deleteId, setDeleteId] = useState(null);

  const fetchTemplates = () => {
    setLoading(true);
    getTemplates()
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ nome: '', assunto: '', corpo_html: '<html>\n  <body>\n    <h1>Olá {{nome}}!</h1>\n  </body>\n</html>' });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setFormData({ nome: t.nome, assunto: t.assunto, corpo_html: t.corpo_html });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTemplate(editingId, formData);
        toast.success('Template atualizado.');
      } else {
        await createTemplate(formData);
        toast.success('Template criado.');
      }
      setModalOpen(false);
      fetchTemplates();
    } catch {
      toast.error('Erro ao salvar template.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTemplate(deleteId);
      toast.success('Template excluído.');
      setDeleteId(null);
      fetchTemplates();
    } catch {
      toast.error('Erro ao excluir template.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Templates de E-mail HTML</h1>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} /> Novo Template
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Carregando templates...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {templates.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  <Code size={20} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t.nome}</h3>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong>Assunto:</strong> {t.assunto}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button onClick={() => handleOpenEdit(t)} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Edit size={16} /> Editar
                </button>
                <button onClick={() => setDeleteId(t.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM TEMPLATE */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '640px', width: '90%' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>{editingId ? 'Editar Template' : 'Novo Template'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Nome do Template *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Assunto Padrão *</label>
                <input type="text" value={formData.assunto} onChange={(e) => setFormData({ ...formData, assunto: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Corpo HTML *</label>
                <textarea rows={8} value={formData.corpo_html} onChange={(e) => setFormData({ ...formData, corpo_html: e.target.value })} required style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Excluir Template"
        message="Tem certeza que deseja excluir este template?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
