import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import UploadPage from './pages/Upload';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import EduPredictChatbot from './components/EduPedictChatbot';


import StudentState from './contexts/student/StudentState';
import TeacherState from './contexts/teacher/TeacherState';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const role = user?.role || '';

  return (
    // 2. Puri App ko Student aur Teacher state se wrap karo
    <>
    <StudentState>
      <TeacherState>
        <Router>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />

            {/* SECURE ROUTES */}
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/dashboard" element={<Layout user={user} setUser={setUser} />}>
                <Route index element={<Navigate to={role === 'teacher' ? "teacher" : "student"} replace />} />
                <Route path="student" element={<StudentDashboard user={user} setUser={setUser} />} />
                <Route path="teacher" element={<TeacherDashboard user={user} />} />
                <Route path="upload" element={<UploadPage setUser={setUser} />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <EduPredictChatbot user={user} />
      </TeacherState>
    </StudentState>
  </>

  );
}

export default App;

