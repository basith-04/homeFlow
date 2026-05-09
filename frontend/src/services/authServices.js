const apiUrl = import.meta.env.VITE_API_URL;
async function loginUser(user) {
    try {
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "Login failed")
        }
        const data = await res.json()
        localStorage.setItem("token", data.token)
    } catch (err) {
        console.error(err)
    }

}

async function registerUser(user) {
    try {
        const res = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
            , body: JSON.stringify(user)
        })
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "Login failed")
        }
        console.log("user registered")
    } catch (err) {
        console.error(err)
    }
}
export { loginUser,registerUser }
