import React, { useState } from "react";
import TeacherContext from "./TeacherContext";

const TeacherState = (props) => {
    // Teacher ka data hold karne ke liye state
    const [teacherData, setTeacherData] = useState(null);

    // Backend se teacher data lane ka function
    const getTeacherData = async () => {
        console.log("Calling Teacher Backend API...");
        // Yahan future mein fetch() call aayega
    };

    return (
        <TeacherContext.Provider value={{ teacherData, setTeacherData, getTeacherData }}>
            {props.children}
        </TeacherContext.Provider>
    );
};

export default TeacherState;