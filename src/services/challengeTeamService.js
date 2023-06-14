import axios from "axios"
import { protectedResources } from "../authConfig"

const url = protectedResources.apiChallenge.endpoint

export async function getChallengeTeams(id, token) {
  var response = await axios.get(`${url}team/challenge/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function createTeam(data, token) {
  var response = await axios.post(
    `${url}team/`,
    {
      name: data.name,
      challengeId: data.challengeId,
      reward: data.reward,
      participants: []
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function updateTeam(data, token) {
  var response = await axios.put(`${url}team/`, {
    id: data.id,
    name: data.name,
    challengeId: data.challengeId,
    reward: data.reward,
    participants: data.participants
  }, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

export async function deleteChallengeTeam(id, token) {
  console.log("delete teams")
  var response = await axios.delete(`${url}team/challenge/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
//delete team
//team/id