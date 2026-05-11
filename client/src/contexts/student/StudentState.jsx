import React, { useState, useEffect } from "react";
import StudentContext from "./StudentContext";
import { getStudentDataAPI } from "../../services/studentService";

const StudentState = (props) => {

    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    return (
        <StudentContext.Provider value={{ studentData, loading, error}}>
            {props.children}
        </StudentContext.Provider>
    );
};

export default StudentState;
