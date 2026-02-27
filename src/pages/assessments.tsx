import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/hooks'

import { X } from 'lucide-react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { localStorageKey } from '@/components/providers/const'
import { setNotes } from '@/components/modal/shared'
import { frontendFrameworks, patterns, programmingLanguages, type Framework, type Note, type Step } from '@/global/types'

const Assessments = () => {
  const { data, dispatch, existing, postData, state } = useAuth()
  const notes = useMemo(() => state.notes && state.notes.length > 0 ? state.notes : existing && existing.notes ? existing.notes : [], [state, existing])
  const [ open, setOpen ] = useState(false)
  const [ expanded , setExpanded ] = useState<string[]>([])
  const [ openSteps, setOpenSteps ] = useState(false)
  const [ editNote, setEditNote ] = useState<Note>({ id: '', description: '', problem: '', solution: '', source: '', steps: [], title: '' })
  const { description, problem, solution, source, steps, title } = editNote
  const allNotes = data?.notes && data.notes.length > 0 ? data.notes : state.notes && state.notes.length > 0 ? state.notes : existing && existing.notes ? existing.notes : []

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEditNote((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const handleDelete = useCallback(async () => {
    const notesCopy = notes.filter((j) => j.id !== editNote.id)
    await setNotes({ action: 'delete', dispatch, email: state.email, notes: notesCopy, postData, setEditNote })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, notes: notesCopy || []}))
  }, [dispatch, editNote.id, existing, notes, postData, state.email])

  const handleSaveNote = useCallback(async () => {
    const saveEmail: string = state?.email ? state.email : existing && existing.email ? existing.email : ''
    if (saveEmail) {
      let notesCopy = notes
      if (editNote.id) {
        const pos = notes.map((e) => e.id).indexOf(editNote.id)
        notesCopy = notes.filter((j) => j.id !== editNote.id)
        notesCopy.splice(pos, 0, editNote)
      } else {
        notesCopy.push({ ...editNote, id:crypto.randomUUID()})
      }
      await setNotes({ action: editNote.id ? 'edit' : 'add', dispatch, email: saveEmail, notes: notesCopy, postData, setEditNote })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, notes: notesCopy || []}))
      setOpen(false)
    }
  }, [dispatch, editNote, existing, notes, postData, state.email])

  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="Notes on previous coding assessment problems and solutions." 
        middle="" 
        title="Assessments"
      />
      <div className="w-full my-4">
        <button onClick={() => setOpen(!open)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {open ? 'Close Note Editor' : 'Add Note'}
        </button>
        {open ? (
          <div className="mt-4 p-4 border rounded bg-white">
            <Input
              id="title"
              name="title"
              defaultValue={title}
              onChange={update}
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded" 
            />
            <Input
              id="source"
              name="source"
              defaultValue={source}
              onChange={update}
              placeholder="Source (e.g. company name, website, etc.)"
              className="w-full mb-2 p-2 border rounded" 
            />
          
              {editNote.frameworks && editNote.frameworks.length > 0 ? (
                <div className="flex">
                  <div className="flex gap-2">
                    {editNote.frameworks.map((fw) => (
                      <div key={`${editNote.id}-${fw}`} className="flex px-2 py-1 bg-gray-200 rounded whitespace-nowrap">
                        {fw}
                        <X onClick={() => {
                          const newFrameworks = editNote.frameworks ? editNote.frameworks.filter((f) => f !== fw) : []
                          setEditNote((prevData) => ({
                            ...prevData,
                            frameworks: newFrameworks,
                          }))
                        }} className="ml-1 cursor-pointer stroke-red-500" aria-label={`Remove ${fw}`} />
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setEditNote((prev) => ({ ...prev, frameworks: [] }))} className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Clear Frameworks
                  </Button>
                </div>
              ) : null}
            <div className="flex justify-between my-2">
              <Select onValueChange={(val: Framework) => {
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
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select relevant programming languages, frameworks, or patterns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Programming Languages</SelectLabel>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Frontend Frameworks</SelectLabel>
                    {frontendFrameworks.map((fw) => (
                      <SelectItem key={fw} value={fw}>{fw}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Patterns</SelectLabel>
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
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
              className="w-full mb-2 p-2 border rounded" 
            />
            <Textarea
              id="problem"
              name="problem"
              defaultValue={problem}
              onChange={update}
              placeholder="Problem"
              className="w-full mb-2 p-2 border rounded" 
            />
            {openSteps ? (
              <div className="mb-2 p-2 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Steps to Solution</p>
                  <button onClick={() => setOpenSteps(false)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Close Steps
                  </button>
                </div>
                {steps && steps.length > 0 ? (
                  <ul className="list-decimal list-inside text-gray-700">
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
                          className="w-full p-2 border rounded"
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
                  <p className="text-gray-700 mb-2">No steps added yet.</p>
                )}
                <Button onClick={() => {
                  const newStep: Step = { stepNumber: steps ? steps.length + 1 : 1, description: '' }
                  setEditNote((prev) => ({ ...prev, steps: prev.steps ? [...prev.steps, newStep] : [newStep] }))
                }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Add Step
                </Button>
              </div>
            ) : (
              <button onClick={() => setOpenSteps(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 my-2">
                {steps && steps.length > 0 ? 'Edit Steps' : 'Add Steps to Solution'}
              </button>
            )}
            <Textarea
              id="solution"
              name="solution"
              defaultValue={solution}
              onChange={update}
              placeholder="Solution"
              className="w-full h-40 mb-2 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <Button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
                onClick={() => { 
                  setOpen(false);
                  setEditNote({ id: '', description: '', problem: '', solution: '', source: '', steps: [], title: '' }) 
                  }
                }>
                Cancel
              </Button>
              <Button onClick={() => handleSaveNote()} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save Note
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {allNotes && allNotes.length > 0 ? (
        <div className="w-full">
          {allNotes.map((note) => (
            <div key={`${note.id}-card`} className="mt-4 p-4 border rounded bg-white">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="text-gray-700">{note.description}</p>
              <p className="text-gray-700 mt-2">{note.problem}</p>
              {note.source ? <p className="text-gray-700 mt-2">Source: {note.source}</p> : null}
              {note.frameworks && note.frameworks.length > 0 ? (
                <div className="flex mt-2">
                  {note.frameworks.map((fw) => (
                    <div key={`${note.id}-${fw}`} className="flex px-2 py-1 bg-gray-200 rounded whitespace-nowrap mr-2">
                      {fw}
                    </div>
                  ))}
                </div>
              ) : null}
              {!expanded.includes(note.id) ? (
                <Button className="cursor-pointer px-0 underline" variant="link" onClick={() => setExpanded((prev) => [...prev, note.id])}>
                  Expand Details
                </Button>
              ) : expanded.includes(note.id) ? (
                <>
                <Button className="cursor-pointer px-0 underline" variant="link" onClick={() => setExpanded((prev) => prev.filter((id) => id !== note.id))}>
                  Collapse Details
                </Button>
                {note.steps.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-sm font-light italic">Steps:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {note.steps.map((step, index) => (
                        <li key={`${note.id}-step-${index}`}>{`Step ${step.stepNumber}: ${step.description}`}</li>
                      ))}
                    </ul>
                  </div>
                ) : null }
                {note.solution ? (
                  <div className="my-4 bg-black p-4">
                    <p className="text-sm font-light italic">Solution:</p>
                    <code className="whitespace-pre-wrap text-white">
                      {note.solution}
                    </code>
                  </div>
                ) : null}
                </>
              ) : null }
              
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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Edit Note
                </Button>
                <Button disabled={open} onClick={handleDelete} 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Delete Note
                </Button>
              </div>
            </div>  
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No notes found. Use the button above to add your first note.</p>
      )}
      
    </div>
  )
}

export default Assessments