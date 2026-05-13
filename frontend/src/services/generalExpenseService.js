import { authFetch } from "./api";
const apiUrl = import.meta.env.VITE_API_URL;
async function getGeneralExpenses() {

    const res = await authFetch(`${apiUrl}/general-expenses`)
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Login failed")
    }
    const data = res.json()

    return data
}

async function addGeneralExpense(item) {
    
    const res = await authFetch(`${apiUrl}/general-expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ category_id: item.category, description: item.description, amount: item.amount,date: item.generalDate })

    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error ||  "failed")
        return false
    }
    return true


}
async function editGeneralExpense() {


}
async function removeGeneralExpense(expenseId) {
    try {
        const res = await authFetch(`${apiUrl}/general-expenses/${expenseId}`, {
            method: "DELETE"
        })
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "failed")
        }
        return true
    } catch (error) {
        console.error("Error deleting grocery purchase:", error)
        return false
    }

}
async function getExpenseCategories() {

    const res = await authFetch(`${apiUrl}/general-expenses/categories`)
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Login failed")
    }
    const data = res.json()

    return data
}
export { getGeneralExpenses, addGeneralExpense, removeGeneralExpense, editGeneralExpense, getExpenseCategories }