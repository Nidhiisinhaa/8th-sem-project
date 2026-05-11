import { useState } from "react";
import "./Upload.css";

const INITIAL_FORM = {
  study_hours_weekly: "",
  attendance_pct: "",
  previous_cgpa: "",
  sleep_hours: "",
  mental_health_score: "",
  has_part_time_job: "",
  extracurricular: "",
  department: "",
  semester: "",
};

const DEPARTMENTS = [
  "Electronics",
  "Computer Science",
  "Mechanical",
  "Information Technology",
  "Civil",
];

const EXTRACURRICULAR = [
  "Sports",
  "Cultural",
  "Multiple",
  "No Activity",
  "Technical Club",
];

export default function Upload({setUser}) {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState("");

  const validate = () => {
    const e = {};
    const inRange = (val, min, max) => {
      const n = parseFloat(val);
      return !isNaN(n) && n >= min && n <= max;
    };

    if (!form.study_hours_weekly)
      e.study_hours_weekly = "Required";
    else if (!inRange(form.study_hours_weekly, 0, 168))
      e.study_hours_weekly = "Enter 0–168 hrs";

    if (!form.attendance_pct)
      e.attendance_pct = "Required";
    else if (!inRange(form.attendance_pct, 0, 100))
      e.attendance_pct = "Enter 0–100%";

    if (!form.previous_cgpa)
      e.previous_cgpa = "Required";
    else if (!inRange(form.previous_cgpa, 0, 10))
      e.previous_cgpa = "Enter 0.0–10.0";

    if (!form.sleep_hours)
      e.sleep_hours = "Required";
    else if (!inRange(form.sleep_hours, 0, 24))
      e.sleep_hours = "Enter 0–24 hrs";

    if (!form.mental_health_score)
      e.mental_health_score = "Required";
    else if (!inRange(form.mental_health_score, 0, 10))
      e.mental_health_score = "Enter 0–10";

    if (form.has_part_time_job === "") e.has_part_time_job = "Required";
    if (!form.extracurricular)         e.extracurricular   = "Required";
    if (!form.department)              e.department        = "Required";

    if (!form.semester)
      e.semester = "Required";
    else if (!inRange(form.semester, 1, 8))
      e.semester = "Enter 1–8";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const buildPayload = () => ({
    study_hours_weekly:  parseFloat(form.study_hours_weekly),
    attendance_pct:      parseFloat(form.attendance_pct),
    previous_cgpa:       parseFloat(form.previous_cgpa),
    sleep_hours:         parseFloat(form.sleep_hours),
    mental_health_score: parseFloat(form.mental_health_score),
    has_part_time_job:   parseInt(form.has_part_time_job),
    extracurricular:     form.extracurricular,
    department:          form.department,
    semester:            parseInt(form.semester),
  });

  const handleSave = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      // First time save → metadata (POST)
      // Edit save → student edit (PUT)
      const url    = isEditing
        ? "https://student-performance-analysis-backend-engk.onrender.com/api/student/"
        : "https://student-performance-analysis-backend-engk.onrender.com/api/student/metadata";
      const method = isEditing ? "put" : "post";

      const response = await fetch(url, {
        method,
        body:        JSON.stringify(buildPayload()),
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
      });
      const responseJson = await response.json();
      console.log("Upload response:", responseJson);

      if (!response.ok) {
        throw new Error(responseJson.message || "Something went wrong");
      }
      setUser(prev => ({ ...prev, ...responseJson }));
      setSubmitted(true);
      setIsEditing(false);

    } catch (err) {
      console.log("error in Upload/handleSave:", err);
      setApiError(err.message || "Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSubmitted(false);
    setApiError("");
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setIsEditing(false);
    setApiError("");
  };

  // ── Success screen ──
  if (submitted && !isEditing) {
    return (
      <div className="up-page">
        <div className="up-success-card">
          <div className="up-success-icon">✓</div>
          <h2 className="up-success-title">Details Saved!</h2>
          <p className="up-success-sub">
            Your academic details have been saved successfully.<br />
            Predictions will now reflect on your Student Dashboard.
          </p>
          <div className="up-success-actions">
            <button className="up-btn-secondary" onClick={handleEdit}>
              ✏️ Edit Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="up-page">
      <div className="up-page-header">
        <h1 className="up-page-title">
          {isEditing ? "✏️ Edit Your Details" : "Student Performance Form"}
        </h1>
        <p className="up-page-sub">
          {isEditing
            ? "Update the fields below, then click Save Changes."
            : "Fill in your academic details. All fields are required for an accurate prediction."}
        </p>
      </div>

      {apiError && <div className="up-api-error">⚠️ {apiError}</div>}

      <form className="up-form" onSubmit={handleSave} noValidate>

        {/* Section 1: Academic Details */}
        <div className="up-section">
          <div className="up-section-label">
            <span className="up-section-num">01</span>
            Academic Details
          </div>
          <div className="up-grid-3">

            <div className="up-field">
              <label className="up-label">Department</label>
              <select
                className={`up-input up-select ${errors.department ? "up-input-err" : ""}`}
                name="department" value={form.department} onChange={handleChange}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="up-err">{errors.department}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Semester <span className="up-hint">(1–8)</span></label>
              <input
                className={`up-input ${errors.semester ? "up-input-err" : ""}`}
                type="number" name="semester" value={form.semester}
                onChange={handleChange} placeholder="e.g. 6" min={1} max={8}
              />
              {errors.semester && <span className="up-err">{errors.semester}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Previous CGPA <span className="up-hint">(0–10)</span></label>
              <input
                className={`up-input ${errors.previous_cgpa ? "up-input-err" : ""}`}
                type="number" name="previous_cgpa" value={form.previous_cgpa}
                onChange={handleChange} placeholder="e.g. 7.8" step="0.01" min={0} max={10}
              />
              {errors.previous_cgpa && <span className="up-err">{errors.previous_cgpa}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Attendance <span className="up-hint">(0–100%)</span></label>
              <input
                className={`up-input ${errors.attendance_pct ? "up-input-err" : ""}`}
                type="number" name="attendance_pct" value={form.attendance_pct}
                onChange={handleChange} placeholder="e.g. 85" min={0} max={100}
              />
              {errors.attendance_pct && <span className="up-err">{errors.attendance_pct}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Study Hours / Week <span className="up-hint">(0–168)</span></label>
              <input
                className={`up-input ${errors.study_hours_weekly ? "up-input-err" : ""}`}
                type="number" name="study_hours_weekly" value={form.study_hours_weekly}
                onChange={handleChange} placeholder="e.g. 20" min={0} max={168}
              />
              {errors.study_hours_weekly && <span className="up-err">{errors.study_hours_weekly}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Extracurricular Activities</label>
              <select
                className={`up-input up-select ${errors.extracurricular ? "up-input-err" : ""}`}
                name="extracurricular" value={form.extracurricular} onChange={handleChange}
              >
                <option value="">Select activity</option>
                {EXTRACURRICULAR.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.extracurricular && <span className="up-err">{errors.extracurricular}</span>}
            </div>

          </div>
        </div>

        {/* Section 2: Lifestyle */}
        <div className="up-section">
          <div className="up-section-label">
            <span className="up-section-num">02</span>
            Lifestyle & Wellbeing
          </div>
          <div className="up-grid-3">

            <div className="up-field">
              <label className="up-label">Sleep Hours / Day <span className="up-hint">(0–24)</span></label>
              <input
                className={`up-input ${errors.sleep_hours ? "up-input-err" : ""}`}
                type="number" name="sleep_hours" value={form.sleep_hours}
                onChange={handleChange} placeholder="e.g. 7" min={0} max={24}
              />
              {errors.sleep_hours && <span className="up-err">{errors.sleep_hours}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Mental Health Score <span className="up-hint">(1–10)</span></label>
              <input
                className={`up-input ${errors.mental_health_score ? "up-input-err" : ""}`}
                type="number" name="mental_health_score" value={form.mental_health_score}
                onChange={handleChange} placeholder="0 = very poor, 10 = excellent" min={1} max={10}
              />
              {errors.mental_health_score && <span className="up-err">{errors.mental_health_score}</span>}
            </div>

            <div className="up-field">
              <label className="up-label">Part-Time Job</label>
              <select
                className={`up-input up-select ${errors.has_part_time_job ? "up-input-err" : ""}`}
                name="has_part_time_job" value={form.has_part_time_job} onChange={handleChange}
              >
                <option value="">Select option</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors.has_part_time_job && <span className="up-err">{errors.has_part_time_job}</span>}
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="up-submit-row">
          <button type="button" className="up-btn-secondary" onClick={handleReset}>
            Clear Form
          </button>

          {isEditing && (
            <button
              type="button" className="up-btn-edit"
              onClick={() => { setIsEditing(false); setSubmitted(true); }}
            >
              Cancel Edit
            </button>
          )}

          <button type="submit" className="up-btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "💾 Save Changes" : "💾 Save"}
          </button>
        </div>

      </form>
    </div>
  );
}

