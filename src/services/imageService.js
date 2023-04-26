import axios from "axios"
import { protectedResources } from "../authConfig"

const url = protectedResources.apiImage.endpoint

export async function startActivity(id, token) {
  var response = await axios.put(
    url + id,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data
}

export async function getAllActivities(token) {
  var response = await axios.get(`${url  }active`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}
export async function deleteActivityById(id, token) {
  var response = await axios.delete(url + id, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}
export async function updateActivity(activity, token) {
  if(activity.category == null){
    alert("Can't update without a category")
    throw new Error("Can't update without a category")
  }
  var response = await axios.put(`${url}update`, {
    category: activity.category,
    id: activity.id,
    description: activity.description,
    points: activity.points,
    status: "ACTIVE",
    title: activity.title
  }, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function createActivity(data, token) {
  if(data.category == null){
    alert("Can't update without a category")
    throw new Error("Can't update without a category")
  }
  var response = await axios.post(
    url,
    {
      category: data.category,
      description: data.description,
      points: data.points,
      status: "ACTIVE",
      title: data.title
    },
    { headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data
}

export async function getImageById(id, token) {
  var response = await axios.get(url + id, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function uploadImage(data, token) {
  var response = await axios.post(
    url,
    data,
    { headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data
}

export async function getActivitiesByCategory(id, token) {
  var response = await axios.get(`${url  }category/${  id}`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function getAllCategories(token) {
  console.log(`${url  }category/all`)
  var response = await axios.get(`${url  }category/all`, { headers: { Authorization: `Bearer ${token}` }}).catch(response => {
    console.log(`response ${  response}`)
  })
  return response.data
}

export async function getAllCompletedActivities(token) {
  var response = await axios.get(`${url  }completed`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function getAllActiveActivities(token) {
  var response = await axios.get(`${url  }accepted`, { headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export async function cancelActivity(id, token) {
  var response = await axios.put(
    `${url  }cancel/${  id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data
}
