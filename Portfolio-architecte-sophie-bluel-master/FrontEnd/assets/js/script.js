// Sélection des éléments de la page
const gallery = document.getElementsByClassName("gallery")[0];
const categoriesContainer = document.getElementById("categories");
const loginLink = document.getElementById("login-link");
const modal = document.getElementById("modal");
const elementsModal = document.getElementsByClassName("elementsModal")[0];
const modalContent = document.getElementsByClassName("modalContent")[0];
const closeModalBtn = document.getElementsByClassName("close")[0];
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
  icon.classList.add("fa-regular", "fa-pen-to-square");

  editProject.appendChild(button);
  button.appendChild(icon);

  button.addEventListener("click", () => {
    modal.style.display = "block";
  });
}

function displayModalContent() {
  const btnAddImg = document.getElementsByClassName("btnAddImg")[0];
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
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    img.title = work.title;

    // Ajouter un événement click pour afficher ou interagir avec l'image
    img.addEventListener("click", () => {
      alert(`Vous avez cliqué sur : ${work.title}`);
      // Ici, vous pouvez ajouter des fonctionnalités supplémentaires, comme sélectionner l'image ou afficher un aperçu plus grand
    });

    thumbnailGallery.appendChild(img);
  });
}

// Gestion de la fermeture de la modale
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
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

    if (response.ok) {
      alert("Projet ajouté avec succès !");
      modal.style.display = "none";
      displayWorks();
    } else {
      alert("Erreur lors de l'ajout du projet");
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
// Fonction pour ajouter un travail à la galerie
function addWorkToGallery(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Fonction pour supprimer un projet
async function deleteWork(workId) {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Projet supprimé avec succès !");
      // Mise à jour de la galerie
      displayWorks();
    } else {
      alert("Erreur lors de la suppression du projet");
    }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de la suppression");
  }
}
