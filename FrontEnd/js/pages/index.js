//Fetch works to API and generate works

// import { fetchWorks } from "../api/api.js";

function fetchWorks(){
    fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        works.forEach(work => {
            addWorkToGallery(work)
            addWorkToModal(work)
        });

    });
}
fetchWorks();

function addWorkToGallery(work) {
    const gallery = document.getElementById('galleryContainer')
    const figure = document.createElement('figure')
    figure.setAttribute('data-work-id', work.id)
    const image = document.createElement('img')
    const figcaption = document.createElement('figcaption')

    figure.appendChild(image)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)

    image.src = work.imageUrl
    figcaption.textContent = work.title
}

function addWorkToModal(work) {
    const galleryModal = document.querySelector('.gallery-modal')

    const modalFigure = document.createElement('figure')
    modalFigure.setAttribute('data-work-id', work.id)
    const modalImage = document.createElement('img')
    modalImage.src = work.imageUrl
    const modalFigcaption = document.createElement('figcaption')
    modalFigcaption.innerHTML = 'éditer'
    const deleteSpan = document.createElement('span')
    deleteSpan.classList.add('delete-icon');
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa-solid', 'fa-trash-can')
    deleteSpan.appendChild(deleteIcon)
    modalFigure.appendChild(modalImage)
    modalFigure.appendChild(modalFigcaption)
    modalFigure.appendChild(deleteSpan)
    galleryModal.appendChild(modalFigure)
    deleteIcon.addEventListener('click', (event) => {
        event.preventDefault()
        deleteWork(work.id)
    })
}


function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0]
    gallery.innerHTML = ''

    works.forEach(work => {
        const figure = document.createElement('figure')
        figure.setAttribute('data-work-id', work.id)
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        image.src = work.imageUrl;
        figcaption.textContent = work.title
        gallery.appendChild(figure)
        figure.appendChild(image)
        figure.appendChild(figcaption)
    });
}

//filters 
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        addCategoriesToFilters(categories);
        const filterAllClick = document.createElement('button')
        filterAllClick.textContent = 'Tous'
        filterAllClick.id = 'filterAllClick'
        filterAllClick.addEventListener('click', filterAll)
        filterContainer.prepend(filterAllClick)
    })
    .catch(error => {
        console.log('une erreur est survenue', error)
    });

function addCategoriesToFilters(categories) {
    const filterContainer = document.getElementById('filterContainer')

    categories.forEach(category => {
        const filterButton = document.createElement('button')
        filterButton.textContent = category.name 
        filterButton.setAttribute('data-category-id', category.id) 
        filterButton.addEventListener('click', () => {
            filterByCategory(category.id)
        });

        filterContainer.appendChild(filterButton)
    });
}

function filterByCategory(categoryId) {
    const filtered = allWorks.filter(work => work.categoryId == categoryId);
    updateGallery(filtered) 
}

function filterAll() {
    updateGallery(allWorks) 
}

//login
const loginText = document.getElementById('login-text')

const userAuthenticated = typeof localStorage.getItem('token') === 'string'

if (userAuthenticated) {
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
const workModal = document.getElementById('workModal');
const showModal = document.querySelectorAll('.show-modal')
const galleryModal = document.querySelector('.gallery-modal')


showModal.forEach((button) => {
    button.addEventListener('click', () => {
        modal.showModal()
    })
})

//closing modal 

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


//back arrow
backToModalButton.addEventListener('click', function () {
    workModal.close()
})

//deleting a work

function deleteWork(id) {
    const accessToken = localStorage.getItem('token')

    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (response.ok) {
                removeWorkOnGallery(id)
                allWorks = allWorks.filter(work => work.id !== id)
            }
            else {
                console.error('deletion failed')
            }
        })
        .catch(error => {
            console.error('une erreur est survenue', error)
        })

}

function removeWorkOnGallery(workId) {
    const figures = document.querySelectorAll(`figure[data-work-id="${workId}"]`)
    if (figures) {
        figures.forEach(figure => {
            figure.remove()
        })
    }
}


//Adding new work

const addWorkButton = document.getElementById('addWorkButton')
addWorkButton.addEventListener('click', openWorkModal)

function openWorkModal() {
    const modal = document.querySelector('.workModal')
    if (modal) {
        modal.showModal()
    }
}

// to fetch the categories by API

const categorySelectModal = document.getElementById('workCategory')

function fetchCategoriesModal() {
    const apiURL = 'http://localhost:5678/api/categories'

    fetch(apiURL)
        .then(response => response.json())
        .then(categoriesData => {
            addCategoriesToSelect(categoriesData)
        })
        .catch(error => {
            console.log('une erreur est survenue', error)
        })
}

// To add the categories to the dropdown list

function addCategoriesToSelect(categories) {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelectModal.appendChild(option);
    });
}

fetchCategoriesModal()

//modal image preview

const uploadButtonLabel = document.getElementById('uploadButtonLabel')
const photoPreview = document.getElementById('photo-preview')
let selectedImage = null


function addPhoto(event) {
    const photo = event.target.files[0]

    if (photo && photo.size > 4 * 1024 * 1024) {
        alert('la taille maximale est de 4 mo')
        return
    }

    if (photo) {
        selectedImage = photo
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const previewImage = new Image()

            previewImage.onload = () => {
                const maxHeight = 169

                const scaleFactor = maxHeight / previewImage.height;
                const width = previewImage.width * scaleFactor;
                const height = previewImage.height * scaleFactor;

                previewImage.width = width;
                previewImage.height = height;

                photoPreview.appendChild(previewImage)
            }
            previewImage.src = reader.result
        })

        reader.readAsDataURL(photo)
        uploadButton.style.display = 'none';

        const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image');
        elementsHidden.forEach((element) => {
            element.style.display = 'none';
        });
        uploadButtonLabel.style.display = 'none';

    }
}

const fileInput = document.getElementById('uploadButton')
fileInput.addEventListener('change', (event) => addPhoto(event))

//conditions check to submit a new work

function setupFormValidation() {
    const photoInput = document.getElementById('uploadButton')
    const titleInput = document.getElementById('workTitle')
    const submitButtonModal = document.getElementById('submitButtonModal')

    submitButtonModal.disabled = true

    titleInput.addEventListener('keyup', () => {
        if (titleInput.value.trim().length > 0 && photoInput.files.length > 0) {
            submitButtonModal.disabled = false
            submitButtonModal.classList.add('submit-button-active')
        } else {
            submitButtonModal.disabled = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', setupFormValidation);


//send a new project to the back-end by the modal form
function createWork() {
    const titleInput = document.getElementById('workTitle')
    const categoryInput = document.getElementById('workCategory')

    const image = selectedImage
    const title = titleInput.value.trim()
    const category = parseInt(categoryInput.value.trim())

    const formData = new FormData() 
    formData.append('image', image) 
    formData.append('title', title) 
    formData.append('category', category)


    const accessToken = localStorage.getItem('token')

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })
        .then(response => response.json())
        .then(newWork => {
            addWorkToGallery(newWork)
            addWorkToModal(newWork)
            allWorks.push(newWork)
        })
        .catch(error => {
            console.error('Une erreur est survenue', error)
        })

}


submitButtonModal.addEventListener('click', (event) => {
    event.preventDefault()
    createWork()
    closeModal()
    form.reset()
    setupFormValidation()
    submitButtonModal.classList.remove('submit-button-active')
    document.getElementById('uploadButton').value = null
    document.getElementById('photo-preview').removeChild(document.querySelector('#photo-preview img'))
    const elementsHidden = document.querySelectorAll('.modal p, .modal i.fa-image')
    elementsHidden.forEach((element) => {
        element.style.display = ''
    });
    uploadButtonLabel.style.display = ''
})