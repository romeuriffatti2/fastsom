import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'

function App() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Obrigado por se inscrever, ${email}! (Demonstração - dados não salvos)`);
      setEmail('');
    }
  };

  // Mock data for Locações (E-commerce skeleton)
  const locacoesMock = [
    {
      id: 1,
      nome: 'Trave Box Truss 800 Watts',
      descricao: 'Brilho e cor para seu evento! 1x Grid Q15 (2x2) + Capa, 4x Par LED Quadrado.',
      valor: '400,00',
    },
    {
      id: 2,
      nome: 'Tripé de Iluminação 2800 Watts',
      descricao: 'Maior visibilidade para seu evento! 1x Tripé, 4x Par LED Quadrado, 2x Holofote.',
      valor: '540,00',
    },
    {
      id: 3,
      nome: 'Trave Box Truss 320 Watts',
      descricao: 'Estrutura compacta. 1x Grid Q15 (2x2), 6x Refletor LED Slim.',
      valor: '270,00',
    },
    {
      id: 4,
      nome: 'Tripé de Iluminação 1000 Watts',
      descricao: 'Iluminação potente. 1x Tripé, 4x Par LED Quadrado, 4x Refletor.',
      valor: '340,00',
    }
  ];

  return (
    <div className="app">
      <header>
        <div className="container header-content">
          <div className="logo-container">
            <img src={logo} alt="Fast Som Eventos" className="logo-img" />
          </div>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#empresa">Empresa</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#locacoes">Locações</a></li>
              <li><a href="#fotos">Fotos</a></li>
              <li><a href="#contatos">Contatos</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="home" className="hero container">
          <div className="hero-content">
            <h1>Você sonha com a festa, a gente faz <span className="text-gradient">acontecer!</span></h1>
            <p>Estamos preparados para organizar seu evento com excelência.</p>
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
                <img src={logo} alt="Logo" className="empresa-logo-inline" />
                <p>A Fastsom vem consolidando sua trajetória no mercado gaúcho de eventos através de um trabalho pautado pela qualidade, compromisso e excelência na entrega de cada projeto. Atuando com locação de equipamentos e prestação de serviços especializados, a empresa participa anualmente de centenas de eventos sociais e corporativos, oferecendo soluções completas.</p>
                <p>Acreditamos que a qualidade da estrutura faz toda a diferença na experiência do público. Por isso, investimos constantemente em tecnologia, equipamentos modernos e profissionais capacitados, garantindo resultados à altura das expectativas.</p>
                <p>Atendemos casamentos, formaturas, festas de 15 anos, eventos corporativos e diversas outras ocasiões.</p>
              </div>
              <div className="empresa-images">
                <div className="img-placeholder">
                  <span>[Imagem 1 - Evento]</span>
                </div>
                <div className="img-placeholder">
                  <span>[Imagem 2 - Estrutura]</span>
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
              {locacoesMock.map((item) => (
                <div key={item.id} className="product-card glass-panel">
                  <div className="product-image-placeholder">
                    <span>[Imagem do Equipamento]</span>
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{item.nome}</h4>
                    <p className="product-desc">{item.descricao}</p>
                    <div className="product-price">R$ {item.valor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOTOS SECTION */}
        <section id="fotos" className="fotos section">
          <div className="container">
            <h2 className="section-title">Fotos</h2>
            <div className="gallery-skeleton">
              <div className="gallery-main-image">
                <span>[Imagem Destaque]</span>
              </div>
              <div className="gallery-thumbnails">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="thumb-placeholder"></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTATOS / NEWSLETTER SECTION */}
        <section id="contatos" className="newsletter section">
          <div className="container newsletter-content">
            <h2>Fique por dentro!</h2>
            <p>Assine nossa news para receber novidades.</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn btn-primary">Inscrever-se</button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <div className="footer-logo">
             <img src={logo} alt="Fast Som Eventos" className="logo-img-small" />
          </div>
          <div className="footer-info">
             <p>Comercial: (51) 9 9745-5990</p>
             <p>Secretaria: (51) 9 9205-5758</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT BUTTON */}
      <a href="https://wa.me/5551997455990" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
         <span className="wa-icon">💬</span>
      </a>
    </div>
  )
}

export default App
