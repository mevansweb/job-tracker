import { type ReactNode } from 'react'

import type { Action, State as AuthState, State } from '@/components/providers/auth-provider'
import type { ResumeAction } from '@/components/providers/resume-provider'
import type { ApiResult, Certification, Education, Employer, Resume, Skill } from '@/global/types'

export interface ResumeContextType {
  authState: AuthState
  dispatch: React.ActionDispatch<[action: ResumeAction]>
  dispatchAuth: React.ActionDispatch<[action: Action]>
  postData: (method: 'POST' | 'GET' | 'PUT' | 'DELETE', body: unknown) => Promise<void>
  state: ResumeState
}

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
