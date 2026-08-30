import { authFetch } from "./api";
const apiUrl = import.meta.env.VITE_API_URL;

async function getFilterLogs() {
    const res = await authFetch(`${apiUrl}/filter-logs`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch filter logs");
    }
    return res.json();
}

async function addFilterLog(change_date) {
    const res = await authFetch(`${apiUrl}/filter-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change_date }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create filter log");
    }
    return true;
}

export { getFilterLogs, addFilterLog };
