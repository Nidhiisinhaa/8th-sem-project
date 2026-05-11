// import { Outlet, Link, useLocation, Navigate ,useNavigate} from 'react-router-dom';
// import {
//   LayoutDashboard, Users, Upload, BarChart3,
//   GraduationCap, LogOut, Menu, X, Bell, Search,
//   ChevronRight, BookOpen, Power
// } from 'lucide-react';
// import { useState } from 'react';
// import './Layout.css';

// const sidebarLinks = [
//   { path: '/dashboard/student', label: 'Student Dashboard', icon: GraduationCap, roles: ['student'] },
//   { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: Users, roles: ['teacher'] },
//   { path: '/dashboard/upload', label: 'Upload Data', icon: Upload, roles: ['student'] }, // Teacher only fix
// ];



// export default function Layout({ user, setUser }) {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();

//   // Role ko user object se nikal rahe hain
//   const role = user?.role;

//   // console.log("user : ");
//   // console.log(user);
//   // 4. Logic: Links filter karo current role ke hisaab se
//   const filteredLinks = sidebarLinks.filter(link => link.roles.includes(role));

//   return (
//     <div className="layout">
//       {/* Sidebar */}
//       <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
//         <div className="sidebar-header">
//           <Link to="/" className="sidebar-logo">
//             <div className="logo-icon">
//               <BookOpen size={22} />
//             </div>
//             {sidebarOpen && <span className="logo-text">EduPredict</span>}
//           </Link>
//         </div>

//         <nav className="sidebar-nav">
//           <div className="nav-label">{sidebarOpen && 'MAIN MENU'}</div>

//           {filteredLinks.map((link) => {
//             const Icon = link.icon;
//             const isActive = location.pathname === link.path;
//             return (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`nav-item ${isActive ? 'active' : ''}`}
//               >
//                 <Icon size={20} />
//                 {sidebarOpen && <span>{link.label}</span>}
//                 {isActive && sidebarOpen && <ChevronRight size={16} className="nav-arrow" />}
//               </Link>
//             );
//           })}
//         </nav>

//       </aside>

//       {/* Main Content Area */}
//       <div className={`main-area ${sidebarOpen ? '' : 'expanded'}`}>
//         <header className="topbar">
//           <div className="topbar-left">
//             <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
//               {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//             {/* <div className="search-box">
//               <Search size={16} />
//               <input type="text" placeholder="Search students, reports..." />
//             </div> */}
//           </div>
//           <div className="topbar-right">
//             <div className="user-avatar">
//               <div className="avatar-circle">
//                 {/* Naam ka pehla letter dynamic */}
//                 {user?.teacher?.name?.charAt(0).toUpperCase() || user?.student?.name?.charAt(0).toUpperCase()  || 'U'}
//               </div>
//               {/* Yahan "Shweta" ki jagah dynamic name aayega */}
//               {sidebarOpen && <span className="user-name">{user?.teacher?.name ||user?.student?.name ||'User'}</span>}
//             </div>
//             {/* NAYA LOGOUT BUTTON */}
//             <div className="tooltip-container">
//               <button
//                 className="red-power-btn"
//                 onClick={async () => {
//                   try {
//                     const role = user?.role;
//                     const url = role === 'teacher'
//                       ? "https://student-performance-analysis-backend-engk.onrender.com/api/teacher/logout"
//                       : "https://student-performance-analysis-backend-engk.onrender.com/api/student/logout";

//                       const response = await fetch(url, {
//                       method: "get",
//                       credentials: "include"
//                     });
//                     const res = await response.json()
//                     setUser(null);
//                     console.log (res)

//                   } catch (err) {
//                     console.log("Logout error:", err);
//                   } finally {
//                     localStorage.removeItem('userData');
//                     // window.location.href = '/login';
//                     navigate("/login");
//                   }
//                 }}
//               >
//                 <Power size={18} strokeWidth={2.5} />
//               </button>

//               {/* Hover par ye message dikhega */}
//               <span className="tooltip-text">Log Out</span>
//             </div>
//           </div>
//         </header>

//         <main className="page-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Upload, BarChart3,
  GraduationCap, LogOut, Menu, X, Bell, Search,
  ChevronRight, BookOpen, Power
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './Layout2.css';

const sidebarLinks = [
  { path: '/dashboard/student', label: 'Student Dashboard', icon: GraduationCap, roles: ['student'] },
  { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: Users, roles: ['teacher'] },
  { path: '/dashboard/upload', label: 'Upload Data', icon: Upload, roles: ['student'] },
];

// Helper to check if we're on mobile
const isMobile = () => window.innerWidth <= 768;

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();
  // ✅ FIX 1: Start closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
  const location = useLocation();

  const role = user?.role;
  const filteredLinks = sidebarLinks.filter(link => link.roles.includes(role));

  // ✅ FIX 2: Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile()) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // ✅ FIX 3: Reset sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (isMobile()) setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* ✅ FIX 4: Overlay — tapping outside closes sidebar on mobile */}
      {sidebarOpen && isMobile() && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={closeSidebarOnMobile}>
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
                onClick={closeSidebarOnMobile}  // ✅ closes on nav tap
              >
                <Icon size={20} />
                {sidebarOpen && <span>{link.label}</span>}
                {isActive && sidebarOpen && <ChevronRight size={16} className="nav-arrow" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      {/* ✅ FIX 5: On mobile, main-area never shifts — sidebar overlays on top */}
      <div className={`main-area ${sidebarOpen && !isMobile() ? '' : 'expanded'}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="topbar-right">
            <div className="user-avatar">
              <div className="avatar-circle">
                {user?.teacher?.name?.charAt(0).toUpperCase() || user?.student?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {sidebarOpen && !isMobile() && (
                <span className="user-name">{user?.teacher?.name || user?.student?.name || 'User'}</span>
              )}
            </div>
            <div className="tooltip-container">
              <button
                className="red-power-btn"
                onClick={async () => {
                  try {
                    const role = user?.role;
                    const url = role === 'teacher'
                      ? "https://student-performance-analysis-backend-engk.onrender.com/api/teacher/logout"
                      : "https://student-performance-analysis-backend-engk.onrender.com/api/student/logout";

                    const response = await fetch(url, {
                      method: "get",
                      credentials: "include"
                    });
                    const res = await response.json();
                    setUser(null);
                    console.log(res);
                  } catch (err) {
                    console.log("Logout error:", err);
                  } finally {
                    localStorage.removeItem('userData');
                    navigate("/login");
                  }
                }}
              >
                <Power size={18} strokeWidth={2.5} />
              </button>
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
