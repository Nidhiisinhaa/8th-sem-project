import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Upload, BarChart3,
  GraduationCap, LogOut, Menu, X, Bell, Search,
  ChevronRight, BookOpen, Power
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const sidebarLinks = [
  { path: '/dashboard/student', label: 'Student Dashboard', icon: GraduationCap, roles: ['student'] },
  { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: Users, roles: ['teacher'] },
  { path: '/dashboard/upload', label: 'Upload Data', icon: Upload, roles: ['student'] }, // Teacher only fix
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, roles: ['student', 'teacher'] },
];

export default function Layout({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Role ko user object se nikal rahe hain
  const role = user?.role;

  // 4. Logic: Links filter karo current role ke hisaab se
  const filteredLinks = sidebarLinks.filter(link => link.roles.includes(role));

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

          {filteredLinks.map((link) => {
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
          {/* Logout: userData clear karega */}
          <Link
            to="/login"
            className="nav-item logout-btn"
            onClick={() => localStorage.removeItem('userData')}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`main-area ${sidebarOpen ? '' : 'expanded'}`}>
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
              <div className="avatar-circle">
                {/* Naam ka pehla letter dynamic */}
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {/* Yahan "Shweta" ki jagah dynamic name aayega */}
              {sidebarOpen && <span className="user-name">{user?.name || 'User'}</span>}
            </div>
            {/* NAYA LOGOUT BUTTON */}
            <div className="tooltip-container">
              <button
                className="red-power-btn"
                onClick={() => {
                  localStorage.removeItem('userData'); // Memory clear karo
                  window.location.href = '/login';    // Forcefully login par bhejo
                }}
              >
                <Power size={18} strokeWidth={2.5} /> {/* Power Icon */}
              </button>

              {/* Hover par ye message dikhega */}
              <span className="tooltip-text">Log Out</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}