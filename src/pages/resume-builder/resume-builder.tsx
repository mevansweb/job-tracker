import { useCallback, useEffect, useMemo } from 'react'

import equal from 'fast-deep-equal'

import { ResumeCoverLetter } from './resume-coverletter'
import { ResumeExperience } from './resume-experience'
import Header from '@/components/header'
import { setResume } from '@/global/shared'
import { emptyState, initialResume, localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/resume-provider'
import { ResumeInput } from '@/pages/resume-builder/resume-input'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'

import type { Mode } from './types'

const ResumeBuilder = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { summary } = state
  const isEqual = useMemo(() => equal(authState.resume, state), [authState.resume, state])

  useEffect(() => {
    if (authState.resume === undefined && !isEqual) {
      dispatchAuth({ type: 'SET_RESUME', resume: {...state}})
    } else if (authState.resume && equal(emptyState, state)) {
      dispatch({
        type: 'SET_ALL_DATA',
        ...authState.resume,
        certification: initialResume.certification,
        college: initialResume.college,
        employer: initialResume.employer,
        skill: initialResume.skill
      })
    }
  }, [authState.resume, emptyState, isEqual, state])

  const save = useCallback(async () => {
    dispatchAuth({ type: 'SET_RESUME', resume: { ...state } })
    await setResume({ action: 'edit', dispatch: dispatchAuth, email: authState.email, resume: {...state}, postData })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state}}))
  }, [dispatchAuth, state])

  const setButtonAction = useCallback((mode: Mode, _id?: string, value?: string) => {
    switch (mode) {
      case 'copy':
        navigator.clipboard.writeText(value || '')
        break
      case 'save':
        save()
        break
      default:
        break
    }
  }, [save])
  
  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="" 
        middle="" 
        title=""
      />
      <div className="md:w-9/10 sm:w-9/8 lg:w-2/3 mt-8 mx-auto space-y-12">
        <div className="border border-gray-900/10 rounded-lg shadow-md p-8 mb-8 pb-12">
          <FieldLegend className="font-bold border-b pb-2 text-xl!">Resume Editor</FieldLegend>
          <FieldSet>
            <FieldDescription>Enter your resume information here so you can easily copy and paste to your applications!</FieldDescription>
            <FieldGroup>
              <ResumeInput
                className="mt-0!"
                data={summary}
                id={state.id}
                inputType="textarea"
                label="Summary"
                name="summary"
                placeholder="Professional Summary"
                setButtonAction={setButtonAction}
                save={save}
                update={(event) => dispatch({ type: 'SET_SUMMARY', summary: event.target.value })}
              />
              <ResumeExperience />
              <ResumeCoverLetter />
            </FieldGroup>
          </FieldSet>         
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder