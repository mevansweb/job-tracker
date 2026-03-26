import { useCallback, useMemo, useState } from 'react'

import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Certification, CoverLetter, Education, Employer, Resume, Skill } from '@/global/types'

type Mode = 'add' | 'view' | 'edit'

type SectionData = string | Certification[]  | CoverLetter | Education[] | Employer[] | Skill[]

type TextUpdateEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>

const initialResume: Resume = {
  coverLetter: {
    body: '',
    companyName: '',
    greeting: '',
    position: '',
  },
  certifications: [],
  education: [],
  experience: [],
  id: '',
  summary: '',
  skills: [],
  lastUpdate: '',
}

type UpdateProps = {
  className?: string
  data: SectionData
  inputType: 'input' | 'textarea'
  label: string
  name: string
  placeholder: string
  update: (event: TextUpdateEvent) => void
}

const getIsEmpty = (data: SectionData) => {
  if (typeof data === 'string' && !data) { 
    return true
  }
  if (typeof data === 'object') {
    if (Array.isArray(data) && data.length === 0) { 
      return true
    } else {
      return Object.values(data).every(value => {
        if (value === null || value === undefined || value === '') {
            return true
        }
        if (Array.isArray(value) && value.length === 0) {
            return true
        }
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true
        }
        return false
      })
    }
  }
  return false
}

const Section = ({ className = '', data, inputType, label, name, placeholder, update }: UpdateProps) => {
  const [mode, setMode] = useState<Mode>('view')
  const isEmpty = useMemo(() => getIsEmpty(data), [data])

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <Label className="text-lg" htmlFor={name}>{label}</Label>
      <div className="">
        {typeof data === 'string' ? (
          <>
            {mode === 'edit' || isEmpty ? (
              <div className="flex gap-4">
                {inputType === 'input' ? (
                  <Input
                    name={name}
                    onChange={update}
                    placeholder={placeholder}
                    value={data}
                  />
                ) : (
                  <Textarea
                    name={name}
                    onChange={update}
                    placeholder={placeholder}
                    value={data}
                  />
                )}
                
                <Button
                  className=""
                  onClick={() => setMode('view')}
                  variant="outline"
                >
                  {isEmpty ? 'Add' : 'Save'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex">
                  <Button
                    className=""
                    onClick={() => setMode('edit')}
                    variant="outline"
                  >
                    Edit 
                  </Button>
                </div>
                {data}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

const CoverLetter = ({ data, update }: { data: CoverLetter, update: (name: string, data: Object ) => void }) => {
  const [coverLetter, setCoverLetter] = useState(data)
  const [personalize, setPersonalize] = useState(false)
  const [mode, setMode] = useState<Mode>('view')
  
  const { body, companyName, greeting, position } = coverLetter
  const isEmpty = useMemo(() => !position || !greeting || !body, [body, greeting, position])
  const personalizedGreeting = useMemo(() => {
    return personalize ? `Dear ${companyName} Hiring Manager,
I am writing to express my interest in the ${position} position at ${companyName}.` : greeting ?
        greeting : `Dear Hiring Manager,
I am writing to express my interest in the ${position} position at your company.
    `
  }, [companyName, personalize, position])
  
  const localUpdate = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    setCoverLetter((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])
  
  return (
    <div className={`flex ${mode === 'view' ? 'justify-between' : 'flex-col'}`}>
      <Label className="text-lg my-4">Cover Letter</Label>
      {mode === 'add' || mode === 'edit' ? (
        <>
          <Section
            className="mt-6"
            data={position}
            inputType="input"
            label="Job Title"
            name="position"
            placeholder="Job title"
            update={localUpdate}
          />
          <Section
            className="mt-6"
            data={companyName}
            label="Company Name"
            name="companyName"
            inputType="input"
            placeholder="Personalize by adding the company name (optional)"
            update={localUpdate}
          />
          <FieldGroup className="mt-4">
            <Field orientation="horizontal">
              <Checkbox
                name="personalize"
                onCheckedChange={(checked) => setPersonalize(checked === true)}
                checked={personalize}
              />
              <FieldLabel htmlFor="personalize-cover-letter-body">
                Check to add a personalized greeting to your cover letter body.
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Section
            className="mt-6"
            data={personalizedGreeting}
            label="Cover Letter Greeting"
            name="greeting"
            inputType="textarea"
            placeholder="Add a greeting"
            update={localUpdate}
          />
          <Section
            className="mt-6"
            data={body}
            label="Cover Letter Body"
            name="body"
            inputType="textarea"
            placeholder="Personalize by adding the company name (optional)"
            update={localUpdate}
          />
          <Button
            name="save"
            onClick={() => update('coverLetter', coverLetter)}
          >
            Save Cover Letter
          </Button>
        </>
      ): (
          <Button
            name="edit"
            onClick={() => setMode('edit')}
            variant="outline"
          >
            {isEmpty ? 'Add Cover Letter' : 'Edit Cover Letter'}
          </Button>
      )}

    </div>
    
  )
}

const Resume = () => {
  const { state } = useAuth() //data, dispatch, error, existing, loading, postData, 
  const [resume, setResume] = useState<Resume>(state.resume ?? initialResume)
  const { coverLetter, certifications, education, experience, summary, skills } = resume
  
  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    setResume((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])
  
  const updateObj = useCallback((name: string, data: Object) => {
    setResume((prevData) => ({
      ...prevData,
      [name]: data,
    }))
  }, [])
  
  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="Enter your resume information here so you can easily copy and paste to your applications!" 
        middle="" 
        title="Resume Editor"
      />
      <div className="w-9/10 mt-8 mx-auto space-y-12">
        <div className="border border-gray-900/10 rounded-lg shadow-md p-8 mb-8 pb-12">
          <Section
            data={summary}
            label="Summary"
            inputType="textarea"
            name="summary" 
            placeholder="Professional Summary"
            update={update}
          />
          <Section
            className="mt-6"
            data={experience}
            inputType="textarea"
            label="Work History"
            name="experience"
            placeholder="Add work history"
            update={update}
          />
          <Section
            className="mt-6"
            data={education}
            inputType="textarea"
            label="Education"
            name="education"
            placeholder="Add education"
            update={update}
          />
          <Section
            className="mt-6"
            data={certifications}
            inputType="input"
            label="Certifications"
            name="certifications"
            placeholder="Add education"
            update={update}
          />
          <Section
            className="mt-6"
            data={skills}
            inputType="input"
            label="Skills"
            name="skills"
            placeholder="Add your skills"
            update={update}
          />
          <CoverLetter
            data={coverLetter}
            update={updateObj}
          />
        </div>
      </div>
    </div>
  )
}

export default Resume