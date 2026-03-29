import { createContext } from 'react'

import type { AuthContextType, ResumeState } from './types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const localStorageKey = 'job-tracker-local-data'

export const initialResume: ResumeState = {
  coverLetter: {
    body: '',
    companyName: '',
    greeting: '',
    position: '',
  },
  certifications: [],
  education: [],
  experience: [],
  id: '',
  summary: '',
  skills: [],
  lastUpdate: '',
}

export const emptyState = structuredClone(initialResume)
