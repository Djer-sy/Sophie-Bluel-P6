const gallery = document.getElementsByClassName("gallery")[0];
const categoriesContainer = document.getElementById("categories"); // Conteneur pour les boutons de catégories

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

// Fonction pour afficher les travaux dans la galerie, avec un filtre de catégorie
async function displayWorks(categoryId = null) {
  const works = await getWorks(); // Récupère tous les travaux depuis l'API
  gallery.innerHTML = ""; // Vide la galerie avant d'afficher les nouveaux éléments

  works.forEach((work) => {
    // Si une catégorie est spécifiée, ne montre que les travaux de cette catégorie
    if (categoryId === null || work.categoryId === categoryId) {
      addWorkToGallery(work); // Ajoute le travail à la galerie
    }
  });
}

// Fonction pour afficher les boutons de catégories
async function displayCategories() {
  const categories = await getCategories();

  // Créer un bouton "Tous" pour afficher tous les travaux
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => displayWorks()); // Affiche tous les travaux
  categoriesContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => displayWorks(category.id)); // Filtre les travaux par catégorie
    categoriesContainer.appendChild(button);
  });
}

// Appel des fonctions d'affichage au chargement de la page
displayCategories();
displayWorks();
