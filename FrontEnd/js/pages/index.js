import { fetchWorks, fetchCategories} from '../api/api.js';
import { addWorkToModal} from '../utils/modal.js';

let allWorks = [];
const loginText = document.getElementById('login-text');
const userAuthenticated = typeof localStorage.getItem('token') === 'string';
const logout = document.getElementById('login-text');

function fetchAndGenerateWorks() {
  fetchWorks()
    .then(works => {
      allWorks = works;
      works.forEach(work => {
        addWorkToGallery(work);
        addWorkToModal(work);
      });
    });
}
fetchAndGenerateWorks();

function addWorkToGallery(work) {
  const gallery = document.getElementById('galleryContainer');
  const figure = document.createElement('figure');
  figure.setAttribute('data-work-id', work.id);
  const image = document.createElement('img');
  const figcaption = document.createElement('figcaption');
  figure.appendChild(image);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
  image.src = work.imageUrl;
  figcaption.textContent = work.title;
}

function updateGallery(works) {
  const gallery = document.getElementsByClassName('gallery')[0];
  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.setAttribute('data-work-id', work.id);
    const image = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    image.src = work.imageUrl;
    figcaption.textContent = work.title;
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(figcaption);
  });
}

// Filters
fetchCategories()
  .then(categories => {
    addCategoriesToFilters(categories);
    const filterAllClick = document.createElement('button');
    filterAllClick.textContent = 'Tous';
    filterAllClick.id = 'filterAllClick';
    filterAllClick.addEventListener('click', filterAll);
    filterContainer.prepend(filterAllClick);
  })
  .catch(error => {
    console.log('An error occurred', error);
  });

function addCategoriesToFilters(categories) {
  const filterContainer = document.getElementById('filterContainer');

  categories.forEach(category => {
    const filterButton = document.createElement('button');
    filterButton.textContent = category.name;
    filterButton.setAttribute('data-category-id', category.id);
    filterButton.addEventListener('click', () => {
      filterByCategory(category.id);
    });

    filterContainer.appendChild(filterButton);
  });
}

function filterByCategory(categoryId) {
  const filtered = allWorks.filter(work => work.categoryId == categoryId);
  updateGallery(filtered);
}

function filterAll() {
  updateGallery(allWorks);
}

// User Authentication
logout.addEventListener('click', () => {
  disconnect();
});

function disconnect() {
  localStorage.removeItem('token');
}

if (userAuthenticated) {
  loginText.innerText = 'logout';
  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach(element => {
    element.classList.remove('hidden');
  });
}

