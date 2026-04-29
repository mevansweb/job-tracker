import { useCallback, useMemo, useState } from 'react'

import { X } from 'lucide-react'

import Header from '@/components/header/header'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'
import { RoundedContainer } from '@/components/rounded-container'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
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
import { spliceOrConcatArray } from '@/global/functions'
import { setNotes } from '@/global/shared'
import {
  type Framework,
  type Note,
  type Step,
  frontendFrameworks,
  patterns,
  programmingLanguages,
} from '@/global/types'

type ActionProps = {
  action: 'add' | 'delete' | 'update' | 'save'
  index: number
  updateType: 'frameworks' | 'steps' | 'note'
  value: string
}

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

  const handleButtonAction = useCallback(
    async ({ action, updateType, index, value }: ActionProps) => {
      switch (updateType) {
        case 'note':
          if (action === 'save') {
            const saveEmail: string = state.email
            if (saveEmail) {
              const arr = spliceOrConcatArray(editNote, notes)
              await setNotes({
                action: editNote.id ? 'edit' : 'add',
                dispatch,
                email: saveEmail,
                notes: arr as Note[],
                postData,
                setEditNote,
              })
              localStorage.setItem(
                localStorageKey,
                JSON.stringify({ ...existing, notes: (arr as Note[]) || [] })
              )
              setOpen(false)
            }
          } else if (action === 'delete') {
            const notesCopy = notes.filter((j) => j.id !== value)
            await setNotes({
              action: 'delete',
              dispatch,
              email: state.email,
              notes: notesCopy,
              postData,
              setEditNote,
            })
            localStorage.setItem(
              localStorageKey,
              JSON.stringify({ ...existing, notes: notesCopy || [] })
            )
          }
          break
        case 'frameworks':
          if (action === 'update') {
            let newFrameworks: Framework[] = []
            const val = value as Framework
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
          } else if (action === 'delete') {
            const newFrameworks = editNote.frameworks
              ? editNote.frameworks.filter((f) => f !== value)
              : []
            setEditNote((prevData) => ({
              ...prevData,
              frameworks: newFrameworks,
            }))
          }
          break
        case 'steps':
          if (action === 'update') {
            const newSteps = [...steps]
            newSteps[index].description = value
            setEditNote((prev) => ({ ...prev, steps: newSteps }))
          } else if (action === 'add') {
            const newStep: Step = {
              stepNumber: steps ? steps.length + 1 : 1,
              description: '',
            }
            setEditNote((prev) => ({
              ...prev,
              steps: prev.steps ? [...prev.steps, newStep] : [newStep],
            }))
          } else if (action === 'delete') {
            const newSteps = steps.filter((_, i) => i !== index)
            setEditNote((prev) => ({ ...prev, steps: newSteps }))
          }
          break
        default:
          break
      }
    },
    [dispatch, editNote, existing, notes, postData, state.email, steps]
  )

  return (
    <div className="flex flex-col p-8">
      <Header
        greeting="Notes on previous coding assessment problems and solutions."
        middle=""
        title="Assessments"
      />
      <div className="mt-8 w-full">
        <div className="flex">
          <Button onClick={() => setOpen(!open)} className="mx-auto px-8" size="lg">
            {open ? 'Close Note Editor' : 'Add Note'}
          </Button>
        </div>
        {open ? (
          <RoundedContainer
            className="mt-4 w-full!"
            title={editNote.id.length === 0 ? `Add New Note` : `Edit Note`}
          >
            <FieldSet>
              <FieldGroup>
                <div className="flex flex-col gap-3">
                  <FieldLabel className="font-semibold">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={title}
                    onChange={update}
                    placeholder="Enter a short description of the problem."
                  />
                  <FieldLabel className="font-semibold">Source</FieldLabel>
                  <Input
                    id="source"
                    name="source"
                    defaultValue={source}
                    onChange={update}
                    placeholder="Source (e.g. company name, website, etc.)"
                  />
                  <FieldLabel className="font-semibold">Frameworks</FieldLabel>
                  {editNote.frameworks && editNote.frameworks.length > 0 ? (
                    <div className="flex">
                      <div className="flex gap-2">
                        {editNote.frameworks.map((fw) => (
                          <div
                            key={`${editNote.id}-${fw}`}
                            className="light:bg-gray-200 flex items-center rounded-lg px-4 py-1 whitespace-nowrap dark:bg-gray-900"
                          >
                            {fw}
                            <X
                              onClick={() =>
                                handleButtonAction({
                                  action: 'delete',
                                  updateType: 'frameworks',
                                  index: 0,
                                  value: fw,
                                })
                              }
                              className="ml-1 cursor-pointer stroke-red-500"
                              aria-label={`Remove ${fw}`}
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        className="ml-4"
                        onClick={() => setEditNote((prev) => ({ ...prev, frameworks: [] }))}
                        size="lg"
                      >
                        Clear Frameworks
                      </Button>
                    </div>
                  ) : null}
                  <div className="flex w-120 flex-col gap-4">
                    <Select
                      name="frameworks"
                      onValueChange={(val: Framework) =>
                        handleButtonAction({
                          action: 'update',
                          updateType: 'frameworks',
                          index: 0,
                          value: val,
                        })
                      }
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
                  <FieldLabel className="font-semibold">Description</FieldLabel>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={description}
                    onChange={update}
                    placeholder="Description"
                  />
                  <FieldLabel className="font-semibold">Problem</FieldLabel>
                  <Textarea
                    id="problem"
                    name="problem"
                    defaultValue={problem}
                    onChange={update}
                    placeholder="Problem"
                  />
                  <FieldLabel className="font-semibold">Steps to Solution</FieldLabel>
                  {openSteps ? (
                    <div className="mb-2 border-t border-b p-2">
                      <div className="flex items-center justify-between">
                        <Button onClick={() => setOpenSteps(false)} className="my-4" size="lg">
                          Close Steps
                        </Button>
                      </div>
                      {steps && steps.length > 0 ? (
                        <ul className="light:text-gray-700 list-inside list-decimal dark:text-gray-400">
                          {steps.map((step, index) => (
                            <li key={`${editNote.id}-step-${index}`} className="mb-1 flex">
                              <Input
                                name={`step-${index}-description`}
                                defaultValue={step.description}
                                onChange={(e) =>
                                  handleButtonAction({
                                    action: 'update',
                                    updateType: 'steps',
                                    index,
                                    value: e.target.value,
                                  })
                                }
                                placeholder={`Step ${step.stepNumber} Description`}
                              />
                              <X
                                onClick={() =>
                                  handleButtonAction({
                                    action: 'delete',
                                    updateType: 'steps',
                                    index,
                                    value: step.description,
                                  })
                                }
                                className="cursor-pointer stroke-red-500"
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="light:text-gray-700 mb-2 dark:text-gray-400">
                          No steps added yet.
                        </p>
                      )}
                      <Button
                        onClick={() =>
                          handleButtonAction({
                            action: 'add',
                            updateType: 'steps',
                            index: 0,
                            value: '',
                          })
                        }
                        className="my-4"
                        size="lg"
                      >
                        Add Step
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setOpenSteps(true)}
                      className="my-2 mt-2 mb-4 w-50"
                      size="lg"
                    >
                      {steps && steps.length > 0 ? 'Edit Steps' : 'Add Steps to Solution'}
                    </Button>
                  )}
                  <FieldLabel className="font-semibold">The Solution</FieldLabel>
                  <Textarea
                    id="solution"
                    name="solution"
                    defaultValue={solution}
                    onChange={update}
                    placeholder="Solution"
                    className="mb-2 h-40 w-full border p-2"
                  />
                  <div className="mt-8 flex justify-end gap-2">
                    <Button
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
                      size="lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        handleButtonAction({
                          action: 'save',
                          updateType: 'note',
                          index: 0,
                          value: '',
                        })
                      }
                      size="lg"
                    >
                      Save Note
                    </Button>
                  </div>
                </div>
              </FieldGroup>
            </FieldSet>
          </RoundedContainer>
        ) : null}
      </div>
      {allNotes && allNotes.length > 0 ? (
        <div className="w-full">
          {allNotes.map((note, index) => (
            <RoundedContainer
              key={`${note.id}-card`}
              className="mt-4-lg w-full!"
              title={note.title}
            >
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
                      className="light:bg-gray-200 mr-2 flex rounded-lg px-4 py-1 whitespace-nowrap dark:bg-gray-600"
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
                  className="px-4 py-2"
                  disabled={open}
                  onClick={() =>
                    handleButtonAction({
                      action: 'delete',
                      updateType: 'note',
                      index,
                      value: note.id,
                    })
                  }
                  variant="outline"
                >
                  Delete Note
                </Button>
                <Button
                  className="px-4 py-2 text-white"
                  //disabled={open}
                  onClick={() => {
                    setEditNote(note)
                    setOpen(true)
                    if (note.steps && note.steps.length > 0) {
                      setOpenSteps(true)
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Edit Note
                </Button>
              </div>
            </RoundedContainer>
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
