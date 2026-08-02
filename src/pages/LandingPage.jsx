import { useState, useEffect } from 'react';
import '../App.css';
import logoLocal from '../assets/logo.png';
import { getConfiguracoes } from '../services/configuracoes';
import { getLocacoes } from '../services/locacoes';
import { getAlbuns, getFotosAlbum } from '../services/galeria';
import { cadastrarNewsletter } from '../services/newsletter';

export default function LandingPage() {
  const [config, setConfig] = useState(null);
  const [locacoes, setLocacoes] = useState([]);
  const [albuns, setAlbuns] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Newsletter Form State
  const [newsletterForm, setNewsletterForm] = useState({ nome: '', email: '', telefone: '', lgpd: true });
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, success: null, message: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const [configData, locacoesData, albunsData] = await Promise.all([
          getConfiguracoes(),
          getLocacoes({ destaque: true }),
          getAlbuns(),
        ]);

        if (configData) setConfig(configData);
        if (locacoesData && locacoesData.length > 0) setLocacoes(locacoesData);
        if (albunsData && albunsData.length > 0) {
          setAlbuns(albunsData);
          const fotosPrimeiroAlbum = await getFotosAlbum(albunsData[0].id);
          setFotos(fotosPrimeiroAlbum);
        }
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterForm.email || !newsletterForm.nome) {
      setNewsletterStatus({ loading: false, success: false, message: 'Por favor, preencha nome e e-mail.' });
      return;
    }

    setNewsletterStatus({ loading: true, success: null, message: '' });
    try {
      await cadastrarNewsletter({
        nome: newsletterForm.nome,
        email: newsletterForm.email,
        telefone: newsletterForm.telefone,
      });
      setNewsletterStatus({
        loading: false,
        success: true,
        message: 'Obrigado por se inscrever! Em breve entraremos em contato.',
      });
      setNewsletterForm({ nome: '', email: '', telefone: '', lgpd: true });
    } catch (err) {
      setNewsletterStatus({
        loading: false,
        success: false,
        message: err.response?.data?.error?.message || 'Falha ao realizar inscrição. Tente novamente.',
      });
    }
  };

  const locacoesMock = [
    {
      id: 1,
      nome: 'Trave Box Truss 800 Watts',
      descricao: 'Brilho e cor para seu evento! 1x Grid Q15 (2x2) + Capa, 4x Par LED Quadrado.',
      valor: '400.00',
    },
    {
      id: 2,
      nome: 'Tripé de Iluminação 2800 Watts',
      descricao: 'Maior visibilidade para seu evento! 1x Tripé, 4x Par LED Quadrado, 2x Holofote.',
      valor: '540.00',
    },
    {
      id: 3,
      nome: 'Trave Box Truss 320 Watts',
      descricao: 'Estrutura compacta. 1x Grid Q15 (2x2), 6x Refletor LED Slim.',
      valor: '270.00',
    },
    {
      id: 4,
      nome: 'Tripé de Iluminação 1000 Watts',
      descricao: 'Iluminação potente. 1x Tripé, 4x Par LED Quadrado, 4x Refletor.',
      valor: '340.00',
    },
  ];

  const locacoesExibidas = locacoes.length > 0 ? locacoes : locacoesMock;
  const logoSrc = config?.logo_url || logoLocal;
  const whatsappNum = config?.whatsapp || '5551997455990';

  return (
    <div className="app">
      <header>
        <div className="container header-content">
          <div className="logo-container">
            <img src={logoSrc} alt="Fast Som Eventos" className="logo-img" />
          </div>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#empresa">Empresa</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#locacoes">Locações</a></li>
              <li><a href="#fotos">Fotos</a></li>
              <li><a href="#contatos">Contatos</a></li>
              <li><a href="/admin/login" style={{ color: '#6c63ff', fontWeight: 600 }}>Área Restrita</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="home" className="hero container">
          <div className="hero-content">
            <h1>{config?.hero_titulo || 'Você sonha com a festa, a gente faz'} <span className="text-gradient">acontecer!</span></h1>
            <p>{config?.hero_subtitulo || 'Estamos preparados para organizar seu evento com excelência.'}</p>
            <div className="hero-buttons">
              <a href="#locacoes" className="btn btn-primary">Ver Locações</a>
              <a href="#contatos" className="btn btn-secondary">Falar com Especialista</a>
            </div>
          </div>
        </section>

        {/* EMPRESA SECTION */}
        <section id="empresa" className="empresa section">
          <div className="container">
            <div className="empresa-grid">
              <div className="empresa-text">
                <img src={logoSrc} alt="Logo" className="empresa-logo-inline" />
                <p>{config?.empresa_texto_1 || 'A Fastsom vem consolidando sua trajetória no mercado gaúcho de eventos através de um trabalho pautado pela qualidade, compromisso e excelência na entrega de cada projeto. Atuando com locação de equipamentos e prestação de serviços especializados, a empresa participa anualmente de centenas de eventos sociais e corporativos, oferecendo soluções completas.'}</p>
                <p>{config?.empresa_texto_2 || 'Acreditamos que a qualidade da estrutura faz toda a diferença na experiência do público. Por isso, investimos constantemente em tecnologia, equipamentos modernos e profissionais capacitados, garantindo resultados à altura das expectativas.'}</p>
                <p>{config?.empresa_texto_3 || 'Atendemos casamentos, formaturas, festas de 15 anos, eventos corporativos e diversas outras ocasiões.'}</p>
              </div>
              <div className="empresa-images">
                <div className="img-placeholder">
                  <span>[Estrutura Fastsom]</span>
                </div>
                <div className="img-placeholder">
                  <span>[Iluminação e Som]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVIÇOS SECTION */}
        <section id="servicos" className="servicos section">
          <div className="container">
            <h2 className="section-title">Nossos Serviços</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon-outline">💡</div>
                <h3>Iluminação Profissional</h3>
                <p>Tecnologia em iluminação profissional para valorizar cada momento do seu evento.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-outline">🔊</div>
                <h3>Sistema de Som</h3>
                <p>Sistema de som profissional para eventos, com operação técnica dedicada do início ao fim.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-outline">🖥️</div>
                <h3>Painéis de LED</h3>
                <p>Painéis de LED de alta resolução, ideais para qualquer tipo de evento.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-outline">🏗️</div>
                <h3>Estruturas</h3>
                <p>Estruturas completas com segurança, qualidade e acabamento profissional.</p>
              </div>
            </div>
          </div>
        </section>

        {/* LOCAÇÕES SECTION */}
        <section id="locacoes" className="locacoes section">
          <div className="container">
            <h2 className="section-title">Locações</h2>
            <div className="catalog-grid">
              {locacoesExibidas.map((item) => (
                <div key={item.id} className="product-card glass-panel">
                  <div className="product-image-placeholder">
                    {item.imagem_principal ? (
                      <img src={item.imagem_principal} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>[Equipamento]</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{item.nome}</h4>
                    <p className="product-desc">{item.descricao}</p>
                    <div className="product-price">R$ {parseFloat(item.valor).toFixed(2).replace('.', ',')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOTOS SECTION */}
        <section id="fotos" className="fotos section">
          <div className="container">
            <h2 className="section-title">Fotos de Eventos</h2>
            <div className="gallery-skeleton">
              <div className="gallery-main-image">
                {fotos.length > 0 ? (
                  <img src={fotos[0].url} alt="Foto Destaque" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>[Foto Destaque da Galeria]</span>
                )}
              </div>
              <div className="gallery-thumbnails">
                {fotos.length > 0 ? (
                  fotos.slice(1, 7).map((foto) => (
                    <div key={foto.id} className="thumb-placeholder" style={{ overflow: 'hidden' }}>
                      <img src={foto.url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="thumb-placeholder"></div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTATOS / NEWSLETTER SECTION */}
        <section id="contatos" className="newsletter section">
          <div className="container newsletter-content">
            <h2>Fique por dentro!</h2>
            <p>Assine nossa newsletter para receber novidades e promoções de eventos.</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form" style={{ flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Seu Nome Completo *"
                value={newsletterForm.nome}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, nome: e.target.value })}
                className="newsletter-input"
                style={{ width: '100%' }}
                required
              />
              <input
                type="email"
                placeholder="Seu melhor e-mail *"
                value={newsletterForm.email}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, email: e.target.value })}
                className="newsletter-input"
                style={{ width: '100%' }}
                required
              />
              <input
                type="tel"
                placeholder="Telefone / WhatsApp (opcional)"
                value={newsletterForm.telefone}
                onChange={(e) => setNewsletterForm({ ...newsletterForm, telefone: e.target.value })}
                className="newsletter-input"
                style={{ width: '100%' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={newsletterForm.lgpd}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, lgpd: e.target.checked })}
                  required
                />
                Concordo em receber informações de acordo com a LGPD.
              </label>

              <button type="submit" className="btn btn-primary" disabled={newsletterStatus.loading} style={{ width: '100%' }}>
                {newsletterStatus.loading ? 'Enviando...' : 'Inscrever-se'}
              </button>

              {newsletterStatus.message && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  backgroundColor: newsletterStatus.success ? '#166534' : '#991b1b',
                  color: '#ffffff',
                }}>
                  {newsletterStatus.message}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <div className="footer-logo">
            <img src={logoSrc} alt="Fast Som Eventos" className="logo-img-small" />
          </div>
          <div className="footer-info">
            <p>Comercial: {config?.telefone_comercial || '(51) 9 9745-5990'}</p>
            <p>Secretaria: {config?.telefone_secretaria || '(51) 9 9205-5758'}</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT BUTTON */}
      <a href={`https://wa.me/${whatsappNum.replace(/\D/g, '')}`} className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <span className="wa-icon">💬</span>
      </a>
    </div>
  );
}
