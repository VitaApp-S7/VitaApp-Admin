import React, { useState } from "react"
// import './scss/style.scss'
import { CButton } from "@coreui/react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../../src/authConfig"

export function ProfileContent() {
  const { instance, accounts } = useMsal()
  const [ accessToken, setAccessToken ] = useState(null)

  const name = accounts[0] && accounts[0].name

  function RequestAccessToken() {
    const request = {
      ...loginRequest,
      account: accounts[0]
    }

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        setAccessToken(response.accessToken)
      })
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          setAccessToken(response.accessToken)
        })
      })
  }

  return (
    <>
      <h5 className="card-title">Welcome {name}</h5>
      {accessToken ? (
        <p>Access Token Acquired!</p>
      ) : (
        <CButton color="primary" className="px-4" onClick={RequestAccessToken}>
          Request Access Token
        </CButton>
      )}
    </>
  )
}
