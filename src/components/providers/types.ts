import { type ReactNode } from 'react'

import type { Action, State } from '@/components/providers//auth-provider'

import type { ApiResult, Certification, Education, Employer, Resume, Skill } from '@/global/types'

export type ResumeState = Resume & {
  college: Education
  employer: Employer
  skill: Skill
  certification: Certification
}

export interface AuthContextType {
  data: ApiResult | null
  dispatch: React.ActionDispatch<[action: Action]>
  error: string | null
  existing: ApiResult | null
  loading: boolean
  logout: (email: string) => void
  postData: (method: 'POST' | 'GET' | 'PUT' | 'DELETE', body: unknown) => Promise<void>
  state: State
}

export interface AuthProviderProps {
  children: ReactNode
}
