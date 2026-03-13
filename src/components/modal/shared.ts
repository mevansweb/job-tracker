import type { Job, Note, Settings, Task } from '@/global/types'
import { type Action } from '@/components/providers/auth-provider'

export type EditJobsProps = {
  dispatch: (action: Action) => void
  email: string
  jobs: Job[]
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditJob: (value: React.SetStateAction<Job>) => void
}

export type EditNotesProps = {
  action: 'add' | 'edit' | 'delete'
  dispatch: (action: Action) => void
  email: string
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditNote: (value: React.SetStateAction<Note>) => void
  notes: Note[]
} 

export type EditTasksProps = {
  action: 'add' | 'edit' | 'delete'
  dispatch: (action: Action) => void
  email: string
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditTask?: (value: React.SetStateAction<Task>) => void
  tasks: Task[]
}

export type EditSettingsProps = {
  action: 'add' | 'edit' | 'delete'
  dispatch: (action: Action) => void
  email: string
  postData: (method: "POST" | "GET" | "PUT" | "DELETE", body: unknown) => Promise<void>
  setEditSettings: (value: React.SetStateAction<unknown>) => void
  settings: Settings
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

export const setNotes = async ({ action, dispatch, email, notes, postData, setEditNote } : EditNotesProps) => {
  dispatch({ type: 'SET_NOTES', notes })
  await postData('PUT', { email, notes, form: 'update-notes' })
  if (action === 'delete' || action === 'add') {
    setEditNote({
      id: '',
      description: '',
      problem: '',
      solution: '',
      source: '',
      steps: [],
      title: '',
    })
  }
}

export const setTasks = async ({ action, dispatch, email, tasks, postData, setEditTask } : EditTasksProps) => {
  dispatch({ type: 'SET_TASKS', tasks: tasks.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) })
  await postData('PUT', { email, tasks, form: 'update-tasks' })
  if ((action === 'delete' || action === 'add') && setEditTask) {
    setEditTask({
      id: '',
      createdDate: '',
      description: '',
      events: [
        {
          dueDate: '',
          note: '',
          id: '',
          done: false
        }
      ],
      status: 'to-do'
    })
  }
}

export const setSettings = async ({ action, dispatch, email, settings, postData, setEditSettings } : EditSettingsProps) => {
  dispatch({ type: 'SET_SETTINGS', settings })
  await postData('PUT', { email, settings, form: 'update-settings' })
  if (action === 'delete' || action === 'add') {
    setEditSettings({
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