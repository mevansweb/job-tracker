import React, { useReducer } from 'react'

import type { Job, Note, Settings, Task } from '@/global/types'

import useApi from '../../hooks/useApi'
import type { AuthProviderProps } from './types'
import { AuthContext, localStorageKey } from './const'

export type State = {
  email: string
  error: string
  id: string
  jobs: Job[]
  loggedIn: boolean
  notes?: Note[]
  password: string
  settings?: Settings
  tasks: Task[]
  view?: string
}

export type Action =
  | ({ type: 'SET_ALL_DATA'} & State)
  | ({ type: 'SET_EMAIL' } & Pick<State, 'email'>)
  | ({ type: 'SET_ERRORS' } & Pick<State, 'error'>)
  | ({ type: 'SET_JOBS' } & Pick<State, 'jobs'>)
  | ({ type: 'SET_LOGGED_IN' } & Pick<State, 'loggedIn'>)
  | ({ type: 'SET_NOTES' } & Pick<State, 'notes'>)
  | ({ type: 'SET_PASSWORD' } & Pick<State, 'password'>)
  | ({ type: 'SET_SETTINGS' } & Pick<State, 'settings'>)
  | ({ type: 'SET_TASKS' } & Pick<State, 'tasks'>)
  | ({ type: 'SET_VIEW' } & Pick<State, 'view'>)
  

const initialState: State = { 
  email: '', 
  error: '',
  id: '',
  jobs: [], 
  loggedIn: false,  
  notes: [],
  password: '',
  settings: undefined,
  tasks: [],
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
        id: action.id,
        jobs: action.jobs,
        loggedIn: action.loggedIn,
        notes: action.notes,
        password: action.password,
        settings: action.settings,
        tasks: action.tasks,
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
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      }
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.settings
      }
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.tasks
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
  const { data, error, loading, postData } = useApi('http://localhost:8080/api/data')

  const logout = async ( email: string ) => {
    await postData('POST', { email, form: 'log-out' })
    dispatch({ type: 'SET_LOGGED_IN', loggedIn: false })
    localStorage.removeItem(localStorageKey)
  }

  return (
    <AuthContext.Provider value={{ data, dispatch, error, existing, loading, postData, state, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


