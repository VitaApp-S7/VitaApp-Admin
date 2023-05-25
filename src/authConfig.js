// import { LogLevel } from "@azure/msal-browser"

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
// export const config = {
//     appId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863",
//     redirectUri: "https://localhost:3000",
//     scopes: [
//         'user.read'
//     ],
//     authority: 'https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68'
// };

// export const msalConfig = {
//     auth: {
//         clientId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863", // This is the ONLY mandatory field that you need to supply.
//         authority: "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68", // Defaults to "https://login.microsoftonline.com/common"
//         redirectUri: process.env.NODE_ENV === 'production' ? "https://vitaapp-admin-frontend.web.app/" : "https://localhost:3000", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
//         postLogoutRedirectUri: process.env.NODE_ENV === 'production' ? "https://vitaapp-admin-frontend.web.app/" : "https://localhost:3000", // Indicates the page to navigate after logout.
//         navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
//     },
//     cache: {
//         cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
//         storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
//     },
// };
// export const loginRequest = {
//     auth: {
//         clientId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863", // This is the ONLY mandatory field that you need to supply.
//         authority: "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68", // Defaults to "https://login.microsoftonline.com/common"
//         redirectUri: process.env.NODE_ENV === 'production' ? "https://vitaapp-admin-frontend.web.app/" : "https://localhost:3000", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
//         postLogoutRedirectUri: process.env.NODE_ENV === 'production' ? "https://vitaapp-admin-frontend.web.app/" : "https://localhost:3000", // Indicates the page to navigate after logout.
//         navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
//     },
//     scopes: ["api://82b5a9e1-eaa2-4ee8-a3a0-7d3c41a4a1b5/User.All"],
// };

export const msalConfig = {
  auth: {
    clientId: "50f18b4e-1a58-4004-b6b8-5a15e3a2e863", // This is the ONLY mandatory field that you need to supply.
    authority:
      "https://login.microsoftonline.com/913b1a98-9696-4db5-b548-9e17b6d3fc68", // Defaults to "https://login.microsoftonline.com/common"
    redirectUri:
      process.env.NODE_ENV === "production"
        ? "https://vitaappadmin.azurewebsites.net/"
        : "https://localhost:3000", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri:
      process.env.NODE_ENV === "production"
        ? "https://vitaappadmin.azurewebsites.net/"
        : "https://localhost:3000", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  }
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = { scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]}

// Add the endpoints here for Microsoft Graph API services you'd like to use.
// export const graphConfig = {
//     graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
// };

//const baseUrl = "http://localhost:5000"

//CLOUD
const baseUrl = "http://vitaappgw.northeurope.cloudapp.azure.com"

export const protectedResources = {
  graphMe: {
    endpoint: "https://graph.microsoft.com/v1.0/me",
    scopes: [ "User.Read" ]
  },
  apiActivity: {
    endpoint: `${baseUrl}/moodbooster/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ] // e.g. api://xxxxxx/access_as_user
  },
  apiUser: {
    endpoint: `${baseUrl}/user/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiBadge: {
    endpoint: `${baseUrl}/badge/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiChallenge: {
    endpoint: `${baseUrl}/challenge/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiNews: {
    endpoint: `${baseUrl}/feed/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiFriends: {
    endpoint: `${baseUrl}/user/friends/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiEvent: {
    endpoint: `${baseUrl}/event/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  },
  apiImage: {
    endpoint: `${baseUrl}/image/`,
    scopes: [ "api://215b09e4-54cb-49aa-837b-546f73fc29f6/User.All" ]
  }
}
