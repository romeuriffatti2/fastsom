import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../styles/global.css';
import '../../styles/layout.css';

export default function Layout() {
  return (
    <div className="admin-body-scope">
      <div className="admin-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
