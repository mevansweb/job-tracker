import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
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
import { capitalizeWords } from '@/global/functions'
import type { Event, Job, Status } from '../../global/types'
import { Status as Statuses } from '../../global/types'
import { localStorageKey } from '../providers/const'
import { useAuth } from '../providers/hooks'
import { setJobs } from './shared'

type Props = {
  job: Job
}

export function EventsModal({ job } : Props){
  const { dispatch, existing, postData, state } = useAuth()
  const jobs = useMemo(() => state.jobs ?? [], [state])
  const [newEvent, setNewEvent] = useState<Event>({
    date: '',
    note: '',
    status: 'waiting-for-response',
  })
  const [editJob, setEditJob ] = useState<Job>(job)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const { applicationDate, company, position } = editJob
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(applicationDate ? new Date(applicationDate) : undefined)


  const addEvent = useCallback(({ date, note, status } : Event) => {
    setEditJob((prevData) => ({
      ...prevData,
      events: [
        ...prevData.events,
        {
          date,
          note,
          status,
        },
      ],
    }))
  }, [])


  const handleSave = useCallback(async () => {
    let jobsCopy = jobs
    const pos = jobs.map((e) => e.id).indexOf(job.id)
    jobsCopy = jobs.filter((j) => j.id !== editJob.id)
    jobsCopy.splice(pos, 0, editJob)
    await setJobs({ dispatch, email: state.email, jobs: jobsCopy, postData, setEditJob })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, jobs: jobsCopy || []}))
  }, [dispatch, editJob, existing, job, jobs, postData, state.email])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="justify-start mr-2 px-2 cursor-pointer" variant="outline">Edit Events</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Events for {company} - {position} ({applicationDate})</DialogTitle>
            <DialogDescription>
              Add or delete events for the job you applied to. <br />Click save when you are done.
            </DialogDescription>
          </DialogHeader>
            {editJob.events.map((event, index) => (
              <>
                <div key={`event-${event.status}-${index}`} className="flex justify-between">
                  {event.date ? event.date : job.applicationDate}:&nbsp;&nbsp;{capitalizeWords(event.status.replace(/-/g, ' '))}
                  <X
                    className="cursor-pointer stroke-red-500"
                    aria-label="Click to Remove"
                    onClick={() => {
                      const updatedEvents = editJob.events.filter((_, i) => i !== index)
                      setEditJob({ ...editJob, events: updatedEvents })
                    } } />
                </div>
                {event.note ? <p className="text-center text-sm font-light italic">{event.note}</p> : null}
              </>
            ))}
            {!showAddEvent ? (
              <Button onClick={() => setShowAddEvent(true)} variant="outline">Add New Event</Button>
            ) : (
              <>
                <div className="flex flex-col gap-4 border-y-2 border-y-gray-200 py-4">
                  <div className="flex justify-between">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-[180px] flex text-muted-foreground font-normal justify-between"
                        >
                          {date ? date.toLocaleDateString() : "Event date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          defaultMonth={date || new Date()}
                          onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            setNewEvent((prev) => ({ ...prev, date: date ? date.toLocaleDateString('en-US') : '' }))
                          } } />
                      </PopoverContent>
                    </Popover>
                    <Select
                      onValueChange={(value) => setNewEvent((prev) => ({ ...prev, status: value as Status }))}
                      defaultValue={newEvent.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {Object.values(Statuses).map((s) => (
                            <SelectItem value={s}>{capitalizeWords(s.replace(/-/g, ' '))}</SelectItem>
                          ))}
                          {/* <SelectItem value="waiting-for-response">Waiting for Response</SelectItem>
                          <SelectItem value="recruiter-screening">Recruiter Screening</SelectItem>
                          <SelectItem value="hiring-manager-screening">Hiring Manager Screening</SelectItem>
                          <SelectItem value="panel-interview">Panel Interview</SelectItem>
                          <SelectItem value="coding-assessment">Coding Assessment</SelectItem>
                          <SelectItem value="waiting-for-next-steps">Waiting for Next Steps</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="ghosted">Ghosted</SelectItem> */}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Add a note about this event"
                    value={newEvent.note}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNewEvent((prev: Event) => ({ ...prev, note: event.target.value }))}
                    className="resize-none"
                  />
                  <div className="flex justify-between">
                    <Button onClick={() => setShowAddEvent(false)} variant="outline">Cancel</Button>
                    <Button
                      className={newEvent.status === 'waiting-for-response' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white hover:text-white'}
                      disabled={!newEvent.date && !newEvent.status}
                      onClick={() => {
                        addEvent(newEvent)
                        setNewEvent({
                          date: '',
                          note: '',
                          status: 'waiting-for-response',
                        })
                        setShowAddEvent(false)
                      } }
                      variant="outline"
                    >
                      Add Event
                    </Button>
                  </div>
                </div>
              </>
          )}
          <DialogFooter>
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
