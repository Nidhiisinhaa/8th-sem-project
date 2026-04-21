import { 
  TrendingUp, TrendingDown, AlertTriangle, Award, 
  BookOpen, Clock, Target, Lightbulb, ChevronUp, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import './StudentDashboard.css';

// Mock data for the student
const studentData = {
  name: 'Rahul Sharma',
  rollNo: 'CS-2022-042',
  semester: '8th Semester',
  predictedGrade: 'A-',
  riskScore: 23,
  riskLevel: 'Low',
  gpa: 8.4,
  attendance: 87,
};

const semesterTrend = [
  { sem: 'Sem 1', gpa: 7.2 },
  { sem: 'Sem 2', gpa: 7.5 },
  { sem: 'Sem 3', gpa: 7.8 },
  { sem: 'Sem 4', gpa: 8.0 },
  { sem: 'Sem 5', gpa: 7.6 },
  { sem: 'Sem 6', gpa: 8.2 },
  { sem: 'Sem 7', gpa: 8.4 },
  { sem: 'Sem 8', gpa: 8.6 },
];

const subjectScores = [
  { subject: 'ML', score: 88, max: 100 },
  { subject: 'DBMS', score: 75, max: 100 },
  { subject: 'Networks', score: 82, max: 100 },
  { subject: 'Web Dev', score: 92, max: 100 },
  { subject: 'OS', score: 70, max: 100 },
];

const radarData = [
  { factor: 'Attendance', value: 87 },
  { factor: 'Assignments', value: 92 },
  { factor: 'Quizzes', value: 78 },
  { factor: 'Mid-Term', value: 81 },
  { factor: 'Participation', value: 85 },
  { factor: 'Projects', value: 95 },
];

const recommendations = [
  { icon: '📚', text: 'Focus more on DBMS — spend 2 extra hours/week on practice queries', priority: 'high' },
  { icon: '📝', text: 'Your quiz scores can improve — try solving previous year papers', priority: 'medium' },
  { icon: '⏰', text: 'Maintain your attendance above 85% to avoid risk escalation', priority: 'low' },
  { icon: '💡', text: 'Your project scores are excellent — consider contributing to open source', priority: 'info' },
];

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

export default function StudentDashboard() {
  const riskColor = studentData.riskScore <= 30 ? 'green' : studentData.riskScore <= 60 ? 'amber' : 'red';

  return (
    <div className="student-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p className="page-subtitle">Welcome back, {studentData.name} 👋</p>
        </div>
        <div className="header-meta">
          <span className="meta-badge">{studentData.rollNo}</span>
          <span className="meta-badge">{studentData.semester}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up delay-1">
          <div className="stat-icon blue"><Target size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Predicted Grade</span>
            <span className="stat-value-text">{studentData.predictedGrade}</span>
          </div>
          <div className="stat-trend up"><ChevronUp size={16} /> 12%</div>
        </div>

        <div className="stat-card animate-fade-in-up delay-2">
          <div className={`stat-icon ${riskColor}`}><AlertTriangle size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Risk Score</span>
            <span className="stat-value-text">{studentData.riskScore}/100</span>
          </div>
          <span className={`risk-badge ${riskColor}`}>{studentData.riskLevel}</span>
        </div>

        <div className="stat-card animate-fade-in-up delay-3">
          <div className="stat-icon purple"><Award size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Current GPA</span>
            <span className="stat-value-text">{studentData.gpa}</span>
          </div>
          <div className="stat-trend up"><ChevronUp size={16} /> 0.2</div>
        </div>

        <div className="stat-card animate-fade-in-up delay-4">
          <div className="stat-icon cyan"><Clock size={22} /></div>
          <div className="stat-info">
            <span className="stat-label-text">Attendance</span>
            <span className="stat-value-text">{studentData.attendance}%</span>
          </div>
          <div className="stat-trend down"><ChevronDown size={16} /> 3%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* GPA Trend */}
        <div className="chart-card animate-fade-in-up delay-2">
          <div className="chart-header">
            <h3><TrendingUp size={18} /> GPA Trend</h3>
            <span className="chart-badge">All Semesters</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={semesterTrend}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4e7cff" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#4e7cff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                <XAxis dataKey="sem" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <YAxis domain={[6, 10]} tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="gpa" stroke="#4e7cff" strokeWidth={2} fill="url(#gpaGradient)" dot={{ fill: '#4e7cff', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Scores */}
        <div className="chart-card animate-fade-in-up delay-3">
          <div className="chart-header">
            <h3><BookOpen size={18} /> Subject Scores</h3>
            <span className="chart-badge">Current Semester</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectScores} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Radar Chart */}
        <div className="chart-card animate-fade-in-up delay-3">
          <div className="chart-header">
            <h3><Target size={18} /> Performance Factors</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2d3148" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#8b8fa3', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="chart-card recommendations-card animate-fade-in-up delay-4">
          <div className="chart-header">
            <h3><Lightbulb size={18} /> AI Recommendations</h3>
          </div>
          <div className="recommendations-list">
            {recommendations.map((rec, i) => (
              <div key={i} className={`rec-item ${rec.priority}`}>
                <span className="rec-icon">{rec.icon}</span>
                <p>{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
