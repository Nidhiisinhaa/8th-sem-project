import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Mail, Lock, ArrowRight,
  Eye, EyeOff, GraduationCap, UserCheck
} from 'lucide-react';
import './Login.css';
import StudentContext from '../contexts/student/StudentContext';
import TeacherContext from '../contexts/teacher/TeacherContext';

export default function Login({ onLogin }) {
  // ── default is LOGIN (isSignUp = false), as your friend asked ──
  const [isSignUp, setIsSignUp]       = useState(false);
  const [name, setName]               = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]               = useState('student');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // ── Basic frontend validation ──
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

    setLoading(true);

    try {
      // ── Pick the right endpoint based on role + action ──
      // Teacher routes are separate (/teachers/...), student routes are (/students/...)
      // ⚠️ Confirm teacher base route with your friend — using /teachers/ here
      const base     = role === 'student' ? '/students' : '/teachers';
      const action   = isSignUp ? '/signup' : '/login';
      const url      = `http://localhost:5000${base}${action}`;

      // ── Build payload ──
      // Login needs only email + password
      // Signup for teacher needs name, email, password, department (check with friend)
      // Signup for student is handled in Upload.jsx separately (not here)
      const payload = isSignUp
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      // ---- BACKEND READY: uncomment this block when backend is ready ----
// const response = await fetch(url, {
//     method:      'POST',
//     body:        JSON.stringify(payload),
//     headers:     { 'content-type': 'application/json' },
//     credentials: 'include',
// });
// const responseJson = await response.json();
// if (!response.ok) {
//     throw new Error(responseJson.message || 'Something went wrong');
// }
// const userData = {
//     name: responseJson.student?.name || responseJson.teacher?.name || email.split('@')[0],
//     role,
// };
// ---- END BACKEND BLOCK ----

// ---- DUMMY LOGIN (delete this when backend is ready) ----
const userData = {
    name: isSignUp ? name.trim() : email.split('@')[0],
    role,
};
// ---- END DUMMY LOGIN ----

      localStorage.setItem('userData', JSON.stringify(userData));

      onLogin(userData);
      navigate(role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');

    } catch (err) {
      console.log('error in Login/handleSubmit:');
      console.log(err);
      setApiError(err.message || 'Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
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

            {/* API error banner */}
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

              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    <GraduationCap size={20} className="role-icon" /> Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                    onClick={() => setRole('teacher')}
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
                  onClick={() => { setIsSignUp(!isSignUp); setApiError(''); }}
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

// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, UserCheck } from 'lucide-react';
// import './Login.css';
// import StudentContext from '../contexts/student/StudentContext';
// import TeacherContext from '../contexts/teacher/TeacherContext';

// export default function Login({ onLogin }) {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [name, setName] = useState(''); // User ka naam store karne ke liye
//   const [showPassword, setShowPassword] = useState(false);
//   const [role, setRole] = useState('student');

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const navigate = useNavigate(); // Initialize navigate

//   const { updateStudentFromStorage } = useContext(StudentContext);
//   const { updateTeacherFromStorage } = useContext(TeacherContext);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Name check (only for signup)
//     if (isSignUp && (!name || name.trim() === "")) {
//         alert("Please enter your Full Name!");
//         return;
//     }

//     // Email check
//     if (!email || email.trim() === "") {
//         alert("Please enter your Email!");
//         return;
//     }

//     // Password check
//     if (!password || password.trim() === "") {
//         alert("Please enter your Password!");
//         return;
//     }

//     // Password length check
//     if (password.length < 6) {
//         alert("Password must be at least 6 characters!");
//         return;
//     }

//     const userData = {
//         name: isSignUp ? name.trim() : email.split('@')[0], // agar signin hai toh email se naam nikalo
//         role: role
//     };

//     localStorage.setItem('userData', JSON.stringify(userData));
//     onLogin(userData);
//     navigate(role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
// };

//   return (
//     <div className="login-page">
//       <div className="login-bg-orb orb-a"></div>
//       <div className="login-bg-orb orb-b"></div>

//       <div className="login-container">
//         {/* Left Side - Branding */}
//         <div className="login-brand-side">
//           <Link to="/" className="login-logo">
//             <div className="login-logo-icon"><BookOpen size={24} /></div>
//             <span>EduPredict</span>
//           </Link>
//           <div className="brand-content">
//             <h1>Welcome to the <span className="gradient-text">Future of Education</span></h1>
//             <p>Predict performance. Identify risk. Drive improvement.</p>
//             <div className="brand-features">
//               <div className="brand-feature">
//                 <div className="bf-dot blue"></div>
//                 <span>AI-Powered Predictions</span>
//               </div>
//               <div className="brand-feature">
//                 <div className="bf-dot green"></div>
//                 <span>Real-time Analytics</span>
//               </div>
//               <div className="brand-feature">
//                 <div className="bf-dot purple"></div>
//                 <span>Explainable Results</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Form */}
//         <div className="login-form-side">
//           <div className="login-form-card">
//             <div className="form-header">
//               <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
//               <p>{isSignUp ? 'Join the platform to get started' : 'Welcome back! Enter your details'}</p>
//             </div>

//             <form onSubmit={handleSubmit}>
//               {isSignUp && (
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <div className="input-wrapper">
//                     <Mail size={18} />
//                     <input type="text" placeholder="Enter your full name" value={name} required onChange={(e) => setName(e.target.value)} />
//                   </div>
//                 </div>
//               )}

//               <div className="form-group">
//                 <label>Email Address</label>
//                 <div className="input-wrapper">
//                   <Mail size={18} />
//                   <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Password</label>
//                 <div className="input-wrapper">
//                   <Lock size={18} />
//                   <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                   <button
//                     type="button"
//                     className="eye-btn"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Role</label>
//                 <div className="role-selector">
//                   <button
//                     type="button"
//                     className={`role-btn ${role === 'student' ? 'active' : ''}`}
//                     onClick={() => setRole('student')}
//                   >
//                     <GraduationCap size={20} className="role-icon"/>    Student
//                   </button>
//                   <button
//                     type="button"
//                     className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
//                     onClick={() => setRole('teacher')}
//                   >
//                     <UserCheck size={20} className="role-icon"/>   Teacher
//                   </button>
//                 </div>
//               </div>

//               <button type="submit" className="submit-btn">
//                 <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
//                 <ArrowRight size={18} />
//               </button>
//             </form>

//             <div className="form-footer">
//               <p>
//                 {isSignUp ? 'Already have an account?' : "Don't have an account?"}
//                 <button
//                   type="button"
//                   className="toggle-btn"
//                   onClick={() => setIsSignUp(!isSignUp)}
//                 >
//                   {isSignUp ? 'Log In' : 'Sign Up'}
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
