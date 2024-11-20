// Sélectionne le formulaire de connexion et le conteneur d'erreur
const form = document.getElementById("login-form");
const errorMessageElement = document.getElementById("error-message");
const loginButton = form.querySelector("button[type='submit']");

// Fonction d'affichage du message d'erreur
function addErrorMessage(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
}

// Fonction pour masquer le message d'erreur
function clearErrorMessage() {
  errorMessageElement.textContent = "";
  errorMessageElement.style.display = "none";
}

// Fonction de connexion
async function handleLogin(event) {
  event.preventDefault(); // Empêche l'envoi par défaut du formulaire
  clearErrorMessage(); // Réinitialise le message d'erreur
  loginButton.disabled = true; // Désactive le bouton de connexion pour éviter les clics multiples

  // Récupère les valeurs de l'email et du mot de passe
  const email = form.email.value.trim();
  const password = form.pass.value.trim();

  if (!email || !password) {
    addErrorMessage("Veuillez remplir tous les champs.");
    loginButton.disabled = false;
    return;
  }

  const loginData = { email, password };

  try {
    // Envoie la requête POST pour la connexion
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();
      // Stocke le token et l'état de connexion dans le localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("isLoggedIn", "true");

      // Redirection vers la page d'accueil
      window.location.href = "index.html";
    } else {
      // Gestion des erreurs de la réponse
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.message || "Erreur de mail ou de mot de passe.";
      addErrorMessage(errorMessage);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    addErrorMessage("Une erreur réseau est survenue. Veuillez réessayer.");
  } finally {
    loginButton.disabled = false; // Réactive le bouton de connexion
  }
}

// Écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", handleLogin);
