import { authFetch } from "./api";
const apiUrl= import.meta.env.VITE_API_URL

async function getItems(){
    try{
        const res=await authFetch(`${apiUrl}/items`)
        if(!res.ok){
            const errorData = await res.json()
            throw new Error(errorData.error || "Login failed")
        }
        const data=res.json()       

        return data
    }catch(err){
        console.log(err)
    }
}

async function addItem(item){
    try{
        const res=await authFetch(`${apiUrl}/item`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(item)
        })
    }catch(err){
        console.err(err)
    }
}
export{getItems}