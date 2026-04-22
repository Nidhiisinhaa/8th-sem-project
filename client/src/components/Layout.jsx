import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Upload, BarChart3,
  GraduationCap, LogOut, Menu, X, Bell, Search,
  ChevronRight, BookOpen
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const sidebarLinks = [
  { path: '/dashboard/student', label: 'Student Dashboard', icon: GraduationCap },
  { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: Users },
  { path: '/dashboard/upload', label: 'Upload Data', icon: Upload },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">
              <BookOpen size={22} />
            </div>
            {sidebarOpen && <span className="logo-text">EduPredict</span>}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">{sidebarOpen && 'MAIN MENU'}</div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{link.label}</span>}
                {isActive && sidebarOpen && <ChevronRight size={16} className="nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="nav-item logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`main-area ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Top Navbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search students, reports..." />
            </div>
          </div>
          <div className="topbar-right">
            <button className="notif-btn">
              <Bell size={20} />
              <span className="notif-dot"></span>
            </button>
            <div className="user-avatar">
              <div className="avatar-circle">S</div>
              {sidebarOpen && <span className="user-name">Shweta</span>}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
