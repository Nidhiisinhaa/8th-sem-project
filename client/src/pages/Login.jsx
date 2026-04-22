import { Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, UserCheck } from 'lucide-react';
import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to appropriate dashboard based on role
    window.location.href = role === 'teacher'
      ? '/dashboard/teacher'
      : '/dashboard/student';
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

            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input type="text" placeholder="Enter your full name" />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input type="email" placeholder="you@example.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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

              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    <GraduationCap size={20} className="role-icon"/>    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                    onClick={() => setRole('teacher')}
                  >
                    <UserCheck size={20} className="role-icon"/>   Teacher
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setIsSignUp(!isSignUp)}
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
