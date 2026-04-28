import React, { useContext, useEffect } from 'react';
import {
  Users, AlertTriangle, TrendingUp, Award,
  ChevronUp, ChevronDown, Search, Filter, Eye
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import TeacherContext from '../contexts/teacher/TeacherContext';
import './TeacherDashboard.css';

// Static students list (Jaisa tumne kaha tha, ise static rakha hai)
const students = [
  { id: 1, name: 'Aarav Patel', roll: 'CS-001', gpa: 9.1, risk: 8, status: 'low', attendance: 95, predicted: 'A+' },
  { id: 2, name: 'Priya Singh', roll: 'CS-002', gpa: 8.6, risk: 15, status: 'low', attendance: 91, predicted: 'A' },
  { id: 3, name: 'Rahul Sharma', roll: 'CS-003', gpa: 8.4, risk: 23, status: 'low', attendance: 87, predicted: 'A-' },
  { id: 4, name: 'Sneha Gupta', roll: 'CS-004', gpa: 7.2, risk: 45, status: 'medium', attendance: 78, predicted: 'B' },
  { id: 5, name: 'Vikram Joshi', roll: 'CS-005', gpa: 6.5, risk: 62, status: 'medium', attendance: 72, predicted: 'C+' },
  { id: 6, name: 'Ananya Reddy', roll: 'CS-006', gpa: 5.8, risk: 78, status: 'high', attendance: 65, predicted: 'D' },
  { id: 7, name: 'Karan Mehta', roll: 'CS-007', gpa: 5.2, risk: 85, status: 'high', attendance: 58, predicted: 'D' },
  { id: 8, name: 'Neha Agarwal', roll: 'CS-008', gpa: 4.8, risk: 92, status: 'high', attendance: 52, predicted: 'F' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label || payload[0]?.name}</p>
        <p className="tooltip-value">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function TeacherDashboard({ user }) {
  // 1. Context se data aur function nikalna
  const { teacherData, getTeacherData } = useContext(TeacherContext);

  useEffect(() => {
    getTeacherData(); // Page load hote hi data fetch karne ka logic
  }, []);

  // 2. Safety Check: Jab tak context mein data load nahi hota
  if (!teacherData) {
    return <div className="loading">Fetching Teacher Analytics...</div>;
  }

  // 3. API se aane wale data ko variables mein map karna
  const { classStats, gradeDistribution, riskDistribution } = teacherData;

  return (
    <div className="teacher-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="page-subtitle">Class Overview — Computer Science, Section A</p>
        </div>
        <div className="header-meta">
          <span className="meta-badge">{classStats.totalStudents} Students</span>
          <span className="meta-badge red-badge">{classStats.atRisk} At Risk</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up delay-1">
          <div className="stat-icon blue"><Users size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Total Students</span>
            <span className="stat-value-text">{classStats.totalStudents}</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up delay-2">
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">At-Risk Students</span>
            <span className="stat-value-text">{classStats.atRisk}</span>
          </div>
          <div className="stat-trend down"><ChevronUp size={16} /> +2</div>
        </div>

        <div className="stat-card animate-fade-in-up delay-3">
          <div className="stat-icon purple"><Award size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Average GPA</span>
            <span className="stat-value-text">{classStats.avgGPA}</span>
          </div>
          <div className="stat-trend up"><ChevronUp size={16} /> 0.3</div>
        </div>

        <div className="stat-card animate-fade-in-up delay-4">
          <div className="stat-icon green"><TrendingUp size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Pass Rate</span>
            <span className="stat-value-text">{classStats.passRate}%</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card animate-fade-in-up delay-2">
          <div className="chart-header">
            <h3>📊 Grade Distribution</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gradeDistribution} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
                <XAxis dataKey="grade" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card animate-fade-in-up delay-3">
          <div className="chart-header">
            <h3>🎯 Risk Distribution</h3>
          </div>
          <div className="chart-body pie-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span style={{ color: '#8b8fa3', fontSize: '0.8rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Students Table Section */}
      <div className="chart-card students-table-card animate-fade-in-up delay-3">
        <div className="chart-header">
          <h3>👥 Student Performance Table</h3>
          <div className="table-actions">
            <div className="table-search">
              <Search size={15} />
              <input type="text" placeholder="Search students..." />
            </div>
            <button className="filter-btn"><Filter size={15} /> Filter</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>GPA</th>
                <th>Risk Score</th>
                <th>Attendance</th>
                <th>Predicted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="student-name-cell">
                      <div className="student-avatar">{s.name.charAt(0)}</div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td><span className="roll-badge">{s.roll}</span></td>
                  <td><strong>{s.gpa}</strong></td>
                  <td>
                    <div className="risk-cell">
                      <div className="risk-bar-bg">
                        <div
                          className={`risk-bar-fill ${s.status}`}
                          style={{ width: `${s.risk}%` }}
                        ></div>
                      </div>
                      <span className={`risk-value ${s.status}`}>{s.risk}</span>
                    </div>
                  </td>
                  <td>{s.attendance}%</td>
                  <td><span className={`grade-badge ${s.status}`}>{s.predicted}</span></td>
                  <td>
                    <button className="view-btn"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// import {
//   Users, AlertTriangle, TrendingUp, Award,
//   ChevronUp, ChevronDown, Search, Filter, Eye
// } from 'lucide-react';
// import {
//   BarChart, Bar, PieChart, Pie, Cell,
//   ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
// } from 'recharts';
// import React, { useContext, useEffect } from 'react';
// import TeacherContext from '../contexts/teacher/TeacherContext';
// import './TeacherDashboard.css';

// // Mock class data
// // const classStats = {
// //   totalStudents: 64,
// //   atRisk: 8,
// //   avgGPA: 7.8,
// //   passRate: 89,
// // };

// // const gradeDistribution = [
// //   { grade: 'A+', count: 5, color: '#22c55e' },
// //   { grade: 'A', count: 12, color: '#4e7cff' },
// //   { grade: 'B+', count: 16, color: '#8b5cf6' },
// //   { grade: 'B', count: 14, color: '#06b6d4' },
// //   { grade: 'C', count: 9, color: '#f59e0b' },
// //   { grade: 'D', count: 5, color: '#ef4444' },
// //   { grade: 'F', count: 3, color: '#dc2626' },
// // ];

// // const riskDistribution = [
// //   { name: 'Low Risk', value: 42, color: '#22c55e' },
// //   { name: 'Medium Risk', value: 14, color: '#f59e0b' },
// //   { name: 'High Risk', value: 8, color: '#ef4444' },
// // ];

// const students = [
//   { id: 1, name: 'Aarav Patel', roll: 'CS-001', gpa: 9.1, risk: 8, status: 'low', attendance: 95, predicted: 'A+' },
//   { id: 2, name: 'Priya Singh', roll: 'CS-002', gpa: 8.6, risk: 15, status: 'low', attendance: 91, predicted: 'A' },
//   { id: 3, name: 'Rahul Sharma', roll: 'CS-003', gpa: 8.4, risk: 23, status: 'low', attendance: 87, predicted: 'A-' },
//   { id: 4, name: 'Sneha Gupta', roll: 'CS-004', gpa: 7.2, risk: 45, status: 'medium', attendance: 78, predicted: 'B' },
//   { id: 5, name: 'Vikram Joshi', roll: 'CS-005', gpa: 6.5, risk: 62, status: 'medium', attendance: 72, predicted: 'C+' },
//   { id: 6, name: 'Ananya Reddy', roll: 'CS-006', gpa: 5.8, risk: 78, status: 'high', attendance: 65, predicted: 'D' },
//   { id: 7, name: 'Karan Mehta', roll: 'CS-007', gpa: 5.2, risk: 85, status: 'high', attendance: 58, predicted: 'D' },
//   { id: 8, name: 'Neha Agarwal', roll: 'CS-008', gpa: 4.8, risk: 92, status: 'high', attendance: 52, predicted: 'F' },
// ];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip">
//         <p className="tooltip-label">{label || payload[0]?.name}</p>
//         <p className="tooltip-value">{payload[0].value}</p>
//       </div>
//     );
//   }
//   return null;
// };

// export default function TeacherDashboard({ user }) {
//   // 2. Context se API data aur call function nikalna
//   const { teacherData, getTeacherData } = useContext(TeacherContext);

//   useEffect(() => {
//     getTeacherData(); // Page load hote hi API call
//   }, []);

//   // 3. Safety Check (Jab tak API se data na aaye)
//   if (!teacherData) {
//     return <div className="loading">Fetching Teacher Analytics...</div>;
//   }

//   // API se aane wale data ko variables mein map karna
//   const { classStats, gradeDistribution, riskDistribution } = teacherData;

//   return (
//     // <div className="teacher-dashboard">
//     //   {/* Page Header */}
//     //   <div className="page-header">
//     //     <div>
//     //       <h1>Teacher Dashboard</h1>
//     //       <p className="page-subtitle">Class Overview — Computer Science, Section A</p>
//     //     </div>
//     //     <div className="header-meta">
//     //       <span className="meta-badge">64 Students</span>
//     //       <span className="meta-badge red-badge">8 At Risk</span>
//     //     </div>
//     //   </div>
//     <div className="teacher-dashboard">
//       {/* Page Header */}
//       <div className="page-header">
//         <div>
//            <h1>Teacher Dashboard</h1>
//            <p className="page-subtitle">Class Overview — Computer Science, Section A</p>
//         </div>
//         <div className="header-meta">
//            <span className="meta-badge">{classStats.totalStudents} Students</span>
//            <span className="meta-badge red-badge">{classStats.atRisk} At Risk</span>
//         </div>
//       </div>

//       {/* Stats
//       <div className="stats-grid">
//         <div className="stat-card animate-fade-in-up delay-1">
//           <div className="stat-icon blue"><Users size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">Total Students</span>
//             <span className="stat-value-text">{classStats.totalStudents}</span>
//           </div>
//         </div> */}

//         {/* Stats Cards (Data coming from API via Context) */}
//       <div className="stats-grid">
//         <div className="stat-card animate-fade-in-up delay-1">
//             <div className="stat-icon blue"><Users size={22} /></div>
//             <div className="stat-info">
//             <span className="stat-label-text">Total Students</span>
//             <span className="stat-value-text">{classStats.totalStudents}</span>
//           </div>
//         </div>
//         {/* <div className="stat-card animate-fade-in-up delay-2">
//           <div className="stat-icon red"><AlertTriangle size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">At-Risk Students</span>
//             <span className="stat-value-text">{classStats.atRisk}</span>
//           </div>
//           <div className="stat-trend down"><ChevronUp size={16} /> +2</div>
//         </div> */}

//         {/* At-Risk Students */}
//         <div className="stat-card animate-fade-in-up delay-2">
//           <div className="stat-icon red"><AlertTriangle size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">At-Risk Students</span>
//             <span className="stat-value-text">{classStats.atRisk}</span>
//           </div>
//           <div className="stat-trend down"><ChevronUp size={16} /> +2</div>
//         </div>

//         {/* <div className="stat-card animate-fade-in-up delay-3">
//           <div className="stat-icon purple"><Award size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">Average GPA</span>
//             <span className="stat-value-text">{classStats.avgGPA}</span>
//           </div>
//           <div className="stat-trend up"><ChevronUp size={16} /> 0.3</div>
//         </div> */}

//         {/* Avg GPA */}
//         <div className="stat-card animate-fade-in-up delay-3">
//           <div className="stat-icon purple"><Award size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">Average GPA</span>
//             <span className="stat-value-text">{classStats.avgGPA}</span>
//           </div>
//           <div className="stat-trend up"><ChevronUp size={16} /> 0.3</div>
//         </div>
//       </div>

//         <div className="stat-card animate-fade-in-up delay-4">
//           <div className="stat-icon green"><TrendingUp size={22} /></div>
//           <div className="stat-info">
//             <span className="stat-label-text">Pass Rate</span>
//             <span className="stat-value-text">{classStats.passRate}%</span>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="charts-row">
//         <div className="chart-card animate-fade-in-up delay-2">
//           <div className="chart-header">
//             <h3>📊 Grade Distribution</h3>
//           </div>
//           <div className="chart-body">
//             <ResponsiveContainer width="100%" height={260}>
//               <BarChart data={gradeDistribution} barSize={36}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
//                 <XAxis dataKey="grade" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
//                 <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" radius={[6, 6, 0, 0]}>
//                   {gradeDistribution.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card animate-fade-in-up delay-3">
//           <div className="chart-header">
//             <h3>🎯 Risk Distribution</h3>
//           </div>
//           <div className="chart-body pie-chart-container">
//             <ResponsiveContainer width="100%" height={260}>
//               <PieChart>
//                 <Pie
//                   data={riskDistribution}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={65}
//                   outerRadius={100}
//                   paddingAngle={4}
//                   dataKey="value"
//                 >
//                   {riskDistribution.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend
//                   verticalAlign="bottom"
//                   formatter={(value) => <span style={{ color: '#8b8fa3', fontSize: '0.8rem' }}>{value}</span>}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Students Table */}
//       <div className="chart-card students-table-card animate-fade-in-up delay-3">
//         <div className="chart-header">
//           <h3>👥 Student Performance Table</h3>
//           <div className="table-actions">
//             <div className="table-search">
//               <Search size={15} />
//               <input type="text" placeholder="Search students..." />
//             </div>
//             <button className="filter-btn"><Filter size={15} /> Filter</button>
//           </div>
//         </div>
//         <div className="table-wrapper">
//           <table className="students-table">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Roll No</th>
//                 <th>GPA</th>
//                 <th>Risk Score</th>
//                 <th>Attendance</th>
//                 <th>Predicted</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr key={s.id}>
//                   <td>
//                     <div className="student-name-cell">
//                       <div className="student-avatar">{s.name.charAt(0)}</div>
//                       <span>{s.name}</span>
//                     </div>
//                   </td>
//                   <td><span className="roll-badge">{s.roll}</span></td>
//                   <td><strong>{s.gpa}</strong></td>
//                   <td>
//                     <div className="risk-cell">
//                       <div className="risk-bar-bg">
//                         <div
//                           className={`risk-bar-fill ${s.status}`}
//                           style={{ width: `${s.risk}%` }}
//                         ></div>
//                       </div>
//                       <span className={`risk-value ${s.status}`}>{s.risk}</span>
//                     </div>
//                   </td>
//                   <td>{s.attendance}%</td>
//                   <td><span className={`grade-badge ${s.status}`}>{s.predicted}</span></td>
//                   <td>
//                     <button className="view-btn"><Eye size={15} /></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
