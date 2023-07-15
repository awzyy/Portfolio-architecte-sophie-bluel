import { fetchCategories, fetchWorks } from "./api/api.js";

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

async function updateGalleryWithWorks() {
  await fetchWorks()
    .then(works => {
      allWorks = works;
      updateGallery(allWorks);
    })
}

function filterWorksByCategory(categoryName) {
  const categoryId = categories.find(category => category.name === categoryName).id;
  const filtered = allWorks.filter(work => work.categoryId === categoryId);
  updateGallery(filtered);
}

fetchCategories()
  .then(categoriesData => {
    categories = categoriesData;
    return updateGalleryWithWorks();
  })

filtersAll.addEventListener('click', () => updateGallery(allWorks));
filtersObjects.addEventListener('click', () => filterWorksByCategory('Objets'));
filtersAppartments.addEventListener('click', () => filterWorksByCategory('Appartements'));
filtersHotels.addEventListener('click', () => filterWorksByCategory('Hotels & restaurants'));


//login
const loginText = document.getElementById('login-text')

const isloggedIn = typeof localStorage.getItem('token') === 'string'

if (isloggedIn) {
    loginText.innerText = "logout"
    const hiddenElements = document.querySelectorAll('.hidden')
    hiddenElements.forEach(element => {
        element.classList.remove('hidden');
    });

}

function disconnect(){
  localStorage.removeItem("token");
}

const logout = document.getElementById("login-text")
logout.addEventListener('click', () => {
  disconnect()
});

//modal 

const modal = document.getElementById('modal')
const showModal = document.querySelectorAll('.show-modal')
const workModal = document.getElementById('workModal');
const galleryModal = document.querySelector('.gallery-modal')

showModal.forEach((button) => {
    button.addEventListener('click', () => {
        modal.showModal()
    })
})

//to close the modal 

const closeModalCross = document.querySelector(".close-modal")
const closeModalOutside = document.querySelectorAll('.modal');
const closeModalCrossWorkModal = document.querySelector(".close-work-modal");
const backToModalButton = document.getElementById('backToModalButton')


closeModalCross.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === workModal) {
        closeModal();
    }
});

workModal.addEventListener('click', (event) => {
    if (event.target === workModal) {
        closeModal();
    }
});

function closeModal() {
    modal.close();
    workModal.close();
}

closeModalCrossWorkModal.addEventListener('click', closeModal)

