const gallery = document.querySelector('.gallery');
const filtersAll = document.getElementById('filters-all');
const filtersObjects = document.getElementById('filters-objects');
const filtersAppartments = document.getElementById('filters-appartments');
const filtersHotels = document.getElementById('filters-hotels');

let allWorks = [];
let categories = [];

function updateGallery(works) {
  gallery.innerHTML = ""; 

  works.forEach(work => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    image.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return response.json();
}

async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  allWorks = works;
  updateGallery(allWorks);
}

function filterWorksByCategory(categoryName) {
  const categoryId = categories.find(category => category.name === categoryName).id;
  const filtered = allWorks.filter(work => work.categoryId === categoryId);
  updateGallery(filtered);
}

fetchCategories()
  .then(categoriesData => {
    categories = categoriesData;
    return fetchWorks();
  });

filtersAll.addEventListener('click', () => updateGallery(allWorks));
filtersObjects.addEventListener('click', () => filterWorksByCategory('Objets'));
filtersAppartments.addEventListener('click', () => filterWorksByCategory('Appartements'));
filtersHotels.addEventListener('click', () => filterWorksByCategory('Hotels & restaurants'));
