const loginForm = document.querySelector("#login form");
const loginError = document.querySelector("#login-error");
const loginButton = loginForm.querySelector("button");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.hidden = true;
    loginButton.disabled = true;
    try {
        const result = await apiRequest("/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: loginForm.email.value.trim(),
                password: loginForm.password.value,
            }),
        });
        if (!result.token) throw new Error("Jeton manquant");
        sessionStorage.setItem(tokenKey, result.token);
        window.location.assign("./index.html");
    } catch (error) {
        loginError.textContent = [401, 404].includes(error.status)
            ? "E-mail ou mot de passe incorrect."
            : "Connexion impossible. Vérifiez que le serveur est démarré et réessayez.";
        loginError.hidden = false;
    } finally {
        loginButton.disabled = false;
    }
});
