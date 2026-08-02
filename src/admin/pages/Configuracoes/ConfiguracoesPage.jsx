import { useState, useEffect } from 'react';
import { getConfiguracoesAdmin, updateConfiguracao, uploadConfiguracaoMidia } from '../../services/configuracoes.service';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  const fetchConfigs = () => {
    setLoading(true);
    getConfiguracoesAdmin()
      .then(setConfigs)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = async (chave, valor) => {
    setSavingKey(chave);
    try {
      await updateConfiguracao(chave, valor);
      toast.success(`Configuração '${chave}' salva.`);
    } catch {
      toast.error('Erro ao salvar configuração.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleFileUpload = async (chave, file) => {
    if (!file) return;
    setSavingKey(chave);
    try {
      const updated = await uploadConfiguracaoMidia(chave, file);
      setConfigs((prev) => prev.map((c) => (c.chave === chave ? updated : c)));
      toast.success(`Imagem atualizada para '${chave}'.`);
    } catch {
      toast.error('Erro ao enviar imagem.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Configurações Globais do Site</h1>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Carregando configurações...</div>
      ) : (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          {configs.map((config) => (
            <div key={config.chave} style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                {config.chave}
              </div>
              {config.descricao && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {config.descricao}
                </div>
              )}

              {config.tipo === 'IMAGE' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {config.valor && (
                    <img src={config.valor} alt="" style={{ height: '48px', maxWidth: '160px', objectFit: 'contain', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: '4px' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(config.chave, e.target.files[0])}
                    disabled={savingKey === config.chave}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    defaultValue={config.valor}
                    onBlur={(e) => {
                      if (e.target.value !== config.valor) {
                        handleUpdate(config.chave, e.target.value);
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling;
                      handleUpdate(config.chave, input.value);
                    }}
                    className="btn btn-secondary"
                    disabled={savingKey === config.chave}
                  >
                    <Save size={16} /> Salvar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
