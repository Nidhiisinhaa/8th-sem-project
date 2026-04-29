const BASE_URL = "http://localhost:5000";

export const getTeacherDataAPI = async () => {
    const response = await fetch(`${BASE_URL}/api/teacher/data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch teacher data");
    }

    const data = await response.json();
    return data;
};