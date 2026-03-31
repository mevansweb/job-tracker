import { useCallback, useState } from 'react'

import equal from 'fast-deep-equal/es6/react'

import { setResume } from '@/global/shared'
import { Button } from '@/components/ui/button'
import type { Employer } from '@/global/types'
import { spliceOrConcatArray } from '@/global/functions'
import { FieldLegend } from '@/components/ui/field'
import { localStorageKey } from '@/components/providers/const'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { useResume } from '@/components/providers/resume-provider'

import type { Mode, TextUpdateEvent } from './types'

const editedEmployer = (experience: Employer[], employer: Employer, id: string) => {
  let employerToUpdate = employer
  if (id && id !== employer.id) {
    const found = experience.find((exp) => exp.id === id)
    if (found) {
      employerToUpdate = found
    }
  }
  return employerToUpdate
}

function disableSave(localCopy: Employer[], apiCopy: Employer[], id: string) {
  const local = localCopy.find((item) => item.id === id)
  const original = apiCopy.find((item) => item.id === id)
  if (!original || !local) return false // should not disable if either copy is missing, user may have added or deleted an experience and should be allowed to save
  return equal(local, original)
}

export const ResumeExperience = () => {
  const[newId, setNewId] = useState<string>(crypto.randomUUID())
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { employer, experience } = state
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({ id: newId, mode: undefined })

  const setButtonAction = useCallback((mode: Mode, id: string, value?: string) => {
    const current = editedEmployer(experience, employer, id)
    switch (mode) {
      case 'edit':
        setEditing({ id, mode })
        dispatch({ type: 'SET_EMPLOYER', employer: current })
        break
      case 'copy':
        navigator.clipboard.writeText(value || '')
        break
      case 'save':
        saveById(id)
        break
      default:
        break
    }
  }, [experience, employer,newId, setEditing])

  const update = useCallback((event: TextUpdateEvent, id?: string) => {
    const { name, value } = event.target
    const edited = editedEmployer(experience, employer, id || '')
    const updated = {
      ...edited,
      [name]: value,
    }
    dispatch({ type: 'SET_EMPLOYER', employer: updated })
    const arr = spliceOrConcatArray(updated, experience)
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
  }, [employer, experience, dispatch])

  const updateDate = useCallback(async (d: Date, name: string, id?: string) => {
    let edited = editedEmployer(experience, employer, id || '')
    edited = {
      ...edited,
      [name]: d.toLocaleDateString(),
    }
    dispatch({ type: 'SET_EMPLOYER', employer: {...edited} })
  }, [employer, experience, dispatch])

  const saveById = useCallback(async (id?: string) => {
    const arr = spliceOrConcatArray(employer, experience)
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
    dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
    await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, experience: arr as Employer[]}, postData })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } }))
    setEditing({ id: id || employer.id, mode: 'view' })
  }, [dispatchAuth, state])

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setNewId(nextId)
    setEditing({ id: nextId, mode: 'add' })
    dispatch({ type: 'SET_EMPLOYER', employer: { company: '', dateFrom: '', dateTo: '', id: nextId, description: '', location: '', position: '' } })
  }, [employer, setEditing, dispatch])

  const deleteById = useCallback(async (id: string) => {
    const arr = experience.filter((item) => item.id !== id)
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
    dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
    await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, experience: arr as Employer[]}, postData })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } }))
  }, [dispatchAuth, state])

   return (
     <div className="flex flex-col gap-4">
       <FieldLegend className="font-bold border-b pb-2">Work History</FieldLegend>
       {experience.map((item, i) => {
         return (
           <div key={`job-history-section-${item.id}`}>
             <ResumeInput
               className={i === 0 ? 'mt-0!' : ''}
               data={employer.id === item.id ? employer.position : item.position}
               id={item.id}
               inputType="input"
               key={`job-title-${item.id}`}
               label="Job Title"
               name="position"
               parentMode={editing.id === item.id ? editing.mode : undefined}
               placeholder="Job title"
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
               parentMode={editing.id === item.id ? editing.mode : undefined}
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
               parentMode={editing.id === item.id ? editing.mode : undefined}
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
                 parentMode={editing.id === item.id ? editing.mode : undefined}
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
                 parentMode={editing.id === item.id ? editing.mode : undefined}
                 placeholder="End Date"
                 setButtonAction={setButtonAction}
                 updateDate={(d) => updateDate(d, 'dateTo', item.id)}
                 warning={employer.id === item.id ? employer.dateTo.length === 0 : item.dateTo.length === 0 ? true : false}
               />
             </div>
             <div className="flex gap-4 justify-end mt-4 border-b pb-4">
              <Button
                 className="w-40"
                 name="delete-experience"
                 onClick={() => deleteById(item.id)}
                 variant="outline"
               >
                 Delete
               </Button>
               <Button
                 className="w-40"
                 disabled={disableSave(state.experience, authState?.resume?.experience || [], item.id)}
                 name="save-experience"
                 onClick={() => saveById(item.id)}
                 variant="outline"
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
            variant="outline"
          >
            Add New
         </Button>
        ) : null}
       
       {editing.mode === 'add' ? (
         <div className={experience.length > 0 ? 'border-t pt-8 flex flex-col gap-4' : ''}>
            <ResumeInput
              data={employer.position}
              id={employer.id}
              inputType="input"
              key={`job-experience-${employer.id}`}
              label="Job Title"
              name="position"
              parentMode="add"
              placeholder="Job title"
             setButtonAction={setButtonAction}
              update={(event) => update(event, employer.id)}
            />
            <ResumeInput  
              data={employer.company}
              id={employer.id}
              inputType="input"
              key={`job-company-${employer.id}`}
              label="Employer"
              name="company"
              parentMode="add"
              placeholder="Employer"
              setButtonAction={setButtonAction}
              update={(event) => update(event, employer.id)}
            />
            <ResumeInput
              data={employer.description}
              id={employer.id}
              inputType="textarea"
              key={`job-desc-${employer.id}`}
              label="Job Description"
              name="description"
              parentMode="add"
              placeholder="Job Description"
              setButtonAction={setButtonAction}
              update={(event) => update(event, employer.id)}
            />
           <div className="flex gap-4">
             <ResumeInput
                className="w-40"
                data={employer.dateFrom}
                id={employer.id}
                inputType="calendar"
                key={`job-dateFrom-empty`}
                label="Start Date"
                name="dateFrom"
                parentMode="add"
                placeholder="End Date"
                setButtonAction={setButtonAction}
                updateDate={(d) => updateDate(d, 'dateFrom', employer.id)}
              />
             <ResumeInput
                className="w-40"
                data={employer.dateTo}
                id={employer.id}
                inputType="calendar"
                key={`job-dateTo-empty`}
                label="End Date"
                name="dateTo"
                parentMode="add"
                placeholder="End Date"
                setButtonAction={setButtonAction}
                updateDate={(d) => updateDate(d, 'dateTo', employer.id)}
              />
           </div>
           <div className="flex justify-center mt-4">
             <Button
                className="w-40"
                name="save-new-experience"
                onClick={() => saveById(employer.id)}
                variant="outline"
              >
                Save
              </Button>
           </div>
        </div>
       ) : null }
    </div>
  )
}