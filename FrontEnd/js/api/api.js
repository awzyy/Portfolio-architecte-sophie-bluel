export async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return response.json();
}