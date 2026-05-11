import React, { useState, useEffect } from "react";
import TeacherContext from "./TeacherContext";

const TeacherState = (props) => {

    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState(null);
    const getTeacherData = (data) => {
        // setLoading(true);
        // setError(null);
        try {
            setTeacherData(data);
            console.log("added data");
            // ---- END DUMMY DATA ----

        } catch (err) {
            setError("Failed to load teacher data. Please try again.");
            console.error("Teacher API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const setAllStudents = (data)=>{
        setStudents(data);
        console.log("added data for teacher");
    }

    // useEffect(() => {
    //     getTeacherData();
    // }, []);

    return (
        <TeacherContext.Provider value={{ teacherData, loading, error, getTeacherData, setAllStudents, students }}>
            {props.children}
        </TeacherContext.Provider>
    );
};

export default TeacherState;