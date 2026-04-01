import { type SetStateAction, memo, useCallback, useMemo, useState } from 'react'

import { ChevronDownIcon, CirclePlus, Edit, X } from 'lucide-react'

import { localStorageKey } from '@/components/providers//const'
import { useAuth } from '@/components/providers//hooks'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { setTasks } from '@/global/shared'
import { newTask } from '@/global/template'
import type { Task, TaskEvent, TaskStatus } from '@/global/types'

type Props = {
  task?: Task
}

type SubTaskProps = {
  calendarOpen: boolean
  defaultDueDate: Date
  editingEvent: string
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDateDue: React.Dispatch<React.SetStateAction<Date>>
  setEditTask: React.Dispatch<React.SetStateAction<Task>>
  setSubTask: React.Dispatch<React.SetStateAction<TaskEvent>>
  setToggleEventEdit: React.Dispatch<React.SetStateAction<string>>
  subtask: TaskEvent
  task: Task
  toggleEdit: React.Dispatch<React.SetStateAction<string>>
  mode: 'edit' | 'add'
}

const SubTask = memo(function SubTask({
  calendarOpen,
  defaultDueDate,
  editingEvent,
  mode,
  setCalendarOpen,
  setDateDue,
  setEditTask,
  setSubTask,
  subtask,
  task,
  toggleEdit,
}: SubTaskProps) {
  const handleSelectDate = useCallback(
    (d: SetStateAction<Date>) => {
      if (d) {
        if (mode === 'edit') {
          const eventCopy = { ...subtask, dueDate: d.toLocaleString('en-US') }
          const pos = task.events.map((e) => e.id).indexOf(subtask.id)
          const eventsCopy = task.events.filter((j) => j.id !== subtask.id)
          eventsCopy.splice(pos, 0, eventCopy)
          setEditTask({ ...task, events: eventsCopy })
          setDateDue(d)
          setCalendarOpen(false)
        } else {
          setSubTask((prev) => ({
            ...prev,
            dueDate: d.toLocaleString('en-US'),
          }))
        }
      }
    },
    [mode, setCalendarOpen, setDateDue, setEditTask, setSubTask, subtask, task]
  )

  const handleUpdateNote = useCallback(
    (e: { target: { value: string } }) => {
      if (mode === 'edit') {
        const eventCopy = { ...subtask, note: e.target.value }
        const pos = task.events.map((e) => e.id).indexOf(subtask.id)
        const eventsCopy = task.events.filter((j) => j.id !== subtask.id)
        eventsCopy.splice(pos, 0, eventCopy)
        setEditTask({ ...task, events: eventsCopy })
      } else {
        setSubTask((prev) => ({
          ...prev,
          note: e.target.value,
        }))
      }
    },
    [mode, setEditTask, setSubTask, subtask, task]
  )

  return (
    <div className="flex justify-between">
      {editingEvent === subtask.id || mode === 'add' ? (
        <div className="flex w-full flex-col">
          <h2 className="text-sm font-light italic">
            {mode === 'add' ? 'Add a new sub-task' : 'Editing sub-task'}
          </h2>
          <div className="flex">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="text-muted-foreground flex w-23.75 justify-between font-normal"
                >
                  {subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : 'Due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={subtask?.dueDate ? new Date(subtask.dueDate) : defaultDueDate}
                  captionLayout="dropdown"
                  defaultMonth={subtask?.dueDate ? new Date(subtask.dueDate) : new Date()}
                  onSelect={handleSelectDate}
                  required={true}
                />
              </PopoverContent>
            </Popover>
            <Textarea
              className="text-muted-foreground ml-2 w-57.5 text-sm"
              placeholder="Sub-task description"
              value={subtask.note}
              onChange={handleUpdateNote}
            />
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          <div>{subtask.dueDate ? subtask.dueDate : task.createdDate}:</div>
          <div>{subtask.note}</div>
        </div>
      )}
      {mode === 'edit' ? (
        <div className={editingEvent === subtask.id ? 'mt-3.75' : ''}>
          <Edit
            className="relative left-1 w-4 cursor-pointer stroke-gray-500"
            onClick={() => {
              if (editingEvent === subtask.id) {
                toggleEdit('')
              } else {
                toggleEdit(subtask.id)
              }
            }}
          />
          <X
            className="cursor-pointer stroke-red-500"
            aria-label="Click to Remove"
            onClick={() => {
              const updatedEvents = task.events.filter((st) => st.id !== subtask.id)
              setEditTask({ ...task, events: updatedEvents })
            }}
          />
        </div>
      ) : (
        <div className="mt-3.75">
          <CirclePlus
            className={`relative h-6 w-6 stroke-white ${subtask.note && subtask.dueDate ? 'cursor-pointer fill-green-500' : 'cursor-not-allowed fill-gray-500'}`}
            onClick={() => {
              if (!subtask.dueDate || !subtask.note) return
              setEditTask((prev) => ({ ...prev, events: [...prev.events, subtask] }))
              setSubTask({
                dueDate: '',
                done: false,
                id: crypto.randomUUID(),
                note: '',
              })
            }}
          />
        </div>
      )}
    </div>
  )
})

export function TasksModal({ task }: Props) {
  const today = new Date()
  const newDate = new Date(today)
  newDate.setDate(newDate.getDate() + 30)
  const { dispatch, existing, postData, state } = useAuth()
  const tasks = useMemo(() => state.tasks ?? [], [state.tasks])
  const [editTask, setEditTask] = useState<Task>(task ? task : newTask)
  const [editTaskEvent, setEditTaskEvent] = useState<TaskEvent>({
    dueDate: '',
    done: false,
    id: crypto.randomUUID(),
    note: '',
  })
  const [toggleEventEdit, setToggleEventEdit] = useState('')
  const { createdDate, description, status } = editTask
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendar2Open, setCalendar2Open] = useState(false)
  const [date, setDate] = useState<Date>(createdDate ? new Date(createdDate) : new Date())
  const [dateDue, setDateDue] = useState<Date>(newDate)

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEditTask((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const handleDelete = useCallback(async () => {
    const tasksCopy = tasks.filter((j) => j.id !== editTask.id)
    await setTasks({
      action: 'delete',
      dispatch,
      email: state.email,
      tasks: tasksCopy,
      postData,
      setEditTask,
    })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, tasks: tasksCopy || [] }))
  }, [dispatch, editTask.id, existing, tasks, postData, state.email])

  const handleSave = useCallback(async () => {
    const saveEmail: string = state.email
    if (saveEmail) {
      let tasksCopy = tasks
      if (task) {
        const pos = tasks.map((e) => e.id).indexOf(task.id)
        tasksCopy = tasks.filter((j) => j.id !== editTask.id)
        tasksCopy.splice(pos, 0, editTask)
      } else {
        tasksCopy.push({
          ...editTask,
          createdDate: `${!editTask.createdDate && date ? date.toLocaleDateString() : editTask.createdDate}`,
          id: crypto.randomUUID(),
        })
      }
      await setTasks({
        action: task ? 'edit' : 'add',
        dispatch,
        email: saveEmail,
        tasks: tasksCopy,
        postData,
        setEditTask,
      })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, tasks: tasksCopy || [] }))
    }
  }, [date, dispatch, editTask, existing, task, tasks, postData, state.email])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            className={`${task ? 'ml-2 justify-start px-2' : 'mx-4'} cursor-pointer`}
            variant="outline"
          >
            {task ? 'Edit Task Info' : 'Add New Task +'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task Info' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {task ? 'Edit information for' : 'Add information about'} this Task. <br />
              Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Textarea
              onChange={update}
              name="description"
              placeholder="Description"
              defaultValue={description}
            />
          </div>
          <div className="flex justify-between">
            <Select
              name="status"
              defaultValue={status}
              onValueChange={(val) => {
                setEditTask((prevData) => ({
                  ...prevData,
                  status: val as TaskStatus,
                }))
              }}
            >
              <SelectTrigger className="w-45">
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
                  className="text-muted-foreground flex w-45 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : 'Create date'}
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
            <div className="text-sm font-light italic">Sub-tasks:</div>
            <div className="scrollbar-transparent max-h-100 overflow-auto">
              {editTask.events.map((event, i) => (
                <SubTask
                  calendarOpen={calendarOpen}
                  defaultDueDate={dateDue}
                  editingEvent={toggleEventEdit}
                  key={`edit-subtask-${i}-${event.id}`}
                  mode="edit"
                  subtask={event}
                  setCalendarOpen={setCalendarOpen}
                  setDateDue={setDateDue}
                  setEditTask={setEditTask}
                  setSubTask={setEditTaskEvent}
                  setToggleEventEdit={setToggleEventEdit}
                  task={editTask}
                  toggleEdit={setToggleEventEdit}
                />
              ))}
            </div>

            {!editTask.events || editTask.events.length === 0 ? (
              <div className="text-sm font-light italic">No events added yet.</div>
            ) : null}
            <SubTask
              calendarOpen={calendar2Open}
              defaultDueDate={dateDue}
              editingEvent={toggleEventEdit}
              mode="add"
              setDateDue={setDateDue}
              subtask={editTaskEvent}
              setCalendarOpen={setCalendar2Open}
              setEditTask={setEditTask}
              setSubTask={setEditTaskEvent}
              setToggleEventEdit={setToggleEventEdit}
              task={editTask}
              toggleEdit={setToggleEventEdit}
            />
          </div>
          <DialogFooter>
            {task ? (
              <DialogClose asChild>
                <Button variant="outline" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogClose>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSave}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
