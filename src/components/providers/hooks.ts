import { useContext } from 'react'

import { AuthContext, ResumeContext } from './const'
import type { AuthContextType, ResumeContextType } from './types'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within an ResumeProvider')
  }
  return context
}
