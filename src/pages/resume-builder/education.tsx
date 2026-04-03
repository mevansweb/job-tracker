import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/resume-provider'
import { Button } from '@/components/ui/button'
import { FieldLegend } from '@/components/ui/field'
import { disableSave, spliceOrConcatArray } from '@/global/functions'
import { getItemToEdit } from '@/global/functions'
import { setResume } from '@/global/shared'
import type { Education } from '@/global/types'
import { ResumeInput } from '@/pages/resume-builder/input'

import type { Mode, TextUpdateEvent } from './types'

export const ResumeEducation = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { college, education } = state
  const original = useMemo(
    () => authState?.resume?.education?.find((item) => item.id === college.id),
    [authState, college]
  )
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({
    id: crypto.randomUUID(),
    mode: undefined,
  })

  const setButtonAction = useCallback(
    (mode: Mode, id: string, _name?: string, value?: string) => {
      const current = getItemToEdit(college, education, id)
      switch (mode) {
        case 'copy':
          navigator.clipboard.writeText(value || '')
          toast.success('Copied to clipboard')
          break
        case 'edit':
          setEditing({ id, mode })
          dispatch({ type: 'SET_COLLEGE', college: current as Education })
          break
        case 'save':
          saveById(id)
          break
        case 'undo':
          const original = authState?.resume?.education?.find((item) => item.id === id)
          if (original) {
            dispatch({ type: 'SET_COLLEGE', college: original })
          }
          setEditing({ id, mode: 'view' })
          break
        default:
          break
      }
    },
    [education, college, setEditing]
  )

  const update = useCallback(
    (event: TextUpdateEvent, id?: string) => {
      const { name, value } = event.target
      const edited = getItemToEdit(college, education, id || '')
      const updated = {
        ...edited,
        [name]: value,
      }
      dispatch({ type: 'SET_COLLEGE', college: updated as Education })
    },
    [college, education, dispatch]
  )

  const updateDate = useCallback(
    async (d: Date, name: string, id?: string) => {
      let edited = getItemToEdit(college, education, id || '')
      edited = {
        ...edited,
        [name]: d.toLocaleDateString(),
      }
      dispatch({ type: 'SET_COLLEGE', college: { ...(edited as Education) } })
    },
    [college, education, dispatch]
  )

  const saveById = useCallback(
    async (id?: string) => {
      try {
        const arr = spliceOrConcatArray(college, education)
        dispatch({ type: 'SET_EDUCATION', education: arr as Education[] })
        dispatchAuth({ type: 'SET_RESUME', resume: { ...state, education: arr as Education[] } })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, education: arr as Education[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ ...authState, resume: { ...state, education: arr as Education[] } })
        )
        setEditing({ id: id || college.id, mode: 'view' })
        toast.success('Saved successfully')
      } catch (error) {
        toast.error('Error saving work history')
      }
    },
    [dispatch, dispatchAuth, college, education, setEditing, setResume, state]
  )

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setEditing({ id: nextId, mode: 'add' })
    dispatch({
      type: 'SET_COLLEGE',
      college: {
        id: nextId,
        institutionName: '',
        degree: '',
        gpa: '',
        dateFrom: '',
        dateTo: '',
      },
    })
    const arr = spliceOrConcatArray(
      {
        id: nextId,
        institutionName: '',
        degree: '',
        gpa: '',
        dateFrom: '',
        dateTo: '',
      },
      education
    )
    dispatch({ type: 'SET_EDUCATION', education: arr as Education[] })
  }, [dispatch, college, education, setEditing])

  const deleteById = useCallback(
    async (id: string) => {
      try {
        const arr = education.filter((item) => item.id !== id)
        dispatch({ type: 'SET_EDUCATION', education: arr as Education[] })
        dispatchAuth({ type: 'SET_RESUME', resume: { ...state, education: arr as Education[] } })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, education: arr as Education[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ ...authState, resume: { ...state, education: arr as Education[] } })
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
      <FieldLegend className="mt-4 border-b pb-2 font-bold">Education History</FieldLegend>
      {education.map((item) => {
        return (
          <div className="" key={`job-history-section-${item.id}`}>
            <ResumeInput
              data={college.id === item.id ? college.institutionName : item.institutionName}
              id={item.id}
              inputType="input"
              key={`institution-name-${item.id}`}
              label="Institution Name"
              name="institutionName"
              originalData={original?.institutionName}
              placeholder="Institution Name"
              saveById={saveById}
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <ResumeInput
              data={college.id === item.id ? college.degree : item.degree}
              id={item.id}
              inputType="input"
              key={`degree-${item.id}`}
              label="Degree"
              name="degree"
              originalData={original?.degree}
              placeholder="Degree"
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <ResumeInput
              data={college.id === item.id ? college.gpa : item.gpa}
              id={item.id}
              inputType="textarea"
              key={`gpa-${item.id}`}
              label="GPA"
              name="gpa"
              originalData={original?.gpa ?? ''}
              placeholder="GPA"
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <div className="flex justify-start gap-4">
              <ResumeInput
                className="w-40"
                data={college.id === item.id ? college.dateFrom : item.dateFrom}
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
                data={college.id === item.id ? college.dateTo : item.dateTo}
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
                name="delete-education"
                onClick={() => deleteById(item.id)}
                variant="outline"
              >
                Delete
              </Button>
              <Button
                className="w-40 cursor-pointer disabled:cursor-not-allowed!"
                disabled={disableSave(
                  getItemToEdit(college, education, item.id) as Education,
                  authState?.resume?.education || [],
                  item.id
                )}
                name="save-education"
                onClick={() => saveById(item.id)}
              >
                Save
              </Button>
            </div>
          </div>
        )
      })}
      {editing.mode !== 'add' ? (
        <Button className="w-40" name="add-new-work-education" onClick={addNew}>
          Add New
        </Button>
      ) : null}
    </div>
  )
}
