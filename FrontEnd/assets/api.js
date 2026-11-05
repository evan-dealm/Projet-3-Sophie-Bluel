// Point d'entrée commun vers le backend local.
const apiUrl = "http://localhost:5678/api";
const tokenKey = "sophie-token";

function getToken() {
    const token = sessionStorage.getItem(tokenKey);
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp * 1000 > Date.now()) return token;
    } catch { /* Un jeton invalide est traité comme une session expirée. */ }
    sessionStorage.removeItem(tokenKey);
    return null;
}

function logout() {
    sessionStorage.removeItem(tokenKey);
    window.location.assign("./index.html");
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${apiUrl}${path}`, options);
    if (!response.ok) {
        const error = new Error("La requête a échoué.");
        error.status = response.status;
        throw error;
    }
    return response.status === 204 ? null : response.json();
}
