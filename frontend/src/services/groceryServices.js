import { authFetch } from "./api";
const apiUrl = import.meta.env.VITE_API_URL;
async function getGroceryPurchases(){

    const res=await authFetch(`${apiUrl}/grocery-purchases`)
    if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "Login failed")
    }
    const data= res.json()

    return data
}

async function addGroceryPurchase(item){
    
    const res=await authFetch(`${apiUrl}/grocery-purchases`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(item)

    })


}
async function editGroceryPurchase(){


}
async function removeGroceryPurchase(){

}
export {getGroceryPurchases,addGroceryPurchase,removeGroceryPurchase,editGroceryPurchase}