import { useCallback, useMemo, useState } from 'react'

import { setResume } from '@/global/shared'
import { getIsEmpty } from '@/global/functions'
import { Button } from '@/components/ui/button'
import type { Employer } from '@/global/types'
import { spliceOrConcatArray } from '@/global/functions'
import { FieldLegend } from '@/components/ui/field'
import { localStorageKey } from '@/components/providers/const'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { useResume } from '@/components/providers/resume-provider'

import type { Mode, TextUpdateEvent } from './types'

export const ResumeExperience = () => {
  let newId = crypto.randomUUID()
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { experience } = state
  //console.log('authState resume', authState)
  //console.log('experience', experience)
  const [employer, setEmployer] = useState<Employer>({ company: '', dateFrom: '', dateTo: '', description: '', id: newId, location: '',  position: ''})
  
  const [editing, setEditing] = useState<{ id: string;  mode: Mode}>({ id: newId, mode: undefined})
  const isEmpty = useMemo(() => getIsEmpty(experience), [experience])
  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    setEmployer((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [setEmployer])

  const updateDate = useCallback((d: Date, name: string) => {
    setEmployer((prevData) => ({
      ...prevData,
      [name]: d.toLocaleDateString(),
    }))
  }, [setEmployer])

  const saveById = useCallback(async (id?: string) => {
    const arr = spliceOrConcatArray(employer, experience)
    dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
    dispatchAuth({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] } })
    await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, experience: arr as Employer[]}, postData })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, experience: arr as Employer[] } }))
    // reset to empty
    newId = crypto.randomUUID()
    setEditing({ id: newId, mode: undefined })
    setEmployer({ company: '', dateFrom: '', dateTo: '', description: '', id: newId, location: '',  position: ''})
  }, [dispatchAuth, state])
    

   return (
     <div className="flex flex-col gap-4">
       <FieldLegend className="font-bold border-b pb-2">Work History</FieldLegend>
       {experience.map((item) => (
          <div key={`job-history-section-${item.id}`}>
            <ResumeInput
              data={item.position}
              inputType="input"
              key={`job-title-${item.id}`}
              label="Job Title"
              name="position"
              parentMode={editing.id === item.id ? editing.mode : undefined}
              placeholder="Job title"
              update={update}
            />
            <ResumeInput
              data={item.company}
              inputType="input"
              key={`job-company-${item.id}`}
              label="Employer"
              name="company"
              parentMode={editing.id === item.id ? editing.mode : undefined}
              placeholder="Employer"
              update={update}
            />
            <ResumeInput
              data={item.description}
              inputType="textarea"
              key={`job-desc-${item.id}`}
              label="Job Description"
              name="description"
              parentMode={editing.id === item.id ? editing.mode : undefined}
              placeholder="Job Description"
              update={update}
            />
            <div className="flex gap-4">
              <ResumeInput
                data={item.dateFrom}
                inputType="calendar"
                key={`job-dateFrom-${item.id}`}
                label="Start Date"
                name="dateFrom"
                parentMode={editing.id === item.id ? editing.mode : undefined}
                placeholder="End Date"
                updateDate={updateDate}
              />
              <ResumeInput
                data={item.dateTo}
                inputType="calendar"
                key={`job-dateTo-${item.id}`}
                label="End Date"
                name="dateTo"
                parentMode={editing.id === item.id ? editing.mode : undefined}
                placeholder="End Date"
                updateDate={updateDate}
                />
           </div>
           <div className="flex gap-4 justify-end mt-4">
            {/* <Button
              className="w-50"
              name="edit-experience"
              onClick={() => {
                setEditing({ id: item.id, mode: 'edit' })
                setEmployer(item)
              }}
              variant="outline"
            >
              Edit
            </Button> */}
            <Button
              className="w-50"
              name="save-experience"
              onClick={() => saveById(item.id)}
              variant="outline"
            >
              Save
             </Button>
            </div>
          </div>
       ))}
       {!isEmpty ? (
        <Button
          className="w-50"
          name="add-new-work-experience"
           onClick={() => {
            setEditing({ id: crypto.randomUUID(), mode: 'add'})
          }}
          variant="outline"
        >
          Add New
        </Button>
       ) : null }
       
       {isEmpty || editing.mode === 'add' ? (
         <>
         <ResumeInput
            data={employer.position}
            inputType="input"
            key={`job-experience-${newId}`}
            label="Job Title"
            name="position"
            parentMode="add"
            placeholder="Job title"
            update={update}
           />
          <ResumeInput  
            data={employer.company}
            inputType="input"
            key={`job-company-${newId}`}
            label="Employer"
            name="company"
            parentMode="add"
            placeholder="Employer"
            update={update}
           />
          <ResumeInput
            data={employer.description}
            inputType="textarea"
            key={`job-desc-${newId}`}
            label="Job Description"
            name="description"
            parentMode="add"
            placeholder="Job Description"
            update={update}
           />
           <div className="flex gap-4">
             <ResumeInput
                data={employer.dateFrom}
                inputType="calendar"
                key={`job-dateFrom-empty`}
                label="Start Date"
                name="dateFrom"
                parentMode="add"
                placeholder="End Date"
                updateDate={updateDate}
              />
              <ResumeInput
                data={employer.dateTo}
                inputType="calendar"
                key={`job-dateTo-empty`}
                label="End Date"
                name="dateTo"
                parentMode="add"
                placeholder="End Date"
                updateDate={updateDate}
              />
           </div>
           <div className="flex justify-end">
             <Button
                className="w-50"
                name="save-new-experience"
                onClick={() => saveById(employer.id)}
                variant="outline"
              >
                Save
              </Button>
           </div>
        </>
       ) : null}
    </div>
  )
}