import apiClient from "../services/axios";

const BASE_URL = "/api/books";

export interface Book {
  _id: string;
  title: string;
  genre: string;
  price: number;
  description?: string;
  keywords?: string[];
  pdfUrl: string;
  coverImage: string;
  createdBy: string;
  status: 'Processing' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export interface AddBookPayload {
  title: string;
  genre: string;
  price: number;
  description?: string;
  keywords?: string;
  pdf: File;
  coverImage: File;
}

export async function addBook(payload: FormData): Promise<{ data: Book }> {
  try {
    const response = await apiClient.post<Book>(`${BASE_URL}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error adding book:", error);
    throw error;
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const response = await apiClient.get<Book[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getBookById(id: string): Promise<Book> {
  try {
    const response = await apiClient.get<Book>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
}

export async function getUserBooks(): Promise<Book[]> {
  try {
    const response = await apiClient.get<Book[]>(`${BASE_URL}/user/books`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user's books:", error);
    throw error;
  }
}

export async function updateBook(id: string, payload: Partial<AddBookPayload>): Promise<Book> {
  try {
    const response = await apiClient.put<Book>(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

export async function deleteBook(id: string): Promise<void> {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}
