async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    if (token) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    }
    const res = await fetch(url, options);

    if (res.status === 401) {
        localStorage.removeItem("token");
        console.log("Unauthorized, redirecting to login")
        window.location.href = "/auth";
        return;
    }

    return res;

}
export { authFetch } 