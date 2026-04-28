import React, { useState, useEffect } from "react";
import StudentContext from "./StudentContext";

const StudentState = (props) => {
    // Student ka data hold karne ke liye state
    const [studentData, setStudentData] = useState(null);

    // Backend se student data lane ka function
    const getStudentData = async () => {
        console.log("Calling Student Backend API...");
        // Yahan future mein fetch() call aayega
    };


    return (
        <StudentContext.Provider value={{ studentData, setStudentData, getStudentData }}>
            {props.children}
        </StudentContext.Provider>
    );
};

export default StudentState;