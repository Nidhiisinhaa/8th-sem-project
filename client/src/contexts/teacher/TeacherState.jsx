import React, { useState, useEffect } from "react";
import TeacherContext from "./TeacherContext";

const TeacherState = (props) => {

    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTeacherData = async () => {
        setLoading(true);
        setError(null);
        try {
            // ---- BACKEND READY LINE (uncomment when backend is ready) ----
            // const data = await getTeacherDataAPI();
            // setTeacherData(data);

            // ---- DUMMY DATA (delete this block when backend is ready) ----
            const dummyData = {
                classStats: {
                    totalStudents: 64,
                    atRisk: 8,
                    avgGPA: 7.8,
                    passRate: 89,
                },
                gradeDistribution: [
                    { grade: 'A+', count: 5, color: '#22c55e' },
                    { grade: 'A', count: 12, color: '#4e7cff' },
                    { grade: 'B+', count: 16, color: '#8b5cf6' },
                    { grade: 'B', count: 14, color: '#06b6d4' },
                    { grade: 'C', count: 9, color: '#f59e0b' },
                    { grade: 'D', count: 5, color: '#ef4444' },
                    { grade: 'F', count: 3, color: '#dc2626' },
                ],
                riskDistribution: [
                    { name: 'Low Risk', value: 42, color: '#22c55e' },
                    { name: 'Medium Risk', value: 14, color: '#f59e0b' },
                    { name: 'High Risk', value: 8, color: '#ef4444' },
                ],
                students: [
                    { id: 1, name: 'Aarav Patel', roll: 'CS-001', gpa: 9.1, risk: 8, status: 'low', attendance: 95, predicted: 'A+' },
                    { id: 2, name: 'Priya Singh', roll: 'CS-002', gpa: 8.6, risk: 15, status: 'low', attendance: 91, predicted: 'A' },
                    { id: 3, name: 'Rahul Sharma', roll: 'CS-003', gpa: 8.4, risk: 23, status: 'low', attendance: 87, predicted: 'A-' },
                    { id: 4, name: 'Sneha Gupta', roll: 'CS-004', gpa: 7.2, risk: 45, status: 'medium', attendance: 78, predicted: 'B' },
                    { id: 5, name: 'Vikram Joshi', roll: 'CS-005', gpa: 6.5, risk: 62, status: 'medium', attendance: 72, predicted: 'C+' },
                    { id: 6, name: 'Ananya Reddy', roll: 'CS-006', gpa: 5.8, risk: 78, status: 'high', attendance: 65, predicted: 'D' },
                    { id: 7, name: 'Karan Mehta', roll: 'CS-007', gpa: 5.2, risk: 85, status: 'high', attendance: 58, predicted: 'D' },
                    { id: 8, name: 'Neha Agarwal', roll: 'CS-008', gpa: 4.8, risk: 92, status: 'high', attendance: 52, predicted: 'F' },
                ],
            };
            setTeacherData(dummyData);
            // ---- END DUMMY DATA ----

        } catch (err) {
            setError("Failed to load teacher data. Please try again.");
            console.error("Teacher API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeacherData();
    }, []);

    return (
        <TeacherContext.Provider value={{ teacherData, loading, error, getTeacherData }}>
            {props.children}
        </TeacherContext.Provider>
    );
};

export default TeacherState;


// import React, { useState } from "react";
// import TeacherContext from "./TeacherContext";

// const TeacherState = (props) => {
//     // Teacher ka data hold karne ke liye state
//     const [teacherData, setTeacherData] = useState(null);

//     // Backend se teacher data lane ka function
//     const getTeacherData = async () => {
//         console.log("Calling Teacher Backend API...");
//         // Yahan future mein fetch() call aayega
//     };

//     return (
//         <TeacherContext.Provider value={{ teacherData, setTeacherData, getTeacherData }}>
//             {props.children}
//         </TeacherContext.Provider>
//     );
// };

// export default TeacherState;