import React, { useContext, useEffect } from 'react';
import {
    Users, AlertTriangle, TrendingUp, Award,
    ChevronUp, Search, Filter
} from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import TeacherContext from '../contexts/teacher/TeacherContext';
import './TeacherDashboard.css';
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

    const { teacherData, loading, error, getTeacherData, students:studentData, setAllStudents } = useContext(TeacherContext);

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={getTeacherData}>Retry</button>
            </div>
        );
    }

    useEffect(()=>{
        let caller = async()=>{
            let teacherRes = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/teacher", {
                credentials:"include",
                method:"get",

            })
            let teacherJson = await teacherRes.json();
            console.log(teacherJson);
            getTeacherData(teacherJson);
            const studentsRes = await fetch("https://student-performance-analysis-backend-engk.onrender.com/api/teacher/students",{
                method:"get",
                credentials:"include"
            });
            const studentResJson = await studentsRes.json();
            console.log(studentResJson);
            setAllStudents(studentResJson);
        }
        caller();
    },[]);


    return (
        <div className="teacher-dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Teacher Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome, {teacherData?.teacher?.name || 'Teacher'} — {teacherData?.teacher?.department}  ~({teacherData?.teacher?._id})
                    </p>
                </div>

            </div>

            {/* Stats Cards */}
            {/* <div className="stats-grid">
                <div className="stat-card animate-fade-in-up delay-1">
                    <div className="stat-icon blue"><Users size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Total Students</span>
                        <span className="stat-value-text">{studentData.length}</span>
                    </div>
                </div>

                <div className="stat-card animate-fade-in-up delay-2">
                    <div className="stat-icon red"><AlertTriangle size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">At-Risk Students</span>
                        <span className="stat-value-text">{6}</span>
                    </div>
                    <div className="stat-trend down"><ChevronUp size={16} /> +2</div>
                </div>

                <div className="stat-card animate-fade-in-up delay-3">
                    <div className="stat-icon purple"><Award size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Average GPA</span>
                        <span className="stat-value-text">{6}</span>
                    </div>
                    <div className="stat-trend up"><ChevronUp size={16} /> 0.3</div>
                </div>

                <div className="stat-card animate-fade-in-up delay-4">
                    <div className="stat-icon green"><TrendingUp size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Pass Rate</span>
                        <span className="stat-value-text">{10}%</span>
                    </div>
                </div>
            </div> */}

            {/* Charts Row */}
            {/* <div className="charts-row">
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
                                    cx="50%" cy="50%"
                                    innerRadius={65} outerRadius={100}
                                    paddingAngle={4} dataKey="value"
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
            </div> */}

            {/* Students Table */}
            <div className="chart-card students-table-card animate-fade-in-up delay-3">
                <div className="chart-header">
                    <h3><Users size={18} /> Student Performance Table</h3>
                    {/* <div className="table-actions">
                        <div className="table-search">
                            <Search size={15} />
                            <input type="text" placeholder="Search students..." />
                        </div>
                        <button className="filter-btn"><Filter size={15} /> Filter</button>
                    </div> */}
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
                                <th>Predicted Grade</th>
                                <th>Predicted Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData?.students?.map((s) =>
                                {
                                let riskScore = s.result.predictions.risk_probability*10;
                                return(
                                <tr key={s._id}>
                                    <td>
                                        <div className="student-name-cell">
                                            <div className="student-avatar">{s.name.charAt(0)}</div>
                                            <span>{s.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="roll-badge">{s.rollNumber}</span></td>
                                    <td><strong>{s.input_data?.previous_cgpa || "-"}</strong></td>
                                    <td>
                                        <div className="risk-cell">
                                            <div className="risk-bar-bg">
                                                <div
                                                    className={`risk-bar-fill low`}
                                                    style={{ width: `${riskScore}` }} //risk
                                                ></div>
                                            </div>
                                            <span className={`risk-value ${s.status}`}>10</span>
                                            {/* s.risk */}
                                        </div>
                                    </td>
                                    <td>{s.input_data?.attendance_pct || "-"}</td>
                                    <td><span className={`grade-badge low`}>{s.result?.predictions.predicted_grade || "-"}</span></td>
                                    <td><strong>{s.result?.predictions?.predicted_score || "-"}</strong></td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
