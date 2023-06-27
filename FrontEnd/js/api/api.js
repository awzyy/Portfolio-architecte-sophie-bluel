export async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return response.json();
}
 
export async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}
  