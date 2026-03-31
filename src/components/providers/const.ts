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
  certification: {
    date: '',
    id: '',
    name: '',
  },
  college: {
    id: '',
    institutionName: '',
    degree: '',
    gpa: '',
    dateFrom: '',
    dateTo: '',
  },
  certifications: [],
  education: [],
  employer: {
    company: '',
    dateFrom: '',
    dateTo: '',
    description: '',
    id: '',
    location: '',
    position: '',
  },
  experience: [],
  id: '',
  summary: '',
  skill: {
    id: '',
    name: '',
  },
  skills: [],
  lastUpdate: '',
}

export const emptyState = structuredClone(initialResume)
