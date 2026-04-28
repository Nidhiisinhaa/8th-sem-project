import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import UploadPage from './pages/Upload';
import Analytics from './pages/Analytics';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Logic: Memory se user ka data (name, role, etc.) uthao
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Helper logic for role (taki niche routes clean rahein)
  const role = user?.role || '';

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES - Sab dekh sakte hain */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* SECURE ROUTES - Sirf login ke baad accessible */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={<Layout user={user} />}>
            <Route index element={<Navigate to={role === 'teacher' ? "teacher" : "student"} replace />} />
            <Route path="student" element={<StudentDashboard user={user} />} />
            <Route path="teacher" element={<TeacherDashboard user={user} />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
