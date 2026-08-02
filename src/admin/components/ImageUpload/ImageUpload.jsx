import { useState } from 'react';
import { UploadCloud, Trash2, Star } from 'lucide-react';

export default function ImageUpload({
  existingImages = [],
  onUpload,
  onDelete,
  onSetPrincipal,
  multiple = true,
  loading = false,
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (files && files.length > 0 && onUpload) {
      onUpload(Array.from(files));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          cursor: 'pointer',
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = multiple;
          input.accept = 'image/*';
          input.onchange = (e) => handleFiles(e.target.files);
          input.click();
        }}
      >
        <UploadCloud size={36} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          {loading ? 'Enviando arquivos...' : 'Arraste imagens ou clique para fazer upload'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 10MB por arquivo.
        </div>
      </div>

      {existingImages.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
          {existingImages.map((img) => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                border: img.is_principal || img.is_capa ? '2px solid var(--color-primary)' : '1px solid var(--border)',
              }}
            >
              <img src={img.url} alt="Mídia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                display: 'flex',
                gap: '4px',
              }}>
                {onSetPrincipal && (
                  <button
                    type="button"
                    onClick={() => onSetPrincipal(img.id)}
                    title={img.is_principal || img.is_capa ? 'Imagem principal' : 'Definir como principal'}
                    style={{
                      padding: '4px',
                      backgroundColor: img.is_principal || img.is_capa ? 'var(--color-primary)' : 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                    }}
                  >
                    <Star size={14} fill={img.is_principal || img.is_capa ? '#ffffff' : 'none'} />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(img.id)}
                    title="Excluir imagem"
                    style={{ padding: '4px', backgroundColor: 'var(--color-danger)', color: '#ffffff' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
