/*

This copies the axios api but adds the necessary prefix paths and authorization
headers, as well as queues api requests to decrease chance of race conditions.

### USAGE

const Component = () => {
  const api = useAPI()

  await api.patch("tree?tree_id=someid", {
    tree_name: "New Tree Name"
  })
}

*/

import axios from "axios"

import React, { createContext, useState, useContext, useMemo } from "react"
import { useLocalStorage } from "react-use"

const APIContext = createContext({
  onRequest: () => {
    console.error("No API Provider")
    return new Promise()
  }
})

export const APIProvider = ({ children }) => {
  let [accountId, changeAccountId] = useLocalStorage("account_id", "")
  let [apiKey, changeAPIKey] = useLocalStorage("api_key", "")

  // TODO serialize requests
  const onRequest = (...args) => {
    if (args[0] === "get") {
      if (!args[2]) args[2] = {}
      args[2] = { ...args[2], headers: { ...args[2].headers, apikey: apiKey } }
    } else {
      if (!args[2]) args[2] = {}
      if (!args[3]) args[3] = {}
      args[3] = { ...args[3], headers: { ...args[3].headers, apikey: apiKey } }
    }
    return axios[args[0]](
      args[1].startsWith("/") ? args[1] : `/api/db/${args[1]}`,
      ...args.slice(2)
    )
  }
  const wait = () => Promise.resolve()
  const authenticate = (newAccountId, newAPIKey) => {
    changeAPIKey(newAPIKey)
    changeAccountId(newAccountId)
  }
  const unauthenticate = () => {
    changeAPIKey("")
    changeAccountId("")
  }

  const v = useMemo(
    () => ({ onRequest, accountId, wait, authenticate, unauthenticate }),
    [accountId]
  )

  return <APIContext.Provider value={v}>{children}</APIContext.Provider>
}

export default () => {
  const apiContext = useContext(APIContext)

  return useMemo(
    () => ({
      authenticate: apiContext.authenticate,
      unauthenticate: apiContext.unauthenticate,
      wait: () => apiContext.wait,
      get: (...args) => apiContext.onRequest("get", ...args),
      patch: (...args) => apiContext.onRequest("patch", ...args),
      post: (...args) => apiContext.onRequest("post", ...args),
      isLoggedIn: Boolean(apiContext.accountId), // TODO token
      accountId: apiContext.accountId
    }),
    [apiContext]
  )
}
