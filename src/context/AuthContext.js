import React, { createContext, useState, useContext } from "react"
import PropTypes from "prop-types"
import { MsalContext } from "@azure/msal-react"


// import * as SecureStore from 'expo-secure-store';
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  AuthProvider.propTypes = { children: PropTypes.node.isRequired }
  const [ accessToken, setAccessToken ] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const { instance } = useContext(MsalContext)
    
    
  return (
    <AuthContext.Provider value={{ accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}
