import { authFetch } from "./api";
const apiUrl = import.meta.env.VITE_API_URL;
async function getGroceryPurchases() {

    const res = await authFetch(`${apiUrl}/grocery-purchases`)
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Login failed")
    }
    const data = res.json()

    return data
}

async function addGroceryPurchase(item) {
    console.log(item)
    const res = await authFetch(`${apiUrl}/grocery-purchases`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ item_id: item.itemId, quantity: item.quantity, amount: item.amount, unit: item.unit })

    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error ||  "failed")
        return false
    }
    return true


}
async function editGroceryPurchase() {


}
async function removeGroceryPurchase() {

}
export { getGroceryPurchases, addGroceryPurchase, removeGroceryPurchase, editGroceryPurchase }