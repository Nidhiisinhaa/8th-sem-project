import { Link } from 'react-router-dom';
import {
  BookOpen, BarChart3, Shield, Zap, ArrowRight,
  Brain, TrendingUp, Users, Star, ChevronRight, RouteIcon, Library
} from 'lucide-react';
import './Landing.css';
import gpachart from '../assets/gpachart.png';
import scorechart from '../assets/scorechart.png';
import FactorsChart from '../assets/FactorsChart.png';
import GradeChart from '../assets/GradeChart.png';
import StudentLog from '../assets/StudentLog.png';
import Menu from '../assets/Menu.png';
import HeroVideo from '../assets/HeroVideo.mp4';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    desc: 'Machine learning models predict student performance with high accuracy using historical data.',
    color: 'blue'
  },
  {
    icon: TrendingUp,
    title: 'Risk Detection',
    desc: 'Automatically identify at-risk students before they fall behind, enabling timely intervention.',
    color: 'red'
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Interactive charts and dashboards that make complex data easy to understand at a glance.',
    color: 'green'
  },
  // {
  //   icon: Shield,
  //   title: 'Explainable AI',
  //   desc: 'Understand WHY a student is at risk with SHAP-based prediction explanations.',
  //   color: 'purple'
  // },
   {
    icon: Shield,
    title: 'Predictive Career Mapping',
    desc: 'Beyond just grades, the AI analyzes performance trends to suggest potential career paths or higher-education specializations where the student is most likely to excel.',
    color: 'purple'
  },
  {
    icon: RouteIcon,
    title: 'Performance Roadmap',
    desc: 'A visual timeline of academic trajectory, highlighting milestones and predicting future outcomes based on current trends.',
    color: 'orange'
  },
  {
    icon: Library,
    title: 'AI-Powered Study Resources',
    desc: 'Automatically matches at-risk students with specific learning materials, video lectures, and practice tests tailored to the exact subjects where the ML model predicts a performance dip.',
    color: 'pink'
  }
];

const stats = [
  { value: '95%', label: 'Prediction Accuracy' },
  { value: '500+', label: 'Students Analyzed' },
  { value: '3x', label: 'Faster Identification' },
  { value: '40%', label: 'Improvement Rate' }
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="nav-brand">
          <div className="brand-icon"><BookOpen size={20} /></div>
          <span className='logo-text'>EduPredict</span>
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Results</a>
          <Link to="/login" className="nav-login-btn">
            Login <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-orb orb-1"></div>
        <div className="hero-bg-orb orb-2"></div>
        <div className="hero-bg-orb orb-3"></div>

        {/* <div className="hero-badge animate-fade-in-up">
          <Zap size={14} />
          <span>Powered by Machine Learning</span>
        </div> */}

        <h1 className="hero-title animate-fade-in-up delay-1">
          Predict Student <span className="gradient-text"> Performance</span>
          <br />Before It's Too Late
        </h1>

        <p className="hero-subtitle animate-fade-in-up delay-2">
          An intelligent system that uses predictive analytics to identify at-risk students,
          forecast academic outcomes, and provide actionable improvement suggestions.
        </p>

        <div className="hero-actions animate-fade-in-up delay-3">
          <Link to="/dashboard/student" className="btn-primary">
            <span>View Demo</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary">
            <span>Get Started</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="hero-visual-stage">
        {/* CENTRAL VIDEO SLOT */}
        <div className="video-main-container glass-card">
          <div className="video-mockup-header">
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
          </div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="main-video"
          >
            <source src={HeroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* LEFT SIDE WIDGETS */}
        <img src={FactorsChart} className="floating-ui factors-pos animate-float" alt="Factors" />
        <img src={gpachart} className="floating-ui gpa-pos animate-float-delayed" alt="GPA Trend" />

        {/* RIGHT SIDE WIDGETS */}
        <img src={scorechart} className="floating-ui score-pos animate-float" alt="Subject Scores" />
        <img src={StudentLog} className="floating-ui log-pos animate-float-delayed" alt="Student Activity" />

        {/* TOP & BOTTOM ACCENTS */}
        <img src={GradeChart} className="floating-ui grade-pos animate-float" alt="Grade Distribution" />
        <img src={Menu} className="floating-ui menu-pos animate-float-delayed" alt="Navigation Menu" />
      </div>

        <div className="hero-stats animate-fade-in-up delay-4">
          {stats.map((stat, i) => (
            <div key={i} className="hero-stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2>Everything You Need to<br /><span className="gradient-text">Transform Education</span></h2>
          <p>Our platform combines advanced ML with intuitive design to make predictive analytics accessible.</p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={`feature-card animate-fade-in-up delay-${i + 1}`}>
                <div className={`feature-icon ${f.color}`}>
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join the future of education analytics. Simple setup, powerful results.</p>
            <Link to="/login" className="btn-primary">
              <span>Start Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <BookOpen size={18} />
          <span>EduPredict</span>
        </div>
        <p>© All Copyrights Reserved 2026</p>
      </footer>
    </div>
  );
}
