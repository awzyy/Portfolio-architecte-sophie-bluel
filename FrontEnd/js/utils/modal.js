import { fetchWorks, fetchCategories, deleteWork, createWork } from '../api/api.js';
import { addWorkToGallery } from '../pages/index.js';

const addWorkButton = document.getElementById('addWorkButton');
const modal = document.getElementById('modal');
const workModal = document.getElementById('workModal');
const showModal = document.querySelectorAll('.show-modal');
const closeModalCross = document.querySelector('.close-modal');
const closeModalCrossWorkModal = document.querySelector('.close-work-modal');
const backToModalButton = document.getElementById('backToModalButton');
const categorySelectModal = document.getElementById('workCategory');
const uploadButtonLabel = document.getElementById('uploadButtonLabel');
const photoPreview = document.getElementById('photo-preview');
const fileInput = document.getElementById('uploadButton');

export function addWorkToModal(work) {
  const galleryModal = document.querySelector('.gallery-modal');
  const modalFigure = document.createElement('figure');
  modalFigure.setAttribute('data-work-id', work.id);
  const modalImage = document.createElement('img');
  modalImage.src = work.imageUrl;
  const modalFigcaption = document.createElement('figcaption');
  modalFigcaption.innerHTML = 'éditer';
  const deleteSpan = document.createElement('span');
  deleteSpan.classList.add('delete-icon');
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-solid', 'fa-trash-can');
  deleteSpan.appendChild(deleteIcon);
  modalFigure.appendChild(modalImage);
  modalFigure.appendChild(modalFigcaption);
  modalFigure.appendChild(deleteSpan);
  galleryModal.appendChild(modalFigure);
  deleteIcon.addEventListener('click', (event) => {
    event.preventDefault();
    deleteWork(work.id, localStorage.getItem('token')).then(deleted => {
      if (deleted) {
        removeWorkOnGallery(work.id);
        allWorks = allWorks.filter(w => w.id !== work.id);
      }
    });
  });
}

export function removeWorkOnGallery(workId) {
    const figures = document.querySelectorAll(`figure[data-work-id="${workId}"]`);
    if (figures) {
      figures.forEach(figure => {
        figure.remove();
      });
    }
}

// Adding New Work
addWorkButton.addEventListener('click', openWorkModal);

export function openWorkModal() {
  const modal = document.querySelector('.workModal');
  if (modal) {
    modal.showModal();
  }
}

// Modal
showModal.forEach(button => {
  button.addEventListener('click', () => {
    modal.showModal();
  });
});

// Closing Modal
closeModalCross.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal || event.target === workModal) {
    closeModal();
  }
});

workModal.addEventListener('click', event => {
  if (event.target === workModal) {
    closeModal();
  }
});

export function closeModal() {
  modal.close();
  workModal.close();
}

closeModalCrossWorkModal.addEventListener('click', closeModal);

// Back Arrow
backToModalButton.addEventListener('click', function () {
  workModal.close();
});

// Fetch Categories for Modal
export function fetchCategoriesModal() {
  fetchCategories()
    .then(categoriesData => {
      addCategoriesToSelect(categoriesData);
    })
    .catch(error => {
      console.log('An error occurred', error);
    });
}

// Add Categories to Select Dropdown in Modal
export function addCategoriesToSelect(categories) {
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelectModal.appendChild(option);
  });
}

fetchCategoriesModal();

// Modal Image Preview
let selectedImage = null;

export function addPhoto(event) {
  const photo = event.target.files[0];

  if (photo && photo.size > 4 * 1024 * 1024) {
    alert('La taille maximale est de 4 Mo');
    return;
  }

  if (photo) {
    selectedImage = photo;
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const previewImage = new Image();

      previewImage.onload = () => {
        const maxHeight = 169;
        const scaleFactor = maxHeight / previewImage.height;
        const width = previewImage.width * scaleFactor;
        const height = previewImage.height * scaleFactor;

        previewImage.width = width;
        previewImage.height = height;

        photoPreview.appendChild(previewImage);
      };
      previewImage.src = reader.result;
    });

    reader.readAsDataURL(photo);
    uploadButton.style.display = 'none';

    const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image');
    elementsHidden.forEach(element => {
      element.style.display = 'none';
    });
    uploadButtonLabel.style.display = 'none';
  }
}

fileInput.addEventListener('change', event => addPhoto(event));

// Conditions Check to Submit a New Work
export function setupFormValidation() {
  const photoInput = document.getElementById('uploadButton');
  const titleInput = document.getElementById('workTitle');
  const submitButtonModal = document.getElementById('submitButtonModal');

  submitButtonModal.disabled = true;

  titleInput.addEventListener('keyup', () => {
    if (titleInput.value.trim().length > 0 && photoInput.files.length > 0) {
      submitButtonModal.disabled = false;
      submitButtonModal.classList.add('submit-button-active');
    } else {
      submitButtonModal.disabled = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', setupFormValidation);

// Send a New Project to the Backend through the Modal Form
export function submitNewWork() {
  const titleInput = document.getElementById('workTitle');
  const categoryInput = document.getElementById('workCategory');
  const image = selectedImage;
  const title = titleInput.value.trim();
  const category = parseInt(categoryInput.value.trim());
  const accessToken = localStorage.getItem('token');

  createWork(image, title, category, accessToken)
    .then(newWork => {
      if (newWork) {
        addWorkToGallery(newWork);
        addWorkToModal(newWork);
        allWorks.push(newWork);
      }
    })
    .catch(error => {
      console.error('An error occurred', error);
    });
}

submitButtonModal.addEventListener('click', event => {
  event.preventDefault();
  submitNewWork();
  closeModal();
  form.reset();
  setupFormValidation();
  submitButtonModal.classList.remove('submit-button-active');
  document.getElementById('uploadButton').value = null;
  document.getElementById('photo-preview').removeChild(document.querySelector('#photo-preview img'));
  const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image');
  elementsHidden.forEach(element => {
    element.style.display = '';
  });
  uploadButtonLabel.style.display = '';
});
