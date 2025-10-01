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
  _id: string
  jobs?: Job[]
  salt: string
}



export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const Status = {
  BehavioralAssessment: 'behavioral-assessment',
  CCAT: 'ccat',
  CodingAssessment: 'coding-assessment',
  Ghosted: 'ghosted',
  HiringManagerScreen: 'hiring-manager-screening',
  PanelInterview: 'panel-interview',
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