import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { FieldLegend } from '@/components/ui/field'
import { disableSave, spliceOrConcatArray } from '@/global/functions'
import { getItemToEdit } from '@/global/functions'
import { setResume } from '@/global/shared'
import type { Certification, Education } from '@/global/types'
import { ResumeInput } from '@/pages/resume-builder/input'

import type { Mode, TextUpdateEvent } from './types'

export const ResumeCertifications = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { certifications } = state
  const [certification, setCertification] = useState<Certification>({
    id: crypto.randomUUID(),
    name: '',
    date: '',
  })
  const original = useMemo(
    () => authState?.resume?.certifications?.find((item) => item.id === certification.id),
    [authState, certification]
  )
  const [editing, setEditing] = useState<{ id: string; mode: Mode }>({
    id: crypto.randomUUID(),
    mode: undefined,
  })

  const saveById = useCallback(
    async (id?: string) => {
      try {
        const arr = spliceOrConcatArray(certification, certifications)
        dispatch({ type: 'SET_CERTIFICATIONS', certifications: arr as Certification[] })
        dispatchAuth({
          type: 'SET_RESUME',
          resume: { ...state, certifications: arr as Certification[] },
        })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, certifications: arr as Certification[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            ...authState,
            resume: { ...state, certifications: arr as Certification[] },
          })
        )
        setEditing({ id: id || certification.id, mode: 'view' })
        toast.success('Saved successfully')
      } catch (error) {
        toast.error(`Error saving work history: ${error}`)
      }
    },
    [certification, certifications, dispatch, dispatchAuth, state, authState, postData]
  )

  const setButtonAction = useCallback(
    async (mode: Mode, id: string, _name?: string, value?: string) => {
      const current = getItemToEdit(certification, certifications, id)
      switch (mode) {
        case 'copy':
          await navigator.clipboard.writeText(value || '')
          toast.success('Copied to clipboard')
          break
        case 'edit':
          setEditing({ id, mode })
          setCertification(current as Certification)
          break
        case 'save':
          await saveById(id)
          break
        case 'undo': {
          const original = authState?.resume?.certifications?.find((item) => item.id === id)
          if (original) {
            setCertification(original)
          }
          setEditing({ id, mode: 'view' })
          break
        }
        default:
          break
      }
    },
    [certification, certifications, saveById, authState?.resume?.certifications]
  )

  const update = useCallback(
    (event: TextUpdateEvent, id?: string) => {
      const { name, value } = event.target
      const edited = getItemToEdit(certification, certifications, id || '')
      const updated = {
        ...edited,
        [name]: value,
      }
      setCertification(updated as Certification)
    },
    [certification, certifications, setCertification]
  )

  const updateDate = useCallback(
    async (d: Date, name: string, id?: string) => {
      let edited = getItemToEdit(certification, certifications, id || '')
      edited = {
        ...edited,
        [name]: d.toLocaleDateString(),
      }
      setCertification(edited as Certification)
    },
    [certification, certifications, setCertification]
  )

  const addNew = useCallback(() => {
    const nextId = crypto.randomUUID()
    setEditing({ id: nextId, mode: 'add' })
    setCertification({
      id: nextId,
      name: '',
      date: '',
    })
    const arr = spliceOrConcatArray(
      {
        id: nextId,
        name: '',
        degree: '',
        gpa: '',
        date: '',
        dateTo: '',
      },
      certifications
    )
    dispatch({ type: 'SET_CERTIFICATIONS', certifications: arr as Certification[] })
  }, [dispatch, certifications, setEditing])

  const deleteById = useCallback(
    async (id: string) => {
      try {
        const arr = certifications.filter((item) => item.id !== id)
        dispatch({ type: 'SET_CERTIFICATIONS', certifications: arr as Certification[] })
        dispatchAuth({
          type: 'SET_RESUME',
          resume: { ...state, certifications: arr as Certification[] },
        })
        await setResume({
          dispatch: dispatchAuth,
          email: authState.email,
          resume: { ...state, certifications: arr as Certification[] },
          postData,
        })
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            ...authState,
            resume: { ...state, certifications: arr as Certification[] },
          })
        )
        toast.success('Deleted successfully')
      } catch (error) {
        toast.error(`Error deleting work history: ${error}`)
      }
    },
    [authState, certifications, dispatch, dispatchAuth, postData, state]
  )

  return (
    <div className="flex flex-col gap-4">
      <FieldLegend className="mt-4 border-b pb-2 font-bold">Certifications</FieldLegend>
      {certifications.map((item) => {
        return (
          <div className="" key={`certification-section-${item.id}`}>
            <ResumeInput
              data={certification.id === item.id ? certification.name : item.name}
              id={item.id}
              inputType="input"
              key={`certificate-name-${item.id}`}
              label="Certification Name"
              name="name"
              originalData={original?.name}
              placeholder="Certificate Name"
              saveById={saveById}
              setButtonAction={setButtonAction}
              update={(event) => update(event, item.id)}
            />
            <div className="flex justify-start gap-4">
              <ResumeInput
                className="w-40"
                data={certification.id === item.id ? certification.date : item.date}
                id={item.id}
                inputType="calendar"
                key={`certificate-date-${item.id}`}
                label="Certificate Date"
                name="date"
                placeholder="Certificate Date"
                setButtonAction={setButtonAction}
                updateDate={(d) => updateDate(d, 'date', item.id)}
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-4 border-b pb-4">
              <Button
                className="w-40 cursor-pointer"
                name="delete-certifications"
                onClick={() => deleteById(item.id)}
                variant="outline"
              >
                Delete
              </Button>
              <Button
                className="w-40 cursor-pointer disabled:cursor-not-allowed!"
                disabled={disableSave(
                  getItemToEdit(certification, certifications, item.id) as Education,
                  authState?.resume?.certifications || [],
                  item.id
                )}
                name="save-certifications"
                onClick={() => saveById(item.id)}
              >
                Save
              </Button>
            </div>
          </div>
        )
      })}
      {editing.mode !== 'add' ? (
        <Button className="w-40" name="add-new-work-certifications" onClick={addNew}>
          Add New
        </Button>
      ) : null}
    </div>
  )
}
