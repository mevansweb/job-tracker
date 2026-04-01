import { useCallback, useMemo, useState } from 'react'

import equal from 'fast-deep-equal/es6/react'
import { toast } from 'sonner'
import { BookCopy } from 'lucide-react'

import { setResume } from '@/global/shared'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLegend } from '@/components/ui/field'
import { Field, FieldLabel } from '@/components/ui/field'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { useResume } from '@/components/providers/resume-provider'

import type { Mode, TextUpdateEvent } from './types'
import type { CoverLetter } from '@/global/types'
import { localStorageKey } from '@/components/providers/const'

const getGreeting = ({ companyName, greeting, personalize, position } : { companyName: string, greeting: string, personalize: boolean, position: string }) => {
  return personalize ? `Dear ${companyName} Hiring Manager,
I am writing to express my interest in the ${position} position at ${companyName}.` : greeting ?
        greeting.replace('{position}', position).replace('{company}', companyName) : `Dear Hiring Manager,
I am writing to express my interest in the ${position} position at your company.`
}

function disableSave(data: CoverLetter, originalData: CoverLetter) {
  if (originalData && data) {
    return equal(data, originalData)
  }
  return false
}

export const ResumeCoverLetter = () => {
  const { state, dispatch, dispatchAuth, authState, postData } = useResume()
  const { coverLetter } = state
  const { body, companyName, greeting, position } = coverLetter

  const [personalize, setPersonalize] = useState(greeting ? greeting.includes('{company}') && greeting.includes('{position}') : false)
  const personalizedGreeting = useMemo(() => getGreeting({ companyName, greeting, personalize, position }), [companyName, personalize, position])
  const coverLetterText = useMemo(() => {
    return `${personalizedGreeting}

${body}`
   }, [personalizedGreeting, body])
  
  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    dispatch({ type: 'SET_COVERLETTER', coverLetter: { ...coverLetter, [name]: value } })
  }, [dispatch, coverLetter])

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

  const save = useCallback(async () => {
    try {
      dispatch({ type: 'SET_COVERLETTER', coverLetter })
      dispatchAuth({ type: 'SET_RESUME', resume: { ...state, coverLetter } })
      await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state, coverLetter}, postData })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state, coverLetter } }))
      toast.success('Saved successfully')
    } catch (error) {
      toast.error('Failed to save cover letter')
    }
  }, [dispatch, dispatchAuth, state, coverLetter])
  
  return (
    <div className="mt-4">
      <FieldLegend className="font-bold border-b pb-2">Cover Letter</FieldLegend>
      <div className="gap-4 flex flex-col">
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
        <ResumeInput
          data={greeting ? personalizedGreeting : ''}
          id={state.id}
          instructions="Use {position} and {company} as placeholders for position name and company name. Check the box to automatically personalize your greeting with the company name and position."
          label="Cover Letter Greeting"
          name="greeting"
          inputType="textarea"
          placeholder="Example: Dear {company} Hiring Manager, I am writing to express my interest in the {position} position at {company}."
          setButtonAction={setButtonAction}
          update={update}
          />
        <Field className="mt-4" orientation="horizontal">
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
            className="w-50 mt-4 cursor-pointer"
            name="save"
            onClick={() => setButtonAction('copy', state.id, coverLetterText)}
            variant="outline"
          >
            <BookCopy data-icon="inline-start" className="w-4 h-4 mr-2" />
            Copy Letter
          </Button>
          <Button
            className="w-50 mt-4 cursor-pointer disabled:cursor-not-allowed"
            disabled={disableSave(coverLetter, authState.resume?.coverLetter as CoverLetter)}
            name="save"
            onClick={save}
          >
            Save Cover Letter
          </Button>
        </div>
      </div>
    </div>
  )
}