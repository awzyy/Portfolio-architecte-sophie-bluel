export function removeWorkOnGallery(workId) {
    const figures = document.querySelectorAll(`figure[data-work-id="${workId}"]`);
    if (figures) {
      figures.forEach(figure => {
        figure.remove();
      });
    }
}

// Adding New Work
const addWorkButton = document.getElementById('addWorkButton');
addWorkButton.addEventListener('click', openWorkModal);

export function openWorkModal() {
  const modal = document.querySelector('.workModal');
  if (modal) {
    modal.showModal();
  }
}