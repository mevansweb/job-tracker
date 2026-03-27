import { type ReactNode, createContext, useContext, useReducer } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { type Action, type State as AuthState } from '@/components/providers/auth-provider'
import { type Resume } from '@/global/types'

type State = Resume

type ResumeAction = 
  | ({ type: 'SET_ALL_DATA' } & State)
  | ({ type: 'SET_CERTIFICATIONS' } & Pick<State, 'certifications'>)
  | ({ type: 'SET_COVERLETTER' } & Pick<State, 'coverLetter'>)
  | ({ type: 'SET_EDUCATION' } & Pick<State, 'education'>)
  | ({ type: 'SET_EXPERIENCE' } & Pick<State, 'experience'>)
  | ({ type: 'SET_LASTUPDATE'} & Pick<State, 'lastUpdate'>)
  | ({ type: 'SET_SUMMARY' } & Pick<State, 'summary'>)
  | ({ type: 'SET_SKILLS' } & Pick<State, 'skills'>)

interface ResumeContextType {
  authState: AuthState
  dispatch: React.ActionDispatch<[action: ResumeAction]>
  dispatchAPI: React.ActionDispatch<[action: Action]>
  state: State
}

const initialResume: State = {
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

const reducer = (state: State, action: ResumeAction) => {
  switch (action.type) {
    case 'SET_ALL_DATA':
      return {
        ...state,
        coverLetter: action.coverLetter,
        certifications: action.certifications,
        education: action.education,
        experience: action.experience,
        id: action.id,
        summary: action.summary,
        skills: action.skills,
        lastUpdate: action.lastUpdate
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
  const { state: authState, dispatch: dispatchAPI } = useAuth()
  const { resume } = authState
  const [state, dispatch] = useReducer(reducer, resume ?? initialResume)

  return (
    <ResumeContext.Provider value={{ authState, dispatch, dispatchAPI, state }}>
      {children}
    </ResumeContext.Provider>
  )
}