import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Mail, Lock, ArrowRight,
  Eye, EyeOff, GraduationCap, UserCheck
} from 'lucide-react';
import './Login.css';
import TeacherContext from '../contexts/teacher/TeacherContext';
const TEACHER_DEPARTMENTS = [
  "Electronics",
  "Computer Science",
  "Mechanical",
  "Information Technology",
  "Civil",
];

export default function Login({ onLogin }) {
  let {getTeacherData, setAllStudents} = useContext(TeacherContext);
  const [isSignUp, setIsSignUp]         = useState(false);
  const [name, setName]                 = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]                 = useState('student');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [department, setDepartment]     = useState('');  // teacher only
  const [rollNumber, setRollNumber]     = useState('');
  const [teacherId, setTeacherId]       = useState('');
  const [loading, setLoading]           = useState(false);
  const [apiError, setApiError]         = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // ── Validation ──
    if (isSignUp && (!name || name.trim() === '')) {
      setApiError('Please enter your Full Name!');
      return;
    }
    if (!email || email.trim() === '') {
      setApiError('Please enter your Email!');
      return;
    }
    if (!password || password.trim() === '') {
      setApiError('Please enter your Password!');
      return;
    }
    if (password.length < 6) {
      setApiError('Password must be at least 6 characters!');
      return;
    }
    if (role === 'student' && isSignUp) {
      if (!rollNumber || rollNumber.trim() === '') {
        setApiError('Please enter your Roll Number!');
        return;
      }
      if (!teacherId || teacherId.trim() === '') {
        setApiError('Please enter your Teacher ID!');
        return;
      }
    }
    // Department required only for teacher signup
    if (role === 'teacher' && isSignUp && !department) {
      setApiError('Please select a Department!');
      return;
    }

    setLoading(true);

    try {
  if (role === 'teacher') {
    // ── TEACHER SIGNUP ──
    if (isSignUp) {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        department,
      };

      const response = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      if (!response.ok) {
        throw new Error(responseJson.message || "Signup failed");
      }

      const userData = {...responseJson, role};
      localStorage.setItem('userData', JSON.stringify(userData));
      onLogin(userData);
      getTeacherData(userData);
      const studentsRes = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/students",{
            method:"get",
            credentials:"include"
          })
      const studentResJson = await studentsRes.json();
      console.log(studentResJson);
      setAllStudents(studentResJson);
      navigate('/dashboard/teacher');

    } else {
      // ── TEACHER LOGIN ──
      const payload = {
        email: email.trim(),
        password,
      };

      const response = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      if (!response.ok) {
        throw new Error(responseJson.message || "Login failed");
      }

      const userData = {...responseJson,role};
      localStorage.setItem('userData', JSON.stringify(userData));
      onLogin(userData);
      getTeacherData(userData);
      const studentsRes = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/students",{
            method:"get",
            credentials:"include"
          })
      const studentResJson = await studentsRes.json();
      console.log(studentResJson);
      setAllStudents(studentResJson);
      navigate('/dashboard/teacher');
    }

  } else {

    if(isSignUp){

      console.log("inside student signup")
     const payload = {
        name: name.trim(),
        email:      email.trim(),
        password,
        rollNumber: rollNumber.trim(),
        teacher:    teacherId.trim(),
      };

          // ---- BACKEND READY: uncomment when student backend is ready ----
          const response = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/student/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          });
          const responseJson = await response.json();
          console.log(responseJson);
          if (!response.ok) {
            throw new Error(responseJson.message || "Signup failed");
          }
          const userData = { ...responseJson, role };
          // ---- END BACKEND BLOCK ----
          localStorage.setItem('userData', JSON.stringify(userData));
          onLogin(userData);
          navigate('/dashboard/student');
    }else{

      //student login
      console.log("inside student login")
      const payload = {
       email: email.trim(),
        password,
      };

        // ---- BACKEND READY: uncomment when student backend is ready ----
        const response = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/student/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const responseJson = await response.json();
        console.log(responseJson);
        if (!response.ok) {
          throw new Error(responseJson.message || "Login failed");
        }
        const userData = { ...responseJson, role };
        // ---- END BACKEND BLOCK ----
        localStorage.setItem('userData', JSON.stringify(userData));
        onLogin(userData);
        navigate('/dashboard/student');

    }
  }

} catch (err) {
  console.log('error in Login/handleSubmit:', err);
  setApiError(err.message || 'Could not connect to server. Please try again.');
} finally {
  setLoading(false);
}
  };

    const handleToggleSignUp = () => {
      setIsSignUp(!isSignUp);
      setApiError('');
      setDepartment('');
      setRollNumber('');
      setTeacherId('');
      setName('');
      setEmail('');
      setPassword('');
    };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setDepartment('');
    setRollNumber('');
    setTeacherId('');
    setApiError('');
  };


 return (
    <div className="login-page">
      <div className="login-bg-orb orb-a"></div>
      <div className="login-bg-orb orb-b"></div>

      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-brand-side">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon"><BookOpen size={24} /></div>
            <span>EduPredict</span>
          </Link>
          <div className="brand-content">
            <h1>Welcome to the <span className="gradient-text">Future of Education</span></h1>
            <p>Predict performance. Identify risk. Drive improvement.</p>
            <div className="brand-features">
              <div className="brand-feature">
                <div className="bf-dot blue"></div>
                <span>AI-Powered Predictions</span>
              </div>
              <div className="brand-feature">
                <div className="bf-dot green"></div>
                <span>Real-time Analytics</span>
              </div>
              <div className="brand-feature">
                <div className="bf-dot purple"></div>
                <span>Explainable Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-side">
          <div className="login-form-card">
            <div className="form-header">
              <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
              <p>{isSignUp ? 'Join the platform to get started' : 'Welcome back! Enter your details'}</p>
            </div>

            {apiError && (
              <div style={{
                background: '#fee2e2', color: '#dc2626',
                padding: '10px 14px', borderRadius: '8px',
                marginBottom: '16px', fontSize: '14px'
              }}>
                ⚠️ {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Name — all signups */}
              {isSignUp && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setApiError(''); }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setApiError(''); }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setApiError(''); }}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Roll Number — student signup only */}
              {role === 'student' && isSignUp && (
                <div className="form-group">
                  <label>Roll Number</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="text"
                      placeholder="e.g. 2021CS001"
                      value={rollNumber}
                      onChange={(e) => { setRollNumber(e.target.value); setApiError(''); }}
                    />
                  </div>
                </div>
              )}

              {/* Teacher ID — student signup only */}
              {role === 'student' && isSignUp && (
                <div className="form-group">
                  <label>Teacher ID (as provided by the Teacher)</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="text"
                      placeholder="e.g. 69f1ff4408d733b19888bab8"
                      value={teacherId}
                      onChange={(e) => { setTeacherId(e.target.value); setApiError(''); }}
                    />
                  </div>
                </div>
              )}

              {/* Department — teacher signup only */}
              {role === 'teacher' && isSignUp && (
                <div className="form-group">
                  <label>Department</label>
                  <div className="input-wrapper">
                    <UserCheck size={18} />
                    <div className="select-wrapper">
                      <select
                        value={department}
                        className={department ? 'selected' : ''}
                        onChange={(e) => { setDepartment(e.target.value); setApiError(''); }}
                      >
                        <option value="">Select your department</option>
                        {TEACHER_DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Role selector */}
              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('student')}
                  >
                    <GraduationCap size={20} className="role-icon" /> Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('teacher')}
                  >
                    <UserCheck size={20} className="role-icon" /> Teacher
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <span>{loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={handleToggleSignUp}
                >
                  {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}


