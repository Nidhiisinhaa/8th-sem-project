import React, { useState, useEffect } from "react";
import StudentContext from "./StudentContext";
import { getStudentDataAPI } from "../../services/studentService";

const StudentState = (props) => {

    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Yeh function backend se data laayega
    // Abhi dummy data hai, jab backend aayega sirf getStudentDataAPI() uncomment karna
    const getStudentData = async () => {
        setLoading(true);
        setError(null);
        try {
            // ---- BACKEND READY LINE (uncomment when backend is ready) ----
            // const data = await getStudentDataAPI();
            // setStudentData(data);

            // ---- DUMMY DATA (delete this block when backend is ready) ----
            const dummyData = {
                name: "Rahul Sharma",
                rollNo: "CS-2022-042",
                semester: "8th Semester",
                predictedGrade: "A-",
                riskScore: 23,
                riskLevel: "Low",
                gpa: 8.4,
                attendance: 87,
                semesterTrend: [
                    { sem: "Sem 1", gpa: 7.2 },
                    { sem: "Sem 2", gpa: 7.5 },
                    { sem: "Sem 3", gpa: 7.8 },
                    { sem: "Sem 4", gpa: 8.0 },
                    { sem: "Sem 5", gpa: 7.6 },
                    { sem: "Sem 6", gpa: 8.2 },
                    { sem: "Sem 7", gpa: 8.4 },
                    { sem: "Sem 8", gpa: 8.6 },
                ],
                subjectScores: [
                    { subject: "ML", score: 88 },
                    { subject: "DBMS", score: 75 },
                    { subject: "Networks", score: 82 },
                    { subject: "Web Dev", score: 92 },
                    { subject: "OS", score: 70 },
                ],
                radarData: [
                    { factor: "Attendance", value: 87 },
                    { factor: "Assignments", value: 92 },
                    { factor: "Quizzes", value: 78 },
                    { factor: "Mid-Term", value: 81 },
                    { factor: "Participation", value: 85 },
                    { factor: "Projects", value: 95 },
                ],
                recommendations: [
                    { icon: "📚", text: "Focus more on DBMS — spend 2 extra hours/week", priority: "high" },
                    { icon: "📝", text: "Try solving previous year papers for quizzes", priority: "medium" },
                    { icon: "⏰", text: "Maintain attendance above 85%", priority: "low" },
                    { icon: "💡", text: "Great project scores — consider open source", priority: "info" },
                ],
            };
            setStudentData(dummyData);
            // ---- END DUMMY DATA ----

        } catch (err) {
            setError("Failed to load student data. Please try again.");
            console.error("Student API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentData();
    }, []);

    return (
        <StudentContext.Provider value={{ studentData, loading, error, getStudentData }}>
            {props.children}
        </StudentContext.Provider>
    );
};

export default StudentState;

// import React, { useState, useEffect } from "react";
// import StudentContext from "./StudentContext";

// const StudentState = (props) => {
//     // Student ka data hold karne ke liye state
//     const [studentData, setStudentData] = useState(null);

//     // Backend se student data lane ka function
//     const getStudentData = async () => {
//         console.log("Calling Student Backend API...");
//         // Yahan future mein fetch() call aayega
//     };

//     const updateStudentFromStorage = () => {
//     const saved = localStorage.getItem('userData');
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       if (parsed.role === 'student') {
//         setStudentData({
//           name: parsed.name,
//           rollNo: 'CS-2022-042',
//           gpa: 8.12,
//           riskScore: 23
//         });
//       }
//     }
//   };

//     // Page refresh hone par data ko wapas desk par lane ke liye
//     useEffect(() => {
//         updateStudentFromStorage();
//     }, []);


//     return (
//         <StudentContext.Provider value={{ studentData, setStudentData, getStudentData }}>
//             {props.children}
//         </StudentContext.Provider>
//     );
// };

// export default StudentState;