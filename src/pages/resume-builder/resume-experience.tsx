import { useCallback, useMemo, useState } from 'react'

import equal from 'fast-deep-equal/es6/react'
import { toast } from 'sonner'

import { setResume } from '@/global/shared'
import { Button } from '@/components/ui/button'
import type { Employer } from '@/global/types'
import { spliceOrConcatArray } from '@/global/functions'
import { FieldLegend } from '@/components/ui/field'
import { localStorageKey } from '@/components/providers/const'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { useResume } from '@/components/providers/resume-provider'

import type { Mode, TextUpdateEvent } from './types'

const getItemToEdit = (experience: Employer[], employer: Employer, id: string) => {
  let employerToUpdate = employer
  if (id && id !== employer.id) {
    const found = experience.find((exp) => exp.id === id)
    if (found) {
      employerToUpdate = found
    }
  }
  return employerToUpdate
}

function disableSave(localCopy: Employer, apiCopy: Employer[], id: string) {
  const local = localCopy
  const original = apiCopy.find((item) => item.id === id)
  if (!original || !local) return false // should not disable if either copy is missing, user may have added or deleted an experience and should be allowed to save
  return equal(local, original)
}

export const ResumeExperience = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { employer, experience } = state
  const original = useMemo(() => authState?.resume?.experience?.find((item) => item.id === employer.id), [authState, employer])
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({ id: crypto.randomUUID(), mode: undefined })

  const setButtonAction = useCallback((mode: Mode, id: string, _name?: string, value?: string) => {
    const current = getItemToEdit(experience, employer, id)
    switch (mode) {
      case 'copy':
        navigator.clipboard.writeText(value || '')
        toast.success('Copied to clipboard')
        break
      case 'edit':
        setEditing({ id, mode })
        dispatch({ type: 'SET_EMPLOYER', employer: current })
        break
      case 'save':
        saveById(id)
        break
      case 'undo':
        const original = authState?.resume?.experience?.find((item) => item.id === id)
        if (original) {
          dispatch({ type: 'SET_EMPLOYER', employer: original })
        }
        setEditing({ id, mode: 'view' })
        break
      default:
        break
    }
  }, [experience, employer, setEditing])

  const update = useCallback((event: TextUpdateEvent, id?: string) => {
    const { name, value } = event.target
    const edited = getItemToEdit(experience, employer, id || '')
    const updated = {
      ...edited,
      [name]: value,
    }
    dispatch({ type: 'SET_EMPLOYER', employer: updated })
  }, [employer, experience, dispatch])

  const updateDate = useCallback(async (d: Date, name: string, id?: string) => {
    let edited = getItemToEdit(experience, employer, id || '')
    edited = {
      ...edited,
      [name]: d.toLocaleDateString(),
    }
    dispatch({ type: 'SET_EMPLOYER', employer: {...edited} })
  }, [employer, experience, dispatch])

  const saveById = useCallback(async (id?: string) => {
    try {
      const arr = spliceOrConcatArray(employer, experience)
      dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
      dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
      await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, experience: arr as Employer[]}, postData })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } }))
      setEditing({ id: id || employer.id, mode: 'view' })
      toast.success('Saved successfully')
    } catch (error) {
      toast.error('Error saving work history')
    }   
  }, [dispatch, dispatchAuth, employer, experience, setEditing, setResume, state])

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setEditing({ id: nextId, mode: 'add' })
    dispatch({ type: 'SET_EMPLOYER', employer: { company: '', dateFrom: '', dateTo: '', id: nextId, description: '', location: '', position: '' } })
    const arr = spliceOrConcatArray({ company: '', dateFrom: '', dateTo: '', id: nextId, description: '', location: '', position: '' }, experience)
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
  }, [dispatch, employer, experience, setEditing ])

  const deleteById = useCallback(async (id: string) => {
    try {
      const arr = experience.filter((item) => item.id !== id)
      dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
      dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
      await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, experience: arr as Employer[]}, postData })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } }))
      toast.success('Deleted successfully')
    } catch (error) {
      toast.error('Error deleting work history')
    }
  }, [dispatchAuth, state])

   return (
     <div className="flex flex-col gap-4">
       <FieldLegend className="font-bold border-b pb-2">Work History</FieldLegend>
       {experience.map((item, i) => {
         return (
           <div className="" key={`job-history-section-${item.id}`}>
             <ResumeInput
               className={i === 0 ? 'mt-0!' : ''}
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
               warning={employer.id === item.id ? employer.position.length === 0 : item.position.length === 0 ? false : true}
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
               warning={employer.id === item.id ? employer.company.length === 0 : item.company.length === 0 ? true : false}
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
                 warning={employer.id === item.id ? employer.dateFrom.length === 0 : item.dateFrom.length === 0 ? true : false}
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
                 warning={employer.id === item.id ? employer.dateTo.length === 0 : item.dateTo.length === 0 ? true : false}
               />
             </div>
             <div className="flex gap-4 justify-end mt-4 border-b pb-4">
              <Button
                 className="w-40 cursor-pointer"
                 name="delete-experience"
                 onClick={() => deleteById(item.id)}
                 variant="secondary"
               >
                 Delete
               </Button>
               <Button
                 className="w-40 cursor-pointer disabled:cursor-not-allowed!"
                 disabled={disableSave(getItemToEdit(experience, employer, item.id), authState?.resume?.experience || [], item.id)}
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
          <Button
            className="w-40"
            name="add-new-work-experience"
            onClick={addNew}
          >
            Add New
         </Button>
        ) : null}
    </div>
  )
}