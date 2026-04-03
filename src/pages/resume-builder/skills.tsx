import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/resume-provider'
import { Button } from '@/components/ui/button'
import { FieldLegend } from '@/components/ui/field'
import { disableSave, spliceOrConcatArray } from '@/global/functions'
import { getItemToEdit } from '@/global/functions'
import { setResume } from '@/global/shared'
import type { Education, Skill } from '@/global/types'
import { ResumeInput } from '@/pages/resume-builder/input'

import type { Mode, TextUpdateEvent } from './types'

export const ResumeSkills = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { skills } = state
  const [skill, setSkill] = useState<Skill>({
    id: crypto.randomUUID(),
    name: '',
  })
  const original = useMemo(
    () => authState?.resume?.skills?.find((item) => item.id === skill.id),
    [authState, skill]
  )
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({
    id: crypto.randomUUID(),
    mode: undefined,
  })

  const setButtonAction = useCallback(
    (mode: Mode, id: string, _name?: string, value?: string) => {
      const current = getItemToEdit(skill, skills, id)
      switch (mode) {
        case 'copy':
          navigator.clipboard.writeText(value || '')
          toast.success('Copied to clipboard')
          break
        case 'edit':
          setEditing({ id, mode })
          setSkill(current as Skill)
          break
        case 'save':
          saveById(id)
          break
        case 'undo':
          const original = authState?.resume?.skills?.find((item) => item.id === id)
          if (original) {
            setSkill(original)
          }
          setEditing({ id, mode: 'view' })
          break
        default:
          break
      }
    },
    [skills, skill, setEditing]
  )

  const update = useCallback(
    (event: TextUpdateEvent, id?: string) => {
      const { name, value } = event.target
      const edited = getItemToEdit(skill, skills, id || '')
      const updated = {
        ...edited,
        [name]: value,
      }
      setSkill(updated as Skill)
    },
    [skill, skills, setSkill]
  )

  const updateDate = useCallback(
    async (d: Date, name: string, id?: string) => {
      let edited = getItemToEdit(skill, skills, id || '')
      edited = {
        ...edited,
        [name]: d.toLocaleDateString(),
      }
      setSkill(edited as Skill)
    },
    [skill, skills, setSkill]
  )

  const saveById = useCallback(
    async (id?: string) => {
      try {
        const arr = spliceOrConcatArray(skill, skills)
        dispatch({ type: 'SET_SKILLS', skills: arr as Skill[] })
        dispatchAuth({
          type: 'SET_RESUME',
          resume: { ...state, skills: arr as Skill[] },
        })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, skills: arr as Skill[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            ...authState,
            resume: { ...state, skills: arr as Skill[] },
          })
        )
        setEditing({ id: id || skill.id, mode: 'view' })
        toast.success('Saved successfully')
      } catch (error) {
        toast.error('Error saving work history')
      }
    },
    [dispatch, dispatchAuth, skill, skills, setEditing, setResume, state]
  )

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setEditing({ id: nextId, mode: 'add' })
    setSkill({
      id: nextId,
      name: '',
    })
    const arr = spliceOrConcatArray(
      {
        id: nextId,
        name: '',
      },
      skills
    )
    dispatch({ type: 'SET_SKILLS', skills: arr as Skill[] })
  }, [dispatch, skill, skills, setEditing])

  const deleteById = useCallback(
    async (id: string) => {
      try {
        const arr = skills.filter((item) => item.id !== id)
        dispatch({ type: 'SET_SKILLS', skills: arr as Skill[] })
        dispatchAuth({
          type: 'SET_RESUME',
          resume: { ...state, skills: arr as Skill[] },
        })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, skills: arr as Skill[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            ...authState,
            resume: { ...state, skills: arr as Skill[] },
          })
        )
        toast.success('Deleted successfully')
      } catch (error) {
        toast.error('Error deleting work history')
      }
    },
    [dispatchAuth, state]
  )

  return (
    <div className="flex flex-col gap-4">
      <FieldLegend className="mt-4 border-b pb-2 font-bold">Skills</FieldLegend>
      {skills.map((item) => {
        return (
          <div className="" key={`skill-section-${item.id}`}>
            <ResumeInput
              data={skill.id === item.id ? skill.name : item.name}
              id={item.id}
              inputType="input"
              key={`skill-name-${item.id}`}
              label="Skill Name"
              name="name"
              originalData={original?.name}
              placeholder="Enter a skill"
              saveById={saveById}
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <div className="mt-4 flex justify-end gap-4 border-b pb-4">
              <Button
                className="w-40 cursor-pointer"
                name="delete-skills"
                onClick={() => deleteById(item.id)}
                variant="outline"
              >
                Delete
              </Button>
              <Button
                className="w-40 cursor-pointer disabled:cursor-not-allowed!"
                disabled={disableSave(
                  getItemToEdit(skill, skills, item.id) as Education,
                  authState?.resume?.skills || [],
                  item.id
                )}
                name="save-skills"
                onClick={() => saveById(item.id)}
              >
                Save
              </Button>
            </div>
          </div>
        )
      })}
      {editing.mode !== 'add' ? (
        <Button className="w-40" name="add-new-work-skills" onClick={addNew}>
          Add New
        </Button>
      ) : null}
    </div>
  )
}
