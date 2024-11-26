// Sélection des éléments de la page
const gallery = document.getElementsByClassName("gallery")[0];
const categoriesContainer = document.getElementById("categories");
const loginLink = document.getElementById("login-link");
const modal = document.getElementById("modal");
const elementsModal = document.getElementsByClassName("elementsModal")[0];
const modalContent = document.getElementsByClassName("modalContent")[0];
const closeModalBtn = document.getElementsByClassName("close")[0];
const closeModalBtnTwo = document.getElementsByClassName("closeTwo")[0];
const uploadForm = document.getElementById("uploadForm");

// Fonction pour récupérer les travaux depuis l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Fonction pour ajouter un travail à la galerie
function addWorkToGallery(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  const deleteButton = document.createElement("button");

  img.src = work.imageUrl;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Fonction pour afficher les travaux dans la galerie avec filtre de catégorie
async function displayWorks(categoryId = null) {
  const works = await getWorks();
  gallery.innerHTML = ""; // Vide la galerie

  works.forEach((work) => {
    if (categoryId === null || work.categoryId === categoryId) {
      addWorkToGallery(work);
    }
  });
}

// Fonction pour afficher les boutons de catégories
async function displayCategories() {
  const categories = await getCategories();

  // Créer un bouton "Tous" pour afficher tous les travaux
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => displayWorks());
  categoriesContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => displayWorks(category.id));
    categoriesContainer.appendChild(button);
  });
}

// Initialisation de l'affichage
displayCategories();
displayWorks();

if (localStorage.token) {
  const editionBanner = document.getElementById("edition");
  const editionTexte = document.createElement("p");
  const editionIcon = document.createElement("i");
  editionTexte.textContent = "Mode édition";
  editionIcon.classList.add("fa-regular", "fa-pen-to-square");
  editionBanner.appendChild(editionIcon);
  editionBanner.appendChild(editionTexte);
}

// Gestion de la modale pour ajouter un projet
const editProject = document.getElementById("title");
if (localStorage.getItem("isLoggedIn") === "true") {
  const button = document.createElement("button");
  const icon = document.createElement("i");

  button.textContent = " modifier";
  button.classList.add("editButton");
  categories.style.display = "none";
  icon.classList.add("fa-regular", "fa-pen-to-square");

  editProject.appendChild(button);
  button.appendChild(icon);

  button.addEventListener("click", () => {
    modal.style.display = "block";
  });
}

function displayModalContent() {
  const btnAddImg = document.getElementsByClassName("btnAddImg")[0];
  const elementsModal = document.querySelector(".elementsModal");
  btnAddImg.addEventListener("click", () => {
    elementsModal.style.display = "none";
    modalContent.style.display = "flex";
  });
}
displayModalContent();

async function displayThumbnails() {
  const works = await getWorks(); // Récupère les projets depuis l'API
  const thumbnailGallery = document.getElementById("thumbnailGallery");
  thumbnailGallery.innerHTML = ""; // Vide les anciennes miniatures

  works.forEach((work) => {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("imgContainer");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    img.title = work.title;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteIcon.id = work.id;

    thumbnailGallery.appendChild(imgContainer);
    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteIcon);
  });

  deleteProject();
}
displayThumbnails();

function deleteProject() {
  const allDeleteIcons = document.querySelectorAll(".delete-icon");

  allDeleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const workId = icon.id; // Récupération de l'ID du travail
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.token,
        },
      };

      // Requête DELETE
      fetch("http://localhost:5678/api/works/" + workId, init)
        .then((response) => {
          if (!response.ok) {
            throw new Error("La suppression n'a pas été possible");
          }
          return response.json();
        })
        .then((data) => {
          alert("La suppression a bien été effectuée");
          console.log("Réponse de l'API :", data);
          displayThumbnails();
          displayWorks();
        })
        .catch((error) => {
          console.error("Erreur :", error.message);
          alert("Vous avez supprimé l'image.");
        });
    });
  });
}

// Appel de la fonction
deleteProject();

// Gestion de la fermeture de la modale
function closeModal() {
  modal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);
closeModalBtnTwo.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Gestion du formulaire d'ajout de projet
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const imageInput = document.getElementById("inputImage");
  const title = document.getElementById("projectTitle").value;
  const category = document.getElementById("category").value;

  if (imageInput.files.length === 0) {
    alert("Veuillez sélectionner une image");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Token expiré ou non valide. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        window.location.href = "login.html"; // rediriger vers la page de login
      } else {
        alert("Erreur lors de l'ajout du projet");
      }
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue");
  }
});

// Aperçu de l'image avant l'ajout
const imagePreview = document.getElementById("imagePreview");
const iconImage = document.getElementsByClassName("fa-image")[0];
const labelImage = document.getElementsByClassName("inputImage")[0];
const detailImage = document.getElementById("detailImage");
document.getElementById("inputImage").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "flex";
      iconImage.style.display = "none";
      labelImage.style.display = "none";
      detailImage.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// ************************ Gestion utilisateur connecté ************************

// Vérification de l'état de connexion
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    loginLink.textContent = "Logout";
    loginLink.href = "#";

    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      logoutUser();
    });
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
  }
}

// Fonction pour déconnecter l'utilisateur
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  alert("Vous avez été déconnecté !");
  window.location.href = "index.html";
}

// Initialisation du statut de connexion
checkLoginStatus();
// Button de retour
function showElementsModal() {
  elementsModal.style.display = "flex"; // Affiche elementsModal
  modalContent.style.display = "none"; // Cache modalContent
}

// Ajout de l'événement clic sur le bouton
if (backButton) {
  backButton.addEventListener("click", showElementsModal);
} else {
  console.warn("Bouton retour non trouvé");
}
