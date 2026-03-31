import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLegend } from '@/components/ui/field'
import { Field, FieldLabel } from '@/components/ui/field'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { useResume } from '@/components/providers/resume-provider'

import type { Mode, TextUpdateEvent } from './types'

const getGreeting = ({ companyName, greeting, personalize, position } : { companyName: string, greeting: string, personalize: boolean, position: string }) => {
  return personalize ? `Dear ${companyName} Hiring Manager,
I am writing to express my interest in the ${position} position at ${companyName}.` : greeting ?
        greeting.replace('{position}', position).replace('{company}', companyName) : `Dear Hiring Manager,
I am writing to express my interest in the ${position} position at your company.`
}


export const ResumeCoverLetter = () => {
  const { state, dispatch, dispatchAuth } = useResume()
  const { coverLetter } = state
  const [personalize, setPersonalize] = useState(false)
  const [mode, setMode] = useState<Mode>('view')
  
  const { body, companyName, greeting, position } = coverLetter
  const isEmpty = useMemo(() => !position || !greeting || !body, [body, greeting, position])
  const personalizedGreeting = useMemo(() => getGreeting({ companyName, greeting, personalize, position }), [companyName, personalize, position])
  
  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    dispatch({ type: 'SET_COVERLETTER', coverLetter: { ...coverLetter, [name]: value }})
  }, [])

  const setButtonAction = useCallback((mode: Mode, _id: string, value?: string) => {
    switch (mode) {
      case 'copy':
        navigator.clipboard.writeText(value || '')
        break
      case 'save':
        dispatch({ type: 'SET_COVERLETTER', coverLetter })
        dispatchAuth({ type: 'SET_RESUME', resume: { ...state, coverLetter } })
        break
      default:
        break
    }
  }, [dispatch, dispatchAuth, state, coverLetter])
  
  return (
    <>
      <FieldLegend className="font-bold border-b pb-2">Cover Letter</FieldLegend>
      <div className={`gap-4 flex ${mode === 'view' ? 'justify-between' : 'flex-col'}`}>
      {mode === 'add' || mode === 'edit' ? (
        <>
          <ResumeInput
            data={position}
            id={state.id}
            inputType="input"
            label="Job Title"
            name="position"
            placeholder="Job title"
            setButtonAction={setButtonAction}
            update={update}
          />
          <ResumeInput
            data={companyName}
            id={state.id}
            label="Company Name"
            name="companyName"
            inputType="input"
            placeholder="Personalize by adding the company name (optional)"
            setButtonAction={setButtonAction}
            update={update}
          />
          <Field className="my-8" orientation="horizontal">
            <Checkbox
              checked={personalize}
              disabled={!companyName || !position}
              name="personalize"
              onCheckedChange={(checked) => setPersonalize(checked === true)}
            />
            <FieldLabel htmlFor="personalize-cover-letter-body">
              Check to add a personalized greeting to your cover letter body.
            </FieldLabel>
          </Field>
          <ResumeInput
            data={personalizedGreeting}
            id={state.id}
            label="Cover Letter Greeting"
            name="greeting"
            inputType="textarea"
            placeholder="Add a greeting"
            setButtonAction={setButtonAction}
            update={update}
          />
          <ResumeInput
            data={body}
            id={state.id}
            label="Cover Letter Body"
            name="body"
            inputType="textarea"
            placeholder="Personalize by adding the company name (optional)"
            setButtonAction={setButtonAction}
            update={update}
          />
          <div className="flex gap-4 justify-end">
            <Button
              className="w-50 mt-4"
              name="save"
              onClick={() => setMode('view')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="w-50 mt-4"
              name="save"
              onClick={() => {
                dispatch({ type: 'SET_COVERLETTER', coverLetter })
                dispatchAuth({ type: 'SET_RESUME', resume: { ...state, coverLetter } })
              } }
              variant="outline"
            >
              Save Cover Letter
            </Button>
          </div>
        </>
      ) : (
        <Button
          className="w-50"
          name="edit"
          onClick={() => setMode('edit')}
          variant="outline"
        >
          {isEmpty ? 'Add Cover Letter' : 'Edit Cover Letter'}
        </Button>
      )}
      </div>
    </>
  )
}