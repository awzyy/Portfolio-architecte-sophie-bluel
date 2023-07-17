export function fetchWorks(){
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
  