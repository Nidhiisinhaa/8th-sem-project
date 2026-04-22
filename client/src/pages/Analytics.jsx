import {
  TrendingUp, Users, Award, BookOpen, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import './Analytics.css';

const monthlyTrend = [
  { month: 'Aug', avgScore: 72, atRisk: 12 },
  { month: 'Sep', avgScore: 74, atRisk: 11 },
  { month: 'Oct', avgScore: 73, atRisk: 10 },
  { month: 'Nov', avgScore: 76, atRisk: 9 },
  { month: 'Dec', avgScore: 78, atRisk: 8 },
  { month: 'Jan', avgScore: 79, atRisk: 8 },
  { month: 'Feb', avgScore: 81, atRisk: 7 },
  { month: 'Mar', avgScore: 82, atRisk: 6 },
];

const subjectComparison = [
  { subject: 'Machine Learning', avg: 78, highest: 96, lowest: 42 },
  { subject: 'DBMS', avg: 72, highest: 94, lowest: 38 },
  { subject: 'Networks', avg: 75, highest: 92, lowest: 45 },
  { subject: 'Web Dev', avg: 82, highest: 98, lowest: 55 },
  { subject: 'OS', avg: 70, highest: 90, lowest: 35 },
];

const factorImpact = [
  { factor: 'Attendance', impact: 28, color: '#4e7cff' },
  { factor: 'Assignments', impact: 24, color: '#8b5cf6' },
  { factor: 'Mid-Term', impact: 22, color: '#22c55e' },
  { factor: 'Study Hours', impact: 15, color: '#f59e0b' },
  { factor: 'Quizzes', impact: 11, color: '#06b6d4' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} className="tooltip-value" style={{ color: p.color }}>
            {p.dataKey}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics & Insights</h1>
          <p className="page-subtitle">Real-time academic forecasting</p>
        </div>
      </div>

      {/* Top Charts */}
      <div className="charts-row">
        <div className="chart-card animate-fade-in-up delay-1">
          <div className="chart-header">
            <h3><TrendingUp size={18} /> Performance Trend (Monthly)</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4e7cff" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#4e7cff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                <XAxis dataKey="month" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avgScore" stroke="#4e7cff" strokeWidth={2} fill="url(#scoreGrad)" name="Avg Score" dot={{ fill: '#4e7cff', r: 4 }} />
                <Line type="monotone" dataKey="atRisk" stroke="#ef4444" strokeWidth={2} name="At-Risk Count" dot={{ fill: '#ef4444', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card animate-fade-in-up delay-2">
          <div className="chart-header">
            <h3><BarChart3 size={18} /> Feature Impact (SHAP Importance)</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={factorImpact} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} unit="%" />
                <YAxis type="category" dataKey="factor" tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]} name="Impact %">
                  {factorImpact.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Comparison */}
      <div className="chart-card full-width animate-fade-in-up delay-3">
        <div className="chart-header">
          <h3><BookOpen size={18} /> Subject-wise Score Comparison</h3>
          <div className="legend-inline">
            <span className="legend-dot" style={{ background: '#4e7cff' }}></span> Average
            <span className="legend-dot" style={{ background: '#22c55e' }}></span> Highest
            <span className="legend-dot" style={{ background: '#ef4444' }}></span> Lowest
          </div>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectComparison} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: '#8b8fa3', fontSize: 11 }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#8b8fa3', fontSize: 12 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="highest" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={22} name="Highest" />
              <Bar dataKey="avg" fill="#4e7cff" radius={[4, 4, 0, 0]} barSize={22} name="Average" />
              <Bar dataKey="lowest" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={22} name="Lowest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Info Card */}
      <div className="model-info-grid animate-fade-in-up delay-4">
        <div className="model-card">
          <div className="model-icon blue"><Award size={22} /></div>
          <h4>Model Accuracy</h4>
          <span className="model-value">94.2%</span>
          <p>Random Forest Classifier</p>
        </div>
        <div className="model-card">
          <div className="model-icon green"><TrendingUp size={22} /></div>
          <h4>Precision</h4>
          <span className="model-value">91.8%</span>
          <p>At-risk prediction precision</p>
        </div>
        <div className="model-card">
          <div className="model-icon purple"><Users size={22} /></div>
          <h4>Recall</h4>
          <span className="model-value">89.5%</span>
          <p>At-risk detection recall</p>
        </div>
        <div className="model-card">
          <div className="model-icon cyan"><BarChart3 size={22} /></div>
          <h4>F1 Score</h4>
          <span className="model-value">90.6%</span>
          <p>Harmonic mean of precision & recall</p>
        </div>
      </div>
    </div>
  );
}
