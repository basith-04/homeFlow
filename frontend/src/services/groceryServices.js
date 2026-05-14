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
        body: JSON.stringify({ item_id: item.itemId, quantity: item.quantity, amount: item.amount, unit: item.unit ,date:item.groceryDate})

    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error ||  "failed")
        return false
    }
    return true


}
async function editGroceryPurchase(purchaseId, item) {
    try {
        const res = await authFetch(`${apiUrl}/grocery-purchases/${purchaseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item_id: item.itemId,
                quantity: item.quantity,
                amount: item.amount,
                unit: item.unit,
                date: item.groceryDate,
            })
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Update failed");
        }
        return true;
    } catch (error) {
        console.error("Error updating grocery purchase:", error);
        return false;
    }
}
async function removeGroceryPurchase(itemId) {
    try {
        const res = await authFetch(`${apiUrl}/grocery-purchases/${itemId}`, {
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
export { getGroceryPurchases, addGroceryPurchase, removeGroceryPurchase, editGroceryPurchase }