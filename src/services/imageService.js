import axios from "axios"
import { protectedResources } from "../authConfig"

const url = protectedResources.apiImage.endpoint

export async function uploadImage(data, token) {
  try {
    const response = await axios.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    // Handle the error here
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error to be caught by the caller if needed
  }
}

export async function deleteImageById(imageUrl, token) {
  const id = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
  var response = await axios.delete(url + id, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}