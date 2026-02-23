import { type Action } from '@/components/providers/auth-provider'
import { type Job, type Task } from '@/global/types'

export type EditJobsProps = {
  dispatch: (action: Action) => void
  email: string
  jobs: Job[]
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditJob: (value: React.SetStateAction<Job>) => void
}

export type EditTasksProps = {
  action: 'add' | 'edit' | 'delete'
  dispatch: (action: Action) => void
  email: string
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditTask: (value: React.SetStateAction<Task>) => void
  tasks: Task[]
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
    linkToJobAccount: '',
    linkToJobPosting: '',
    phone: '',
    position: '',
    jobType: 'remote',
    salaryRange: '',
  })
}

export const setTasks = async ({ action, dispatch, email, tasks, postData, setEditTask } : EditTasksProps) => {
  dispatch({ type: 'SET_TASKS', tasks: tasks.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) })
  await postData('PUT', { email, tasks, form: 'update-tasks' })
  if (action === 'delete' || action === 'add') {
    setEditTask({
      id: '',
      createdDate: '',
      description: '',
      events: [
        {
          dueDate: '',
          note: '',
        }
      ],
      status: 'to-do'
    })
  }
}