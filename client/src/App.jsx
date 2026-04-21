import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import UploadPage from './pages/Upload';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes (with sidebar layout) */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/student" replace />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
