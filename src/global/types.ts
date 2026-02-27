export type Account = {
  email: string
  error: string
  jobs?: Job[]
  loggedIn: boolean
  password: string
  view?: string
}

export type ApiResult = {
  email: string
  hashedPassword: string
  id?: string
  _id: string
  jobs?: Job[]
  notes?: Note[]
  salt: string
  tasks?: Task[]
}

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const Status = {
  BehavioralAssessment: 'behavioral-assessment',
  CCAT: 'ccat',
  CodingAssessment: 'coding-assessment',
  Ghosted: 'ghosted',
  HiringManagerScreen: 'hiring-manager-screening',
  PanelInterview: 'panel-interview',
  RecruiterEmailed: 'recruiter-emailed',
  RecruiterMessaged: 'recruiter-messaged',
  RecruiterScreen: 'recruiter-screening',
  Rejected: 'rejected',
  WaitingForNextSteps: 'waiting-for-next-steps',
  WaitingForResponse: 'waiting-for-response',
  ReceivedOffer: 'received-offer',
  AcceptedOffer: 'accepted-offer',
} as const

export type Status = (typeof Status)[keyof typeof Status]

export type Event = {
  date: string
  note: string
  status: Status
}

export type Job = {
  address: string
  applicationDate: string
  contactPerson?: string
  company: string
  events: Event[]
  id: string
  jobType: string
  linkToJobAccount: string
  linkToJobPosting: string
  phone: string
  position: string
  salaryRange: string
}

export type JobsData = {
  id: string
  username: string
  password: string
  email: string
  jobs: Job[]
}

export type TaskEvent = {
  dueDate: string
  note: string
}

export type TaskStatus = 'to-do' | 'in-progress' | 'completed'

export type Task = {
  id: string
  createdDate: string
  description: string
  events: TaskEvent[]
  status: TaskStatus
}

export type Step = {
  stepNumber: number
  description: string
}

type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'c++' | 'ruby' | 'typescript' | 'c#' | 'php'
export const programmingLanguages: ProgrammingLanguage[] = ['javascript', 'python', 'java', 'c++', 'ruby', 'typescript', 'c#', 'php']

type FrontendFramework = 'react' | 'angular' | 'vue' | 'svelte' | 'ember' | 'backbone'
export const frontendFrameworks: FrontendFramework[] = ['react', 'angular', 'vue', 'svelte', 'ember', 'backbone']

type Pattern = 'arrays' | 'binary-trees' | 'linked-lists' | 'sliding-window' | 'two-pointers' | 'fast-and-slow-pointers' | 'recursion' | 'sorting' | 'strings'
export const patterns: Pattern[] = ['arrays', 'binary-trees', 'linked-lists', 'sliding-window', 'two-pointers', 'fast-and-slow-pointers', 'recursion', 'sorting', 'strings']

export type Framework = ProgrammingLanguage | FrontendFramework | Pattern

export type Note = {
  id: string
  description: string
  expanded?: boolean
  frameworks?: Framework[]
  problem: string
  solution: string
  source: string
  steps: Step[]
  title: string
}