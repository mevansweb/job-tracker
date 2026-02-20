import { type Job, type Task } from './types'

export const newJob: Job = {
    address: '',
    applicationDate: '',
    contactPerson: '',
    company: '',
    events: [
      {
        date: '',
        note: '',
        status: 'waiting-for-response'
      }
    ],
    id: '',
    jobType: 'remote',
    linkToJobAccount: '',
    linkToJobPosting: '',
    phone: '',
    position: '',
    salaryRange: '',
  }

  export const newTask: Task = {
    id: '',
    createdDate: '',
    description: '',
    events: [],
    status: 'to-do'
  }