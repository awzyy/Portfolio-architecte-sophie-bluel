export function fetchWorks() {
    return fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .catch(error => {
        console.log('An error occurred', error);
      });
  }
  
  export function fetchCategories() {
    return fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .catch(error => {
        console.log('An error occurred', error);
      });
  }
  
  export function deleteWork(id, accessToken) {
    return fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          return true;
        } else {
          console.error('Deletion failed');
          return false;
        }
      })
      .catch(error => {
        console.error('An error occurred', error);
        return false;
      });
  }
  
  export function createWork(image, title, category, accessToken) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', category);
  
    return fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    })
      .then(response => response.json())
      .catch(error => {
        console.error('An error occurred', error);
        return null;
      });
  }
  