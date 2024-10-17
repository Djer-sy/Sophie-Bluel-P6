// Sélectionne le formulaire de connexion et le conteneur d'erreur
const form = document.getElementById("login-form");
const errorMessageElement = document.getElementById("error-message");

async function login() {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche l'envoi par défaut du formulaire

    // Réinitialise le message d'erreur
    errorMessageElement.textContent = "";

    // Récupère les valeurs de l'email et du mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    // Prépare les données pour la requête
    const loginData = { email, password };

    // Envoie la requête POST pour la connexion
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Vérifie si la connexion est réussie
      if (response.ok) {
        const result = await response.json();
        console.log("Connexion réussie :", result);

        // Stocke le token dans le localStorage
        localStorage.setItem("token", result.token);
        alert("Connexion réussie !");
        // Redirection vers une autre page ou actualisation
        window.location.href = "index.html"; // Exemple de redirection
      } else {
        // Affiche le message d'erreur en cas de réponse négative
        errorMessageElement.textContent =
          "Échec de la connexion. Vérifiez vos identifiants.";
      }
    } catch (error) {
      // Affiche un message d'erreur en cas d'erreur réseau
      console.error("Erreur réseau ou serveur :", error);
      errorMessageElement.textContent =
        "Une erreur est survenue. Réessayez plus tard.";
    }
  });
}

// Initialise la fonction de connexion
login();
