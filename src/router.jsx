import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import ProtectedRoute from './admin/router/ProtectedRoute';
import AdminRoute from './admin/router/AdminRoute';
import Layout from './admin/components/Layout/Layout';

import LoginPage from './admin/pages/Login/LoginPage';
import DashboardPage from './admin/pages/Dashboard/DashboardPage';
import LocacoesPage from './admin/pages/Locacoes/LocacoesPage';
import LocacaoFormPage from './admin/pages/Locacoes/LocacaoFormPage';
import GaleriaPage from './admin/pages/Galeria/GaleriaPage';
import AlbumPage from './admin/pages/Galeria/AlbumPage';
import NewsletterPage from './admin/pages/Newsletter/NewsletterPage';
import CampanhasPage from './admin/pages/Campanhas/CampanhasPage';
import CampanhaFormPage from './admin/pages/Campanhas/CampanhaFormPage';
import TemplatesPage from './admin/pages/Templates/TemplatesPage';
import ConfiguracoesPage from './admin/pages/Configuracoes/ConfiguracoesPage';
import UsuariosPage from './admin/pages/Usuarios/UsuariosPage';
import LogsPage from './admin/pages/Logs/LogsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'locacoes', element: <LocacoesPage /> },
      { path: 'locacoes/novo', element: <LocacaoFormPage /> },
      { path: 'locacoes/:id', element: <LocacaoFormPage /> },
      { path: 'galeria', element: <GaleriaPage /> },
      { path: 'galeria/:id', element: <AlbumPage /> },
      { path: 'newsletter', element: <NewsletterPage /> },
      { path: 'campanhas', element: <CampanhasPage /> },
      { path: 'campanhas/nova', element: <CampanhaFormPage /> },
      { path: 'campanhas/:id', element: <CampanhaFormPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      {
        element: <AdminRoute />,
        children: [
          { path: 'configuracoes', element: <ConfiguracoesPage /> },
          { path: 'usuarios', element: <UsuariosPage /> },
          { path: 'logs', element: <LogsPage /> },
        ],
      },
    ],
  },
]);
