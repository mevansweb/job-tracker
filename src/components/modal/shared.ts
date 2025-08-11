import { type Action } from '@/components/providers/auth-provider'
import { type Job } from '@/global/types'

export type EditJobsProps = {
  dispatch: (action: Action) => void
  email: string
  jobs: Job[]
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditJob: (value: React.SetStateAction<Job>) => void
}

export const setJobs = async ({ dispatch, email, jobs, postData, setEditJob } : EditJobsProps) => {
  dispatch({ type: 'SET_JOBS', jobs: jobs.sort((a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()) })
  await postData('PUT', { email, jobs, form: 'update-jobs'})
  setEditJob({
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
    linkToJobPosting: '',
    phone: '',
    position: '',
    jobType: 'remote',
    salaryRange: '',
  })
}