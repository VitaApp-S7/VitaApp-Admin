import axios from "axios"
import { protectedResources } from "../authConfig"

const url = protectedResources.apiChallenge.endpoint

export async function getAllChallenges(token) {
    var response = await axios.get(`${url}challenge/all`, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
}

export async function createChallenge(data, token) {
    var response = await axios.post(
        `${url}challenge/`,
        {
            title: data.title,
            description: data.description,
            moodboosterIds: data.moodboosterIds,
            startDate: data.startDate,
            endDate: data.endDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export async function updateChallenge(event, token) {
    var response = await axios.put(`${url}challenge/`, {
        id: event.id,
        title: data.title,
        description: data.description,
        moodboosterIds: data.moodboosterIds,
        startDate: data.startDate,
        endDate: data.endDate

    }, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
}

export async function deleteChallenge(id, token) {
    var response = await axios.delete(`${url}challenge/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return response
}
//delete
//challenge/{id}