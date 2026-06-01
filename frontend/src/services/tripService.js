import { authFetch } from "./api";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Fetch all trips for the list view.
 * @returns {Promise<Array>} array of trip objects
 */
export async function getTrips() {
  try {
    const res = await authFetch(`${apiUrl}/trips`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch trips");
    }
    return res.json();
  } catch (error) {
    console.error("[HomeFlow] getTrips error:", error);
    throw error;
  }
}

/**
 * Fetch a single trip with its full expense list.
 * @param {string} id — trip UUID
 * @returns {Promise<Object>} trip object with `expenses` array
 */
export async function getTripById(id) {
  try {
    const res = await authFetch(`${apiUrl}/trips/${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch trip");
    }
    return res.json();
  } catch (error) {
    console.error("[HomeFlow] getTripById error:", error);
    throw error;
  }
}
