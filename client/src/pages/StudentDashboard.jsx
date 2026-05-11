import {
    TrendingUp, AlertTriangle, Award,
    Clock, Target, Lightbulb, ChevronUp, ChevronDown,
    Hand, Zap, Shield, Activity, Star, BarChart2
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    CartesianGrid, Cell
} from 'recharts';
import './StudentDashboard.css';
import React, { useContext, useEffect } from 'react';
import StudentContext from '../contexts/student/StudentContext';

// ── Custom Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <p className="tooltip-value">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

// ── Helpers ──────────────────────────────────────────────────────────
const getRisk = (prob) => {
    if (prob <= 0.3) return { level: "Low Risk",    color: "green", hex: "#22c55e" };
    if (prob <= 0.6) return { level: "Medium Risk", color: "amber", hex: "#f59e0b" };
    return                  { level: "High Risk",   color: "red",   hex: "#ef4444" };
};

const gradeDistToChart = (dist) => {
    if (!dist) return [];
    return Object.entries(dist).map(([grade, prob]) => ({
        grade,
        probability: Math.round(prob * 100),
    }));
};

const GRADE_COLORS = {
    "A+": "#22c55e", "A": "#4ade80", "B+": "#4e7cff",
    "B":  "#818cf8", "C": "#f59e0b", "D": "#f97316", "F": "#ef4444",
};

// Mini progress bar used in weak areas card
const ProgressBar = ({ label, current, recommended, overall_avg, color = "#4e7cff" }) => {
    const max = Math.max(recommended, overall_avg, current, 1);
    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>{label}</span>
                <span style={{ color: "#8b8fa3", fontSize: "12px" }}>
                    {current} / rec: {recommended}
                </span>
            </div>
            <div style={{ background: "#1a1d2e", borderRadius: "99px", height: "8px", marginBottom: "4px", overflow: "hidden" }}>
                <div style={{
                    width: `${Math.min((current / max) * 100, 100)}%`,
                    height: "100%",
                    background: color,
                    borderRadius: "99px",
                    transition: "width 1s ease"
                }} />
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#8b8fa3" }}>
                <span>You: <b style={{ color }}>{current}</b></span>
                <span>Avg: <b style={{ color: "#8b8fa3" }}>{overall_avg}</b></span>
                <span>Rec: <b style={{ color: "#22c55e" }}>{recommended}</b></span>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────
export default function StudentDashboard({ user, setUser}) {

    const { studentData: ctxData, loading, error } = useContext(StudentContext);

    useEffect(() => {
        const callBack = async () => {
            try {
                const response = await fetch(
                    "https://student-performance-analysis-backend-engk.onrender.com/api/student/authenticate",
                    { method: "GET", credentials: "include" }
                );

                //  Check if response is actually OK before parsing
                if (!response.ok) {
                    console.warn("Auth failed:", response.status);
                    return; // Don't corrupt user state
                }

                const jsonRes = await response.json();
                setUser(prev => ({ ...prev, ...jsonRes }));

            } catch (err) {
                // ✅ Network errors caught here
                console.error("Authentication error:", err);
            }
        };

        callBack();
    }, []);

    // user prop shape: { role: "student", student: { input_data, result, name, rollNumber, ... } }
    // Prefer user.student (set immediately after Upload save) over context data
    const studentData = user?.student || ctxData;

    if (loading && !studentData) return <div className="loading">Loading Dashboard...</div>;

    if (error && !studentData) return (null);

    if (!studentData) return <div className="loading">Loading Dashboard Data...</div>;

    // ── Destructure all backend fields ────────────────────────────────
    const input       = studentData.input_data || {};
    const result      = studentData.result     || {};
    const insights    = result.insights        || {};
    const predictions = result.predictions     || {};

    // insights sub-fields
    const fieldSuggestions = insights.field_suggestions       || [];
    const riskFactors      = insights.risk_factors            || [];
    const strengths        = insights.strengths               || [];
    const studyRec         = insights.study_recommendation    || {};
    const simulations      = studyRec.simulations             || [];
    const weakAreas        = insights.weak_areas              || [];

    // predictions sub-fields
    const atRisk         = predictions.at_risk            ?? false;
    const gradeConf      = predictions.grade_confidence   ?? 0;
    const gradeDist      = predictions.grade_distribution || {};
    const predictedGrade = predictions.predicted_grade    ?? "N/A";
    const predictedScore = predictions.predicted_score    ?? 0;
    const riskProb       = predictions.risk_probability   ?? 0;

    const { level: riskLevel, color: riskColor, hex: riskHex } = getRisk(riskProb);
    const gradeChartData = gradeDistToChart(gradeDist);
    const simChartData   = simulations.map(s => ({ hours: `${s.hours}h`, score: s.predicted_score }));

    // Radar from input_data normalised to 0-100
    const radarData = [
        { factor: "Attendance",    value: input.attendance_pct ?? 0 },
        { factor: "Study Hours",   value: Math.min(((input.study_hours_weekly ?? 0) / 168) * 100, 100) },
        { factor: "Sleep",         value: Math.round(((input.sleep_hours ?? 0) / 12) * 100) },
        { factor: "Mental Health", value: ((input.mental_health_score ?? 0) / 10) * 100 },
        { factor: "Prev CGPA",     value: ((input.previous_cgpa ?? 0) / 10) * 100 },
    ];

    return (
        <div className="student-dashboard">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back, {studentData.name || user?.name || 'Student'}
                        <span className="waving-hand"><Hand size={20} /></span>
                    </p>
                </div>
                <div className="header-meta">
                    <span className="meta-badge">{studentData.rollNumber}</span>
                    <span className="meta-badge">Sem {input.semester}</span>
                    <span className="meta-badge">{input.department}</span>
                </div>
            </div>

            {/* Row 1: 4 Stat Cards */}
            <div className="stats-grid">

                <div className="stat-card animate-fade-in-up delay-1">
                    <div className="stat-icon blue"><Target size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Predicted Grade</span>
                        <span className="stat-value-text">{predictedGrade}</span>
                    </div>
                    <div className="stat-trend up">
                        <ChevronUp size={16} />
                        {Math.round(gradeConf * 100)}% confidence
                    </div>
                </div>

                <div className="stat-card animate-fade-in-up delay-2">
                    <div className="stat-icon" style={{ color: riskHex }}>
                        <AlertTriangle size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label-text">Risk Probability</span>
                        <span className="stat-value-text">{Math.round(riskProb * 100)}%</span>
                    </div>
                    <span className={`risk-badge ${riskColor}`}>{riskLevel}</span>
                </div>

                <div className="stat-card animate-fade-in-up delay-3">
                    <div className="stat-icon purple"><Award size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Predicted Score</span>
                        <span className="stat-value-text">{predictedScore}</span>
                    </div>
                    <div className={`stat-trend ${atRisk ? "down" : "up"}`}>
                        {atRisk
                            ? <><ChevronDown size={16} /> At Risk</>
                            : <><ChevronUp size={16} /> On Track</>}
                    </div>
                </div>

                <div className="stat-card animate-fade-in-up delay-4">
                    <div className="stat-icon cyan"><Clock size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label-text">Attendance</span>
                        <span className="stat-value-text">{input.attendance_pct ?? "N/A"}%</span>
                    </div>
                    <div className={`stat-trend ${(input.attendance_pct ?? 0) >= 75 ? "up" : "down"}`}>
                        {(input.attendance_pct ?? 0) >= 75
                            ? <><ChevronUp size={16} /> Good</>
                            : <><ChevronDown size={16} /> Low</>}
                    </div>
                </div>

            </div>

            {/* Row 2: Grade Distribution + Radar */}
            <div className="charts-row">

                <div className="chart-card animate-fade-in-up delay-2">
                    <div className="chart-header">
                        <h3><BarChart2 size={18} /> Grade Distribution</h3>
                        <span className="chart-badge">ML Prediction</span>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={gradeChartData} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
                                <XAxis dataKey="grade" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} tickFormatter={v => `${v}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                                    {gradeChartData.map((entry) => (
                                        <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || "#4e7cff"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card animate-fade-in-up delay-3">
                    <div className="chart-header">
                        <h3><Target size={18} /> Performance Factors</h3>
                        <span className="chart-badge">Normalised 0-100</span>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#2d3148" />
                                <PolarAngleAxis dataKey="factor" tick={{ fill: '#8b8fa3', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar dataKey="value" stroke="#22c55e" fill="#22c55e"
                                    fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Row 3: Study Simulations + Weak Areas */}
            <div className="charts-row">

                <div className="chart-card animate-fade-in-up delay-2">
                    <div className="chart-header">
                        <h3><TrendingUp size={18} /> Study Hour Simulations</h3>
                        <span className="chart-badge">
                            Rec: {studyRec.recommended_hoursapp ?? "N/A"}h / week
                        </span>
                    </div>
                    {studyRec.message && (
                        <p style={{ color: '#8b8fa3', fontSize: '13px', padding: '0 16px 8px', lineHeight: 1.5 }}>
                            {studyRec.message}
                        </p>
                    )}
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={210}>
                            <AreaChart data={simChartData}>
                                <defs>
                                    <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4e7cff" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#4e7cff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                                <XAxis dataKey="hours" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                                <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="score" stroke="#4e7cff" strokeWidth={2}
                                    fill="url(#simGradient)" dot={{ fill: '#4e7cff', r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {studyRec.potential_improvement !== undefined && (
                        <div style={{ padding: '0 16px 16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{
                                background: '#22c55e22', border: '1px solid #22c55e44',
                                borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#22c55e'
                            }}>
                                Potential improvement: +{studyRec.potential_improvement} pts
                            </div>
                            <div style={{
                                background: '#4e7cff22', border: '1px solid #4e7cff44',
                                borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#4e7cff'
                            }}>
                                Current: {studyRec.current_hours}h / Target: {studyRec.recommended_hoursapp}h
                            </div>
                        </div>
                    )}
                </div>

                <div className="chart-card animate-fade-in-up delay-3">
                    <div className="chart-header">
                        <h3><Activity size={18} /> Weak Areas</h3>
                    </div>
                    <div style={{ padding: '8px 16px 16px' }}>
                        {weakAreas.length > 0
                            ? weakAreas.map((w, i) => (
                                <div key={i}>
                                    <ProgressBar
                                        label={w.area}
                                        current={w.current}
                                        recommended={w.recommended}
                                        overall_avg={w.overall_avg}
                                        color={
                                            w.area === "Attendance"    ? "#f59e0b" :
                                            w.area === "Study Hours"   ? "#4e7cff" :
                                            w.area === "Mental Health" ? "#8b5cf6" : "#ef4444"
                                        }
                                    />
                                    <p style={{
                                        color: '#8b8fa3', fontSize: '12px',
                                        marginTop: '-8px', marginBottom: '14px', lineHeight: 1.4
                                    }}>
                                        {w.message}
                                    </p>
                                </div>
                            ))
                            : <p style={{ color: '#8b8fa3' }}>No weak areas detected</p>
                        }
                    </div>
                </div>

            </div>

            {/* Row 4: Strengths + Risk Factors */}
            <div className="charts-row">

                <div className="chart-card animate-fade-in-up delay-2">
                    <div className="chart-header">
                        <h3><Star size={18} /> Your Strengths</h3>
                        <span className="chart-badge" style={{ background: '#22c55e22', color: '#22c55e' }}>
                            {strengths.length} identified
                        </span>
                    </div>
                    <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {strengths.length > 0
                            ? strengths.map((s, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: '#22c55e11', border: '1px solid #22c55e33',
                                    borderRadius: '10px', padding: '10px 14px'
                                }}>
                                    <span style={{ fontSize: '18px' }}>&#10003;</span>
                                    <p style={{ color: '#e2e8f0', fontSize: '13px', margin: 0 }}>{s}</p>
                                </div>
                            ))
                            : <p style={{ color: '#8b8fa3' }}>No strengths data yet.</p>
                        }
                    </div>
                </div>

                <div className="chart-card animate-fade-in-up delay-3">
                    <div className="chart-header">
                        <h3><Shield size={18} /> Risk Factors</h3>
                        <span className="chart-badge" style={{
                            background: riskFactors.length > 0 ? '#ef444422' : '#22c55e22',
                            color:      riskFactors.length > 0 ? '#ef4444'   : '#22c55e'
                        }}>
                            {riskFactors.length} found
                        </span>
                    </div>
                    <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {riskFactors.length > 0
                            ? riskFactors.map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                    background: '#ef444411', border: '1px solid #ef444433',
                                    borderRadius: '10px', padding: '10px 14px'
                                }}>
                                    <span style={{ fontSize: '18px', flexShrink: 0 }}>!</span>
                                    <p style={{ color: '#e2e8f0', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{r}</p>
                                </div>
                            ))
                            : (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: '#22c55e11', border: '1px solid #22c55e33',
                                    borderRadius: '10px', padding: '14px'
                                }}>
                                    <p style={{ color: '#22c55e', fontSize: '13px', margin: 0 }}>
                                        No risk factors detected! Keep it up.
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>

            {/* Row 5: Field Suggestions */}
            <div className="bottom-row">
                <div className="chart-card animate-fade-in-up delay-3" style={{ flex: 1 }}>
                    <div className="chart-header">
                        <h3><Zap size={18} /> Career Field Suggestions</h3>
                        <span className="chart-badge">{fieldSuggestions.length} paths identified</span>
                    </div>
                    <div style={{
                        padding: '8px 16px 16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '12px'
                    }}>
                        {fieldSuggestions.map((f, i) => {
                            const matchColor =
                                f.match === 'High'   ? { bg: '#22c55e22', border: '#22c55e44', text: '#22c55e' } :
                                f.match === 'Medium' ? { bg: '#f59e0b22', border: '#f59e0b44', text: '#f59e0b' } :
                                                       { bg: '#ef444422', border: '#ef444444', text: '#ef4444' };
                            return (
                                <div key={i} style={{
                                    background: '#1a1d2e',
                                    border: `1px solid ${matchColor.border}`,
                                    borderRadius: '12px', padding: '14px',
                                    display: 'flex', flexDirection: 'column', gap: '8px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ color: '#e2e8f0', fontSize: '14px' }}>{f.field}</strong>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 700,
                                            padding: '3px 10px', borderRadius: '99px',
                                            background: matchColor.bg, color: matchColor.text,
                                            border: `1px solid ${matchColor.border}`
                                        }}>
                                            {f.match} Match
                                        </span>
                                    </div>
                                    <p style={{ color: '#8b8fa3', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                                        {f.reason}
                                    </p>
                                </div>
                            );
                        })}
                        {fieldSuggestions.length === 0 && (
                            <p style={{ color: '#8b8fa3' }}>No field suggestions yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 6: AI Recommendations */}
            <div className="bottom-row">
                <div className="chart-card recommendations-card animate-fade-in-up delay-4" style={{ flex: 1 }}>
                    <div className="chart-header">
                        <h3><Lightbulb size={18} /> AI Recommendations</h3>
                    </div>
                    <div className="recommendations-list">

                        {atRisk && (
                            <div className="rec-item high">
                                <span className="rec-icon">!</span>
                                <p>
                                    You are currently <strong>flagged as at-risk</strong>. Risk probability:{' '}
                                    <strong>{Math.round(riskProb * 100)}%</strong>. Focus on attendance and study hours immediately.
                                </p>
                            </div>
                        )}

                        <div className="rec-item info">
                            <span className="rec-icon">*</span>
                            <p>
                                Predicted grade: <strong>{predictedGrade}</strong> with score{' '}
                                <strong>{predictedScore}</strong> and{' '}
                                <strong>{Math.round(gradeConf * 100)}%</strong> model confidence.
                            </p>
                        </div>

                        {studyRec.message && (
                            <div className="rec-item medium">
                                <span className="rec-icon">+</span>
                                <p>
                                    {studyRec.message} Potential gain:{' '}
                                    <strong>+{studyRec.potential_improvement} pts</strong>.
                                </p>
                            </div>
                        )}

                        <div className="rec-item low">
                            <span className="rec-icon">~</span>
                            <p>
                                Extracurricular: <strong>{input.extracurricular || "N/A"}</strong>.{' '}
                                {input.extracurricular === "No Activity"
                                    ? "Consider joining a club or sport to boost mental health and time management."
                                    : "Great that you are active — maintain a healthy balance with studies."}
                            </p>
                        </div>

                        <div className={`rec-item ${(input.mental_health_score ?? 0) < 7 ? "high" : "info"}`}>
                            <span className="rec-icon">M</span>
                            <p>
                                Mental health score: <strong>{input.mental_health_score ?? "N/A"}/10</strong>.{' '}
                                {(input.mental_health_score ?? 0) < 5
                                    ? "This is concerning — please reach out to a counsellor or trusted person."
                                    : (input.mental_health_score ?? 0) < 7
                                    ? "Room to improve — try mindfulness and regular breaks."
                                    : "Great mental health — keep prioritising your wellbeing!"}
                            </p>
                        </div>

                        <div className={`rec-item ${(input.sleep_hours ?? 0) < 6 ? "high" : "low"}`}>
                            <span className="rec-icon">Z</span>
                            <p>
                                Sleep: <strong>{input.sleep_hours ?? "N/A"} hrs/day</strong>.{' '}
                                {(input.sleep_hours ?? 0) < 6
                                    ? "You are sleeping too little. Aim for 7-8 hours for better performance."
                                    : "Good sleep schedule! Consistent rest aids memory and focus."}
                            </p>
                        </div>

                        <div className="rec-item low">
                            <span className="rec-icon">W</span>
                            <p>
                                Part-time job: <strong>{input.has_part_time_job === 1 ? "Yes" : "No"}</strong>.{' '}
                                {input.has_part_time_job === 1
                                    ? "Managing a job alongside studies is tough — protect your sleep and study time."
                                    : "No part-time job — use this time for academics and extracurriculars."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
