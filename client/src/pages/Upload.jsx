import { Upload as UploadIcon, FileSpreadsheet, CheckCircle, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import './Upload.css';

const samplePreview = [
  { name: 'Aarav Patel', attendance: 95, assignments: 92, midterm: 88, quizzes: 85 },
  { name: 'Priya Singh', attendance: 91, assignments: 88, midterm: 82, quizzes: 79 },
  { name: 'Rahul Sharma', attendance: 87, assignments: 85, midterm: 81, quizzes: 78 },
  { name: 'Sneha Gupta', attendance: 78, assignments: 72, midterm: 68, quizzes: 65 },
  { name: 'Vikram Joshi', attendance: 72, assignments: 65, midterm: 58, quizzes: 55 },
];

export default function UploadPage() {
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setUploaded(true);
  };

  return (
    <div className="upload-page">
      <div className="page-header">
        <div>
          <h1>Upload Student Data</h1>
          <p className="page-subtitle">Upload CSV or Excel files with student records for prediction</p>
        </div>
      </div>

      {!uploaded ? (
        <div className="upload-section">
          {/* Drop Zone */}
          <div 
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="drop-icon">
              <UploadIcon size={40} />
            </div>
            <h3>Drag & Drop your file here</h3>
            <p>or click to browse</p>
            <div className="file-types">
              <span className="file-type-badge">.CSV</span>
              <span className="file-type-badge">.XLSX</span>
              <span className="file-type-badge">.XLS</span>
            </div>
            <button className="browse-btn" onClick={handleUpload}>
              <UploadIcon size={16} />
              Browse Files
            </button>
          </div>

          {/* Format Guide */}
          <div className="format-guide">
            <div className="guide-header">
              <FileSpreadsheet size={20} />
              <h3>Expected File Format</h3>
            </div>
            <p>Your CSV/Excel file should contain the following columns:</p>
            <div className="format-table-wrapper">
              <table className="format-table">
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>student_name</td><td>Text</td><td>Full name of the student</td></tr>
                  <tr><td>attendance</td><td>Number (0-100)</td><td>Attendance percentage</td></tr>
                  <tr><td>assignments</td><td>Number (0-100)</td><td>Assignment scores average</td></tr>
                  <tr><td>midterm</td><td>Number (0-100)</td><td>Midterm exam score</td></tr>
                  <tr><td>quizzes</td><td>Number (0-100)</td><td>Quiz scores average</td></tr>
                  <tr><td>study_hours</td><td>Number</td><td>Weekly study hours (optional)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="upload-success-section animate-fade-in-up">
          {/* Success Banner */}
          <div className="success-banner">
            <CheckCircle size={22} />
            <div>
              <strong>File uploaded successfully!</strong>
              <p>student_data_2026.csv — 64 records found</p>
            </div>
            <button className="close-banner" onClick={() => setUploaded(false)}><X size={16} /></button>
          </div>

          {/* Data Preview */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>📋 Data Preview</h3>
              <span className="chart-badge">Showing 5 of 64 rows</span>
            </div>
            <div className="table-wrapper">
              <table className="students-table preview-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Attendance</th>
                    <th>Assignments</th>
                    <th>Mid-Term</th>
                    <th>Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {samplePreview.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.attendance}%</td>
                      <td>{s.assignments}</td>
                      <td>{s.midterm}</td>
                      <td>{s.quizzes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Summary */}
          <div className="validation-row">
            <div className="validation-card success">
              <CheckCircle size={18} />
              <div>
                <strong>All columns validated</strong>
                <p>Required columns found in dataset</p>
              </div>
            </div>
            <div className="validation-card success">
              <CheckCircle size={18} />
              <div>
                <strong>No missing values</strong>
                <p>All 64 records are complete</p>
              </div>
            </div>
            <div className="validation-card warning">
              <AlertCircle size={18} />
              <div>
                <strong>2 outliers detected</strong>
                <p>Some values may need review</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="run-prediction-btn">
            <span>Run Prediction Model</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
