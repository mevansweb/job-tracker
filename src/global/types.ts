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
  settings?: Settings
  tasks?: Task[]
}

export type Certification = {
  date: string
  id: string
  name: string
}

export type CoverLetter = {
  companyName: string
  body: string
  greeting: string
  position: string
}

export type Education = {
  dateFrom: string
  dateTo: string
  degree: string
  gpa: string
  id: string
  institutionName: string
}

export type Employer = {
  company: string
  dateFrom: string
  dateTo: string
  description: string
  id: string
  location: string
  position: string
}

export type Event = {
  date: string
  note: string
  status: Status
}

type FrontendFramework = 'react' | 'angular' | 'vue' | 'svelte' | 'ember' | 'backbone'
export const frontendFrameworks: FrontendFramework[] = [
  'react',
  'angular',
  'vue',
  'svelte',
  'ember',
  'backbone',
]

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
  notes?: string
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

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

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

type Pattern =
  | 'arrays'
  | 'binary-trees'
  | 'linked-lists'
  | 'sliding-window'
  | 'two-pointers'
  | 'fast-and-slow-pointers'
  | 'recursion'
  | 'sorting'
  | 'strings'
export const patterns: Pattern[] = [
  'arrays',
  'binary-trees',
  'linked-lists',
  'sliding-window',
  'two-pointers',
  'fast-and-slow-pointers',
  'recursion',
  'sorting',
  'strings',
]

export type PracticeQuestion = {
  id: number
  question: string
  exampleInput: string
  secondInput?: string
  shouldReturn: string
  solution: string
}

type ProgrammingLanguage =
  | 'javascript'
  | 'python'
  | 'java'
  | 'c++'
  | 'ruby'
  | 'typescript'
  | 'c#'
  | 'php'
export const programmingLanguages: ProgrammingLanguage[] = [
  'javascript',
  'python',
  'java',
  'c++',
  'ruby',
  'typescript',
  'c#',
  'php',
]

export type Framework = ProgrammingLanguage | FrontendFramework | Pattern

export type Resume = {
  coverLetter: CoverLetter
  certifications: Certification[]
  education: Education[]
  experience: Employer[]
  id: string
  summary: string
  skills: Skill[]
  lastUpdate: string
}

export type Settings = {
  font: string
  backgroundColor: string
  sidebarColor: string
  theme: string
}

export type Skill = {
  id: string
  name: string
}

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

export type Step = {
  stepNumber: number
  description: string
}

export type TaskEvent = {
  dueDate: string
  id: string
  note: string
  done: boolean
}

export type TaskStatus = 'to-do' | 'in-progress' | 'completed'

export type Task = {
  id: string
  createdDate: string
  description: string
  events: TaskEvent[]
  status: TaskStatus
}
