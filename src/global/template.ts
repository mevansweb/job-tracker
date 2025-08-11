import { type Job } from './types'

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
    linkToJobPosting: '',
    phone: '',
    position: '',
    salaryRange: '',
  }