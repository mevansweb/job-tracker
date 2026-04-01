import { useCallback, useEffect, useMemo } from 'react'

import equal from 'fast-deep-equal'
import { toast } from 'sonner'

import Header from '@/components/header'
import { emptyState, initialResume, localStorageKey } from '@/components/providers/const'
import { useResume } from '@/components/providers/resume-provider'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { setResume } from '@/global/shared'
import { ResumeInput } from '@/pages/resume-builder/input'

import { ResumeCoverLetter } from './coverletter'
import { ResumeExperience } from './experience'
import type { Mode } from './types'

const ResumeBuilder = () => {
  const { authState, dispatch, dispatchAuth, postData, state } = useResume()
  const { summary } = state
  const isEqual = useMemo(() => equal(authState.resume, state), [authState.resume, state])

  useEffect(() => {
    if (authState.resume === undefined && !isEqual) {
      dispatchAuth({ type: 'SET_RESUME', resume: { ...state } })
    } else if (authState.resume && equal(emptyState, state)) {
      dispatch({
        type: 'SET_ALL_DATA',
        ...authState.resume,
        certification: initialResume.certification,
        college: initialResume.college,
        employer: initialResume.employer,
        skill: initialResume.skill,
      })
    }
  }, [authState.resume, emptyState, isEqual, state])

  const saveById = useCallback(
    async (_id?: string) => {
      dispatchAuth({ type: 'SET_RESUME', resume: { ...state } })
      await setResume({
        action: 'edit',
        dispatch: dispatchAuth,
        email: authState.email,
        resume: { ...state },
        postData,
      })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...authState, resume: { ...state } }))
    },
    [authState, dispatchAuth, state]
  )

  const setButtonAction = useCallback(
    (mode: Mode, _id?: string, _name?: string, value?: string) => {
      switch (mode) {
        case 'copy':
          navigator.clipboard.writeText(value || '')
          toast.success('Copied to clipboard')
          break
        case 'save':
          saveById(_id)
          break
        default:
          break
      }
    },
    [saveById]
  )

  return (
    <div className="flex flex-col p-4">
      <Header greeting="" middle="" title="" />
      <div className="mx-auto mt-8 space-y-12 sm:w-9/8 md:w-9/10 lg:w-2/3">
        <div className="mb-8 rounded-lg border border-gray-900/10 p-8 pb-12 shadow-md">
          <FieldLegend className="border-b pb-2 text-xl! font-bold">Resume Builder</FieldLegend>
          <p className="mb-4">
            Enter your resume information and easily copy and paste to your applications!
          </p>
          <Tabs defaultValue="experience">
            <TabsList>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            </TabsList>
            <TabsContent value="experience">
              <FieldSet>
                <FieldGroup>
                  <FieldLegend className="mt-4 mb-0 border-b pb-2 font-bold">Summary</FieldLegend>
                  <ResumeInput
                    className="mt-0!"
                    data={summary}
                    id={state.id}
                    inputType="textarea"
                    label=""
                    name="summary"
                    placeholder="Professional Summary"
                    setButtonAction={setButtonAction}
                    saveById={saveById}
                    update={(event) =>
                      dispatch({ type: 'SET_SUMMARY', summary: event.target.value })
                    }
                  />
                  <ResumeExperience />
                </FieldGroup>
              </FieldSet>
            </TabsContent>
            <TabsContent value="education">Make changes to your education here.</TabsContent>
            <TabsContent value="skills">Make changes to your skills here.</TabsContent>
            <TabsContent value="certifications">
              Make changes to your certifications here.
            </TabsContent>
            <TabsContent value="cover-letter">
              <ResumeCoverLetter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
