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
import { Textarea } from '@/components/ui/textarea'
import { newTask } from '../../global/template'
import type { Task, TaskEvent } from '../../global/types'
import { localStorageKey } from '../providers/const'
import { useAuth } from '../providers/hooks'
import { setTasks } from './shared'
import { Input } from '../ui/input'

type Props = {
  task?: Task
}

export function TasksModal({ task } : Props){
  const { dispatch, existing, postData, state } = useAuth()
  const tasks = useMemo(() => state.tasks ?? [], [state])
  const [editTask, setEditTask ] = useState<Task>(task && task.id ? task : newTask)
  const [editTaskEvent, setEditTaskEvent] = useState<TaskEvent>({
    dueDate: '',
    note: '',
  })
  const { createdDate, description, status } = editTask
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [date, setDate] = useState<Date>(createdDate ? new Date(createdDate) : new Date())
  const [dateDue, setDateDue] = useState<Date>(editTaskEvent.dueDate ? new Date(editTaskEvent.dueDate) : new Date())

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEditTask((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const handleDelete = useCallback(async () => {
    const tasksCopy = tasks.filter((j) => j.id !== editTask.id)
    await setTasks({ dispatch, email: state.email, tasks: tasksCopy, postData, setEditTask })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, tasks: tasksCopy || []}))
  }, [dispatch, editTask.id, existing, tasks, postData, state.email])

  const handleSave = useCallback(async () => {
    let tasksCopy = tasks
    if (task) {
      const pos = tasks.map((e) => e.id).indexOf(task.id)
      tasksCopy = tasks.filter((j) => j.id !== editTask.id)
      tasksCopy.splice(pos, 0, editTask)
    } else {
      tasksCopy.push({ ...editTask, createdDate: `${!editTask.createdDate && date ? date.toLocaleDateString() : editTask.createdDate}`, id:crypto.randomUUID()})
    }
    await setTasks({ dispatch, email: state.email, tasks: tasksCopy, postData, setEditTask })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, tasks: tasksCopy || []}))
  }, [date, dispatch, editTask, existing, task, tasks, postData, state.email])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className={`${task ? 'justify-start px-2 ml-2' : 'mx-4'} cursor-pointer`} variant="outline">{task ? 'Edit Task Info' : 'Add New Task +'}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task Info' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {task ? 'Edit information for' : 'Add information about'} this Task. <br />Click save when you are done.
            </DialogDescription>
          </DialogHeader>
        <div className="grid gap-3">
            <Textarea onChange={update} name="description" placeholder="Description" defaultValue={description} />
            </div>
        <div className="flex justify-between">
            <Select name="taskType" defaultValue={status} onValueChange={(val) => {
            setEditTask((prevData) => ({
                ...prevData,
                taskType: val,
            }))
            }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Task Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="to-do">To-Do</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                    {date ? date.toLocaleDateString() : "Create date"}
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
                        setEditTask((prevData) => ({
                            ...prevData,
                            createdDate: d.toLocaleDateString('en-US'),
                        }))
                        setDate(d)
                        setOpen(false)
                        } 
                    }}
                />
            </PopoverContent>
            </Popover>
        </div>
        <div className="flex flex-col gap-3">
            <div className="text-sm font-light italic">Events:</div>
            {editTask.events.map((event, index) => (
                <div key={`event-${index}`} className="flex justify-between">
                    {event.dueDate ? event.dueDate : createdDate}:&nbsp;&nbsp;{event.note}
                    <X className="cursor-pointer stroke-red-500" aria-label="Click to Remove" onClick={() => {
                        const updatedEvents = editTask.events.filter((_, i) => i !== index)
                        setEditTask({ ...editTask, events: updatedEvents })
                    }} />
                </div>
            ))}
            {!editTask.events || editTask.events.length === 0 ? <div className="text-sm font-light italic">No events added yet.</div> : null}
            <div className="flex-col">
                <div className="flex justify-between">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                        <Button variant="outline" id="date" className="w-[180px] flex text-muted-foreground font-normal justify-between">
                            {editTaskEvent.dueDate ? editTaskEvent.dueDate : "Event due date"}
                            <ChevronDownIcon />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateDue}
                            captionLayout="dropdown"
                            defaultMonth={date || new Date()}
                            onSelect={(d) => {
                                if (d) {
                                    setEditTaskEvent((prev) => ({ ...prev, dueDate: d.toLocaleDateString('en-US') }))
                                    setDateDue(d)
                                    setOpen(false)
                                } 
                            }}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button
                        disabled={!editTaskEvent.dueDate || !editTaskEvent.note}
                        variant="outline" 
                        onClick={() => {
                        if (!editTaskEvent.dueDate || !editTaskEvent.note) return
                        setEditTask((prev) => ({ ...prev, events: [...prev.events, editTaskEvent] }))
                        setEditTaskEvent({
                            dueDate: '',
                            note: '',
                        })
                    }}>Add Event</Button>
                </div>
                <Input className="mt-4" placeholder="Event note" value={editTaskEvent.note} onChange={(e) => setEditTaskEvent((prev) => ({ ...prev, note: e.target.value }))} />
             </div>
          </div>
          <DialogFooter>
            {task ? (
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
