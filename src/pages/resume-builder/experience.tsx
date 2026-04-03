import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { FieldLegend } from '@/components/ui/field'
import { disableSave, spliceOrConcatArray } from '@/global/functions'
import { getItemToEdit } from '@/global/functions'
import { setResume } from '@/global/shared'
import type { Employer } from '@/global/types'
import { ResumeInput } from '@/pages/resume-builder/input'

import type { Mode, TextUpdateEvent } from './types'

export const ResumeExperience = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { employer, experience } = state
  const original = useMemo(
    () => authState?.resume?.experience?.find((item) => item.id === employer.id),
    [authState, employer]
  )
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({
    id: crypto.randomUUID(),
    mode: undefined,
  })

  const saveById = useCallback(
    async (id?: string) => {
      try {
        const arr = spliceOrConcatArray(employer, experience)
        dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
        dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, experience: arr as Employer[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } })
        )
        setEditing({ id: id || employer.id, mode: 'view' })
        toast.success('Saved successfully')
      } catch (error) {
        toast.error(`Error saving work history: ${error}`)
      }
    },
    [authState, dispatch, dispatchAuth, employer, experience, postData, state]
  )

  const setButtonAction = useCallback(
    async (mode: Mode, id: string, _name?: string, value?: string) => {
      const current = getItemToEdit(employer, experience, id)
      switch (mode) {
        case 'copy':
          await navigator.clipboard.writeText(value || '')
          toast.success('Copied to clipboard')
          break
        case 'edit':
          setEditing({ id, mode })
          dispatch({ type: 'SET_EMPLOYER', employer: current as Employer })
          break
        case 'save':
          await saveById(id)
          break
        case 'undo': {
          const original = authState?.resume?.experience?.find((item) => item.id === id)
          if (original) {
            dispatch({ type: 'SET_EMPLOYER', employer: original })
          }
          setEditing({ id, mode: 'view' })
          break
        }
        default:
          break
      }
    },
    [employer, experience, dispatch, saveById, authState?.resume?.experience]
  )

  const update = useCallback(
    (event: TextUpdateEvent, id?: string) => {
      const { name, value } = event.target
      const edited = getItemToEdit(employer, experience, id || '')
      const updated = {
        ...edited,
        [name]: value,
      }
      dispatch({ type: 'SET_EMPLOYER', employer: updated as Employer })
    },
    [employer, experience, dispatch]
  )

  const updateDate = useCallback(
    async (d: Date, name: string, id?: string) => {
      let edited = getItemToEdit(employer, experience, id || '')
      edited = {
        ...edited,
        [name]: d.toLocaleDateString(),
      }
      dispatch({ type: 'SET_EMPLOYER', employer: { ...(edited as Employer) } })
    },
    [employer, experience, dispatch]
  )

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setEditing({ id: nextId, mode: 'add' })
    dispatch({
      type: 'SET_EMPLOYER',
      employer: {
        company: '',
        dateFrom: '',
        dateTo: '',
        id: nextId,
        description: '',
        location: '',
        position: '',
      },
    })
    const arr = spliceOrConcatArray(
      {
        company: '',
        dateFrom: '',
        dateTo: '',
        id: nextId,
        description: '',
        location: '',
        position: '',
      },
      experience
    )
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
  }, [dispatch, experience, setEditing])

  const deleteById = useCallback(
    async (id: string) => {
      try {
        const arr = experience.filter((item) => item.id !== id)
        dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
        dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, experience: arr as Employer[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } })
        )
        toast.success('Deleted successfully')
      } catch (error) {
        toast.error(`Error deleting work history: ${error}`)
      }
    },
    [authState, dispatch, dispatchAuth, experience, postData, state]
  )

  return (
    <div className="flex flex-col gap-4">
      <FieldLegend className="mt-4 border-b pb-2 font-bold">Work History</FieldLegend>
      {experience.map((item) => {
        return (
          <div className="" key={`job-history-section-${item.id}`}>
            <ResumeInput
              data={employer.id === item.id ? employer.position : item.position}
              id={item.id}
              inputType="input"
              key={`job-title-${item.id}`}
              label="Job Title"
              name="position"
              originalData={original?.position}
              placeholder="Job title"
              saveById={saveById}
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <ResumeInput
              data={employer.id === item.id ? employer.company : item.company}
              id={item.id}
              inputType="input"
              key={`job-company-${item.id}`}
              label="Employer"
              name="company"
              originalData={original?.company}
              placeholder="Employer"
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <ResumeInput
              data={employer.id === item.id ? employer.description : item.description}
              id={item.id}
              inputType="textarea"
              key={`job-desc-${item.id}`}
              label="Job Description"
              name="description"
              originalData={original?.description ?? ''}
              placeholder="Job Description"
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <div className="flex justify-start gap-4">
              <ResumeInput
                className="w-40"
                data={employer.id === item.id ? employer.dateFrom : item.dateFrom}
                id={item.id}
                inputType="calendar"
                key={`job-dateFrom-${item.id}`}
                label="Start Date"
                name="dateFrom"
                placeholder="End Date"
                setButtonAction={setButtonAction}
                updateDate={(d) => updateDate(d, 'dateFrom', item.id)}
              />
              <ResumeInput
                className="w-40"
                data={employer.id === item.id ? employer.dateTo : item.dateTo}
                id={item.id}
                inputType="calendar"
                key={`job-dateTo-${item.id}`}
                label="End Date"
                name="dateTo"
                placeholder="End Date"
                setButtonAction={setButtonAction}
                updateDate={(d) => updateDate(d, 'dateTo', item.id)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-4 border-b pb-4">
              <Button
                className="w-40 cursor-pointer"
                name="delete-experience"
                onClick={() => deleteById(item.id)}
                variant="outline"
              >
                Delete
              </Button>
              <Button
                className="w-40 cursor-pointer disabled:cursor-not-allowed!"
                disabled={disableSave(
                  getItemToEdit(employer, experience, item.id) as Employer,
                  authState?.resume?.experience || [],
                  item.id
                )}
                name="save-experience"
                onClick={() => saveById(item.id)}
              >
                Save
              </Button>
            </div>
          </div>
        )
      })}
      {editing.mode !== 'add' ? (
        <Button className="w-40" name="add-new-work-experience" onClick={addNew}>
          Add New
        </Button>
      ) : null}
    </div>
  )
}
