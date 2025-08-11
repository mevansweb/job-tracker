import { type ReactNode } from 'react'
import { type ApiResult } from '../../global/types'
import { type State, type Action } from '../providers/auth-provider'


export interface AuthContextType {
  data: ApiResult | null
  dispatch: React.ActionDispatch<[action: Action]>
  existing: ApiResult | null
  loading: boolean
  logout: ( email: string ) => void
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  state: State
}

export interface AuthProviderProps {
  children: ReactNode
}