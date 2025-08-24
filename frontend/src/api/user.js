import apiClient from "../services/axios";

const BASE_URL = "/api/auth";

export async function login(payload) {
  try {
    const response = await apiClient.post(`${BASE_URL}/login`, payload);
    console.log("response", response)
    return response;
  } catch (error) {
    console.error("Error in login function:", error);
    return { error };
  }
}
export async function updateUser(payload) {
  return apiClient
    .put(`${BASE_URL}/update-user`, payload)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}


export async function logout(payload) {
  return apiClient
    .get(`${BASE_URL}/logout`, payload)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}


export async function createUser(payload) {
  try {
    const response = await apiClient.post(`${BASE_URL}/signup`, payload);
    return { response: response };
  } catch (error) {
    return { error };
  }
}
export async function getUser(payload) {
  return apiClient
    .get(`${BASE_URL}/user`, payload)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}


export async function deleteUser(id) {
  return apiClient
    .delete(`${BASE_URL}/user-delete/${id}`)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
}
