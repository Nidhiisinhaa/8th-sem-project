import React, { useContext, useEffect, useState } from 'react';
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

    const text =teacherData?.teacher?._id || "NA";

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
        await navigator.clipboard.writeText(text);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);

        } catch (err) {
        console.log("Copy failed:", err);
        }
    };

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
                        Welcome, <b> {teacherData?.teacher?.name || 'Teacher'}! </b>
                    </p>
                    <p className="page-subtitle">
                      ({teacherData?.teacher?.department}) 
                    </p>
                    <p className="page-subtitle">
                        <div className="copy-container">
                            <p className="copy-text">{text}</p>

                            <button
                                className="copy-btn"
                                onClick={handleCopy}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </p>
                    
                </div>

            </div>

 

            {/* Students Table */}
            <div className="chart-card students-table-card animate-fade-in-up delay-3">
                <div className="chart-header">
                    <h3><Users size={18} /> Student Performance Table</h3>
        
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
                                let raw = (s?.result?.predictions?.risk_probability);
                                const riskScore = (raw != null && !isNaN(raw)) ? (raw * 100).toFixed(1) : 0;
                                const riskClass = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low';
                                console.log(riskScore);
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
                                                    className={`risk-bar-fill ${riskClass}`}
                                                    style={{ width: `${riskScore || 0}%` }} //risk
                                                ></div>
                                            </div>
                                            <span className={`risk-value ${s.status}`}>{riskScore}</span>
                                            {/* s.risk */}
                                        </div>
                                    </td>
                                    <td>{s.input_data?.attendance_pct || "-"}</td>
                                    <td><span className={`grade-badge ${riskClass}`}>{s.result?.predictions?.predicted_grade || "-"}</span></td>
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
