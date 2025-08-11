import React, { useReducer } from 'react'

import type { Job } from '@/global/types'
import useApi from '../../hooks/useApi'
import { AuthContext, localStorageKey } from './const'
import type { AuthProviderProps } from './types'

export type State = {
  email: string
  error: string
  jobs: Job[]
  loggedIn: boolean
  password: string
  view?: string
}

export type Action =
  | ({ type: 'SET_ALL_DATA'} & State)
  | ({ type: 'SET_EMAIL' } & Pick<State, 'email'>)
  | ({ type: 'SET_PASSWORD' } & Pick<State, 'password'>)
  | ({ type: 'SET_ERRORS' } & Pick<State, 'error'>)
  | ({ type: 'SET_LOGGED_IN' } & Pick<State, 'loggedIn'>)
  | ({ type: 'SET_VIEW' } & Pick<State, 'view'>)
  | ({ type: 'SET_JOBS' } & Pick<State, 'jobs'>)

const initialState: State = { 
  email: '', 
  error: '', 
  jobs: [], 
  loggedIn: false,  
  password: '', 
  view: 'sign-in'
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    // Only call this after login and setting local storage
    case 'SET_ALL_DATA':
      return {
        ...state,
        email: action.email,
        error: action.error,
        jobs: action.jobs,
        loggedIn: action.loggedIn,
        password: action.password,
        view: action.view
      }
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.email,
      }
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.password,
      }
    case 'SET_ERRORS':
      return {
        ...state,
        error: action.error
      }
    case 'SET_LOGGED_IN':
      return {
        ...state,
        loggedIn: action.loggedIn
      }
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.jobs
      }
    case 'SET_VIEW':
      return {
        ...state,
        view: action.view
      }
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const stored = localStorage.getItem(localStorageKey)
  const existing = stored ? JSON.parse(stored) : null
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data, loading, postData } = useApi('http://localhost:8080/api/data')

  const logout = async ( email: string ) => {
    await postData('POST', { email, form: 'log-out' })
    dispatch({ type: 'SET_LOGGED_IN', loggedIn: false })
    localStorage.removeItem(localStorageKey)
  }

  return (
    <AuthContext.Provider value={{ data, dispatch, existing, loading, postData, state, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


