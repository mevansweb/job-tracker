import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { newJob } from '../../global/template'
import type { Job } from '../../global/types'
import { localStorageKey } from '../providers/const'
import { useAuth } from '../providers/hooks'
import { setJobs } from './shared'

type Props = {
  job?: Job
}

export function JobsModal({ job } : Props){
  const { dispatch, existing, postData, state } = useAuth()
  const jobs = useMemo(() => state.jobs ?? [], [state])
  const [editJob, setEditJob ] = useState<Job>(job ? job : newJob)
  const { address, applicationDate, contactPerson, company, jobType, linkToJobAccount, linkToJobPosting, phone, position, salaryRange } = editJob
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(applicationDate ? new Date(applicationDate) : undefined)

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEditJob((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const handleDelete = useCallback(async () => {
    const jobsCopy = jobs.filter((j) => j.id !== editJob.id)
    await setJobs({ dispatch, email: state.email, jobs: jobsCopy, postData, setEditJob })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, jobs: jobsCopy || []}))
  }, [dispatch, editJob.id, existing, jobs, postData, state.email])

  const handleSave = useCallback(async () => {
    let jobsCopy = jobs
    if (job) {
      const pos = jobs.map((e) => e.id).indexOf(job.id)
      jobsCopy = jobs.filter((j) => j.id !== editJob.id)
      jobsCopy.splice(pos, 0, editJob)
    } else {
      jobsCopy.push({ ...editJob, applicationDate: `${!editJob.applicationDate && date ? date.toLocaleDateString() : editJob.applicationDate}`, id:crypto.randomUUID()})
    }
    await setJobs({ dispatch, email: state.email, jobs: jobsCopy, postData, setEditJob })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, jobs: jobsCopy || []}))
  }, [date, dispatch, editJob, existing, job, jobs, postData, state.email])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className={`${job ? 'justify-start px-2 ml-2' : 'mx-4'} cursor-pointer`} variant="outline">{job ? 'Edit Job Info' : 'Add New Job +'}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{job ? 'Edit Job Info' : 'Add New Job'}</DialogTitle>
            <DialogDescription>
              {job ? 'Edit information for' : 'Add information about'} the job you applied to. <br />Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input onChange={update} name="company" placeholder="Company Name" defaultValue={company} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="address" placeholder="Company Address" defaultValue={address} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="phone" placeholder="Company Phone Number" defaultValue={phone} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="position" placeholder="Position" defaultValue={position} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="salaryRange" placeholder="Salary Range" defaultValue={salaryRange} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="contactPerson" placeholder="Contact Person (e.g. recruiter)" defaultValue={contactPerson}/>
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="linkToJobPosting" placeholder="Link to Job Posting (e.g. linkedin.com, indeed.com)" defaultValue={linkToJobPosting} />
            </div>
            <div className="grid gap-3">
              <Input onChange={update} name="linkToJobAccount" placeholder="Link to Job Account (e.g. workday.com, greenhouse.io)" defaultValue={linkToJobAccount} />
            </div>
            <div className="flex justify-between">
              <Select name="jobType" defaultValue={jobType} onValueChange={(val) => {
                setEditJob((prevData) => ({
                  ...prevData,
                  jobType: val,
                }))
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Job type</SelectLabel>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid-1">Hybrid (1-2 days/wk)</SelectItem>
                    <SelectItem value="hybrid-2">Hybrid (3-4 days/wk)</SelectItem>
                    <SelectItem value="in-person">In Person 5 days/wk</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-[180px] flex text-muted-foreground font-normal justify-between"
                  >
                    {date ? date.toLocaleDateString() : "Application date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    defaultMonth={date || new Date()}
                    onSelect={(d) => {
                      if (d) {
                        setEditJob((prevData) => ({
                          ...prevData,
                          applicationDate: d.toLocaleDateString('en-US'),
                        }))
                        setDate(d)
                        setOpen(false)
                      } 
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            {job ? (
              <DialogClose asChild>
                <Button variant="outline" onClick={handleDelete}>Delete</Button>
              </DialogClose>
            ): null}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
