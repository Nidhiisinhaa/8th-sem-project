const BASE_URL = "http://localhost:5000"; // change this to your backend URL later

// Jab backend ready ho, bas is function ka andar ka code change karna
export const getStudentDataAPI = async () => {
    const response = await fetch(`${BASE_URL}/api/student/data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token") // backend token
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch student data");
    }

    const data = await response.json();
    return data;
};