import { createContext } from 'react'
import { type AuthContextType } from './types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const localStorageKey = 'job-tracker-local-data'