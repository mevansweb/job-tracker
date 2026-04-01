import { useCallback, useMemo, useState } from 'react'

import { X } from 'lucide-react'

import Header from '@/components/header'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { setNotes } from '@/global/shared'
import {
  type Framework,
  type Note,
  type Step,
  frontendFrameworks,
  patterns,
  programmingLanguages,
} from '@/global/types'

const Assessments = () => {
  const { dispatch, existing, postData, state } = useAuth()
  const notes = useMemo(() => state.notes ?? [], [state.notes])
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  const [openSteps, setOpenSteps] = useState(false)
  const [editNote, setEditNote] = useState<Note>({
    id: '',
    description: '',
    problem: '',
    solution: '',
    source: '',
    steps: [],
    title: '',
  })
  const { description, problem, solution, source, steps, title } = editNote
  const allNotes = useMemo(() => state.notes ?? [], [state.notes])

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEditNote((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const handleDelete = useCallback(async () => {
    const notesCopy = notes.filter((j) => j.id !== editNote.id)
    await setNotes({
      action: 'delete',
      dispatch,
      email: state.email,
      notes: notesCopy,
      postData,
      setEditNote,
    })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, notes: notesCopy || [] }))
  }, [dispatch, editNote.id, existing, notes, postData, state.email])

  const handleSaveNote = useCallback(async () => {
    const saveEmail: string = state.email
    if (saveEmail) {
      let notesCopy = notes
      if (editNote.id) {
        const pos = notes.map((e) => e.id).indexOf(editNote.id)
        notesCopy = notes.filter((j) => j.id !== editNote.id)
        notesCopy.splice(pos, 0, editNote)
      } else {
        notesCopy.push({ ...editNote, id: crypto.randomUUID() })
      }
      await setNotes({
        action: editNote.id ? 'edit' : 'add',
        dispatch,
        email: saveEmail,
        notes: notesCopy,
        postData,
        setEditNote,
      })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, notes: notesCopy || [] }))
      setOpen(false)
    }
  }, [dispatch, editNote, existing, notes, postData, state.email])

  return (
    <div className="flex flex-col p-4">
      <Header
        greeting="Notes on previous coding assessment problems and solutions."
        middle=""
        title="Assessments"
      />
      <div className="my-4 w-full">
        <button
          onClick={() => setOpen(!open)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {open ? 'Close Note Editor' : 'Add Note'}
        </button>
        {open ? (
          <div className="mt-4 rounded border p-4">
            <Input
              id="title"
              name="title"
              defaultValue={title}
              onChange={update}
              placeholder="Title"
              className="mb-2 w-full rounded border p-2"
            />
            <Input
              id="source"
              name="source"
              defaultValue={source}
              onChange={update}
              placeholder="Source (e.g. company name, website, etc.)"
              className="mb-2 w-full rounded border p-2"
            />

            {editNote.frameworks && editNote.frameworks.length > 0 ? (
              <div className="flex">
                <div className="flex gap-2">
                  {editNote.frameworks.map((fw) => (
                    <div
                      key={`${editNote.id}-${fw}`}
                      className="light:bg-gray-200 flex rounded px-2 py-1 whitespace-nowrap dark:bg-gray-900"
                    >
                      {fw}
                      <X
                        onClick={() => {
                          const newFrameworks = editNote.frameworks
                            ? editNote.frameworks.filter((f) => f !== fw)
                            : []
                          setEditNote((prevData) => ({
                            ...prevData,
                            frameworks: newFrameworks,
                          }))
                        }}
                        className="ml-1 cursor-pointer stroke-red-500"
                        aria-label={`Remove ${fw}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setEditNote((prev) => ({ ...prev, frameworks: [] }))}
                  className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Clear Frameworks
                </Button>
              </div>
            ) : null}
            <div className="my-2 flex justify-between">
              <Select
                onValueChange={(val: Framework) => {
                  let newFrameworks: Framework[] = []
                  if (editNote.frameworks && editNote.frameworks.includes(val)) {
                    newFrameworks = editNote.frameworks.filter((f) => f !== val)
                  } else if (editNote.frameworks) {
                    newFrameworks = [...editNote.frameworks, val]
                  } else {
                    newFrameworks = [val]
                  }
                  setEditNote((prevData) => ({
                    ...prevData,
                    frameworks: newFrameworks,
                  }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select relevant programming languages, frameworks, or patterns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Programming Languages</SelectLabel>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Frontend Frameworks</SelectLabel>
                    {frontendFrameworks.map((fw) => (
                      <SelectItem key={fw} value={fw}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Patterns</SelectLabel>
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>
                        {pattern}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Input
              id="description"
              name="description"
              defaultValue={description}
              onChange={update}
              placeholder="Description"
              className="mb-2 w-full rounded border p-2"
            />
            <Textarea
              id="problem"
              name="problem"
              defaultValue={problem}
              onChange={update}
              placeholder="Problem"
              className="mb-2 w-full rounded border p-2"
            />
            {openSteps ? (
              <div className="mb-2 rounded border p-2">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">Steps to Solution</p>
                  <button
                    onClick={() => setOpenSteps(false)}
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                  >
                    Close Steps
                  </button>
                </div>
                {steps && steps.length > 0 ? (
                  <ul className="light:text-gray-700 list-inside list-decimal dark:text-gray-400">
                    {steps.map((step, index) => (
                      <li key={`${editNote.id}-step-${index}`} className="mb-1 flex">
                        <Input
                          name={`step-${index}-description`}
                          defaultValue={step.description}
                          onChange={(e) => {
                            const newSteps = [...steps]
                            newSteps[index].description = e.target.value
                            setEditNote((prev) => ({ ...prev, steps: newSteps }))
                          }}
                          placeholder={`Step ${step.stepNumber} Description`}
                          className="w-full rounded border p-2"
                        />
                        <X
                          onClick={() => {
                            const newSteps = steps.filter((_, i) => i !== index)
                            setEditNote((prev) => ({ ...prev, steps: newSteps }))
                          }}
                          className="cursor-pointer stroke-red-500"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="light:text-gray-700 mb-2 dark:text-gray-400">No steps added yet.</p>
                )}
                <Button
                  onClick={() => {
                    const newStep: Step = {
                      stepNumber: steps ? steps.length + 1 : 1,
                      description: '',
                    }
                    setEditNote((prev) => ({
                      ...prev,
                      steps: prev.steps ? [...prev.steps, newStep] : [newStep],
                    }))
                  }}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Add Step
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setOpenSteps(true)}
                className="my-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                {steps && steps.length > 0 ? 'Edit Steps' : 'Add Steps to Solution'}
              </button>
            )}
            <Textarea
              id="solution"
              name="solution"
              defaultValue={solution}
              onChange={update}
              placeholder="Solution"
              className="mb-2 h-40 w-full rounded border p-2"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => {
                  setOpen(false)
                  setEditNote({
                    id: '',
                    description: '',
                    problem: '',
                    solution: '',
                    source: '',
                    steps: [],
                    title: '',
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSaveNote()}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Save Note
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {allNotes && allNotes.length > 0 ? (
        <div className="w-full">
          {allNotes.map((note) => (
            <div
              key={`${note.id}-card`}
              className="light:bg-white dark:bg-input mt-4 rounded border p-4"
            >
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="light:text-gray-700">{note.description}</p>
              <p className="light:text-gray-700 mt-2">{note.problem}</p>
              {note.source ? (
                <p className="light:text-gray-700 mt-2">Source: {note.source}</p>
              ) : null}
              {note.frameworks && note.frameworks.length > 0 ? (
                <div className="mt-2 flex">
                  {note.frameworks.map((fw) => (
                    <div
                      key={`${note.id}-${fw}`}
                      className="light:bg-gray-200 mr-2 flex rounded px-2 py-1 whitespace-nowrap dark:bg-gray-600"
                    >
                      {fw}
                    </div>
                  ))}
                </div>
              ) : null}
              {!expanded.includes(note.id) ? (
                <Button
                  className="cursor-pointer px-0 underline"
                  variant="link"
                  onClick={() => setExpanded((prev) => [...prev, note.id])}
                >
                  Expand Details
                </Button>
              ) : expanded.includes(note.id) ? (
                <>
                  <Button
                    className="cursor-pointer px-0 underline"
                    variant="link"
                    onClick={() => setExpanded((prev) => prev.filter((id) => id !== note.id))}
                  >
                    Collapse Details
                  </Button>
                  {note.steps.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm font-light italic">Steps:</p>
                      <ul className="light:text-gray-700 list-inside list-disc text-sm">
                        {note.steps.map((step, index) => (
                          <li
                            key={`${note.id}-step-${index}`}
                          >{`Step ${step.stepNumber}: ${step.description}`}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {note.solution ? (
                    <div className="my-4 bg-black p-4">
                      <p className="text-sm font-light italic">Solution:</p>
                      <code className="whitespace-pre-wrap text-white">{note.solution}</code>
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  disabled={open}
                  onClick={() => {
                    setEditNote(note)
                    setOpen(true)
                    if (note.steps && note.steps.length > 0) {
                      setOpenSteps(true)
                    }
                  }}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Edit Note
                </Button>
                <Button
                  disabled={open}
                  onClick={handleDelete}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete Note
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="light:text-gray-700 dark:text-gray-400">
          No notes found. Use the button above to add your first note.
        </p>
      )}
    </div>
  )
}

export default Assessments
