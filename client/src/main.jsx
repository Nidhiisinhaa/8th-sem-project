// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Apne States ko import karo
import StudentState from './contexts/student/StudentState'
import TeacherState from './contexts/teacher/TeacherState'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Inhe Nest (Wrap) karo */}
    <StudentState>
      <TeacherState>
        <App />
      </TeacherState>
    </StudentState>
  </StrictMode>,
)