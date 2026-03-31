import { type ReactNode, createContext, useContext, useReducer } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { type Action, type State as AuthState } from '@/components/providers/auth-provider'
import { type ResumeState } from './types'
import { initialResume } from './const'

type ResumeAction = 
  | ({ type: 'SET_ALL_DATA' } & ResumeState)
  | ({ type: 'SET_CERTIFICATION' } & Pick<ResumeState, 'certification'>)
  | ({ type: 'SET_COLLEGE' } & Pick<ResumeState, 'college'>)
  | ({ type: 'SET_CERTIFICATIONS' } & Pick<ResumeState, 'certifications'>)
  | ({ type: 'SET_COVERLETTER' } & Pick<ResumeState, 'coverLetter'>)
  | ({ type: 'SET_EDUCATION' } & Pick<ResumeState, 'education'>)
  | ({ type: 'SET_EMPLOYER' } & Pick<ResumeState, 'employer'>)
  | ({ type: 'SET_EXPERIENCE' } & Pick<ResumeState, 'experience'>)
  | ({ type: 'SET_LASTUPDATE'} & Pick<ResumeState, 'lastUpdate'>)
  | ({ type: 'SET_SUMMARY' } & Pick<ResumeState, 'summary'>)
  | ({ type: 'SET_SKILL' } & Pick<ResumeState, 'skill'>)
  | ({ type: 'SET_SKILLS' } & Pick<ResumeState, 'skills'>)

interface ResumeContextType {
  authState: AuthState
  dispatch: React.ActionDispatch<[action: ResumeAction]>
  dispatchAuth: React.ActionDispatch<[action: Action]>
  postData: (method: 'POST' | 'GET' | 'PUT' | 'DELETE', body: unknown) => Promise<void>
  state: ResumeState
}
  
const reducer = (state: ResumeState, action: ResumeAction) => {
  switch (action.type) {
    case 'SET_ALL_DATA':
      return {
        ...state,
        coverLetter: action.coverLetter,
        certifications: action.certifications,
        education: action.education,
        experience: action.experience,
        id: action.id,
        lastUpdate: action.lastUpdate,
        summary: action.summary,
        skills: action.skills,
        // These are the working copies of items being added to the arrays above, so we need to reset them to empty on load
        certification: action.certification,
        college: action.college,
        employer: action.employer,
        skill: action.skill,
      }
    case 'SET_CERTIFICATION':
      return {
        ...state,
        certification: action.certification
      }
    case 'SET_COLLEGE':
      return {
        ...state,
        college: action.college
      }
    case 'SET_CERTIFICATIONS':
      return {
        ...state,
        certifications: action.certifications
      }
    case 'SET_COVERLETTER':
      return {
        ...state,
        coverLetter: action.coverLetter
      }
    case 'SET_EDUCATION':
      return {
        ...state,
        education: action.education
      }
    case 'SET_EMPLOYER':
      return {
        ...state,
        employer: action.employer
      }
    case 'SET_EXPERIENCE':
      return {
        ...state,
        experience: action.experience
      }
    case 'SET_LASTUPDATE':
      return {
        ...state,
        lastUpdate: action.lastUpdate
      }
    case 'SET_SKILL':
      return {
        ...state,
        skill: action.skill
      }
    case 'SET_SKILLS':
      return {
        ...state,
        skills: action.skills
      }
    case 'SET_SUMMARY':
      return {
        ...state,
        summary: action.summary,
      }
    default:
      return {
        ...state
      }
  }
}
  
const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within an ResumeProvider')
  }
  return context
}

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { state: authState, dispatch: dispatchAuth, postData } = useAuth()
  const { resume } = authState
  const resumeData = {
    ...resume,
    certification: initialResume.certification,
    college: initialResume.college,
    employer: initialResume.employer,
    skill: initialResume.skill,
  } as ResumeState
  const [state, dispatch] = useReducer(reducer, resume ? resumeData : initialResume)

  return (
    <ResumeContext.Provider value={{ authState, dispatch, dispatchAuth, postData, state }}>
      {children}
    </ResumeContext.Provider>
  )
}