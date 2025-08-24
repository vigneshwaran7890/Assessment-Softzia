import apiClient from "../services/axios";

const BASE_URL = "/api/books";

export async function addBook(payload) {
  try {
    const response = await apiClient.post(`${BASE_URL}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // Re-throw to handle in the component
  }
}

export async function getBooks() {
  try {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getBooksById(id) {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getUserBooks() {
  try {
    const response = await apiClient.get(`${BASE_URL}/user/books`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function updateBook(id, payload) {
  try {
    const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

export async function deleteBook(id) {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}