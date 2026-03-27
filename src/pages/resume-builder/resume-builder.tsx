import { useCallback, useEffect, useMemo, useState } from 'react'

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldGroup, FieldSet, FieldLabel, FieldLegend } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import type { Certification, CoverLetter, Education, Employer, Skill } from '@/global/types'
import { spliceArray } from '@/global/functions'
import { useResume } from '@/components/providers/resume-provider'

type Mode = 'add' | 'view' | 'edit' | undefined

type ArrData = Certification[] | Education[] | Employer[] | Skill[]

type TextUpdateEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>

type SectionProps = {
  className?: string
  label: string
  name: string
  parentMode?: Mode
  placeholder: string
}

type SingleProps = {
  data: string
  inputType: 'input' | 'textarea' | 'calendar'
  update?: (event: TextUpdateEvent) => void
  updateDate?: (d: Date, name: string) => void
}

const getIsEmpty = (data: string | CoverLetter | ArrData) => {
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

const getGreeting = ({ companyName, greeting, personalize, position } : { companyName: string, greeting: string, personalize: boolean, position: string }) => {
  return personalize ? `Dear ${companyName} Hiring Manager,
I am writing to express my interest in the ${position} position at ${companyName}.` : greeting ?
        greeting : `Dear Hiring Manager,
I am writing to express my interest in the ${position} position at your company.
    `
}

function hasPopulatedProperty(obj: unknown) {
    // Validate input
    if (obj === null || typeof obj !== 'object') {
        throw new TypeError('Expected a non-null object')
    }

    // Iterate over own properties
    return Object.values(obj).some(value => {
        // Check for non-empty values
        if (value === null || value === undefined) return false
        if (typeof value === 'string' && value.trim() === '') return false
        return true
    })
}

const Section = ({ className = '', data, inputType, label, name, parentMode, placeholder, update, updateDate }: SectionProps & SingleProps) => {
  const [mode, setMode] = useState<Mode>('view')
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <Field className={className}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {mode === 'edit' || parentMode === 'edit' || parentMode === 'add' ||  isEmpty ? (
          <div className="flex gap-4">
            {inputType === 'input' ? (
              <Input
                id={name}
                name={name}
                onChange={update}
                placeholder={placeholder}
                defaultValue={data}
              />
            ) : inputType === 'textarea' ? (
              <Textarea
                id={name}
                name={name}
                onChange={update}
                placeholder={placeholder}
                defaultValue={data}
              />
              ) : inputType === 'calendar' && updateDate ? (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id={name} className="w-23.75 flex text-muted-foreground font-normal justify-between">
                    {data ? new Date(data).toLocaleDateString() : "From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data ? new Date(data) : new Date()}
                    captionLayout="dropdown"
                    defaultMonth={data ? new Date(data) : new Date()}
                    onSelect={(d) => {
                      if (d) {
                        updateDate(d, name)
                        setCalendarOpen(false)
                      } 
                    }}
                    required={true}
                  />
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
        ) : (
        <>
          {!parentMode ? (
            <div className="flex flex-col">
              <div className="flex">
                <Button
                  className="w-50"
                  onClick={() => setMode('edit')}
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
              {data}
            </div>
            ) : null }
         </>
        )}
    </Field>
  )
}

const Experience = ({ data }: SectionProps & { data: Employer[] }) => {
  let newId = crypto.randomUUID()
  const { state, dispatch, dispatchAPI } = useResume()
  const { experience } = state
  const [employer, setEmployer] = useState<Employer>({ company: '', dateFrom: '', dateTo: '', description: '', id: newId, location: '',  position: ''})
  
  const [editing, setEditing] = useState<{ id: string;  mode: Mode}>({ id: newId, mode: undefined})
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  console.log('employer', employer)
  

  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    console.log(name, value)
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

   return (
     <div className="flex flex-col gap-4">
       <FieldLegend className="font-bold border-b pb-2">Work History</FieldLegend>
       {experience.map((item) => (
          <div key={`job-history-section-${item.id}`}>
          <Section
            data={item.position}
            inputType="input"
            key={`job-title-${item.id}`}
            label="Job Title"
            name="position"
            parentMode={editing.id === item.id ? editing.mode : undefined}
            placeholder="Job title"
            update={update}
           />
           <Section
            data={item.company}
            inputType="input"
            key={`job-company-${item.id}`}
            label="Employer"
            name="company"
            parentMode={editing.id === item.id ? editing.mode : undefined}
            placeholder="Employer"
            update={update}
           />
           <Section
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
              <Section
                data={item.dateFrom}
                inputType="calendar"
                key={`job-dateFrom-${item.id}`}
                label="Start Date"
                name="dateFrom"
                parentMode={editing.id === item.id ? editing.mode : undefined}
                placeholder="End Date"
                updateDate={updateDate}
              />
              <Section
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
           <Button
             className="w-50"
             name="edit-experience"
             onClick={() => {
               setEditing({ id: item.id, mode: 'edit' })
               setEmployer(item)
             }}
             variant="outline"
           >
             Edit
           </Button>
           <Button
             className="w-50"
             name="save-experience"
             onClick={() => {
               setEditing({ id: newId, mode: 'add' })
               const arr = spliceArray(employer, experience)
               dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
               dispatchAPI({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] }})
             }}
             variant="outline"
           >
             Save
           </Button>
          </div>
       ))}
       {!isEmpty ? (
        <Button
          className="w-50"
          name="add-new-work-experience"
          onClick={() => {
            setEditing({ id: crypto.randomUUID(), mode: 'add' })
            const arr = experience.concat(employer)
            dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
            dispatchAPI({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] }})
         }}
         variant="outline"
        >
          Add New
        </Button>
       ) : null }
       
       {isEmpty || editing.mode === 'add' ? (
         <>
         <Section
            data={employer.position}
            inputType="input"
            key={`job-experience-${newId}`}
            label="Job Title"
            name="position"
            parentMode="add"
            placeholder="Job title"
            update={update}
           />
          <Section  
            data={employer.company}
            inputType="input"
            key={`job-company-${newId}`}
            label="Employer"
            name="company"
            parentMode="add"
            placeholder="Employer"
            update={update}
           />
          <Section
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
             <Section
                data={employer.dateFrom}
                inputType="calendar"
                key={`job-dateFrom-empty`}
                label="Start Date"
                name="dateFrom"
                parentMode="add"
                placeholder="End Date"
                updateDate={updateDate}
              />
              <Section
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
                onClick={() => {
                  setEditing({ id: crypto.randomUUID(), mode: undefined })
                  const arr = experience.concat(employer)
                  dispatch({ type: 'SET_EXPERIENCE', experience: arr as Employer[] })
                  dispatchAPI({ type: 'SET_RESUME', resume: { ...state, experience: arr as Employer[] }})
                }}
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

const CoverLetter = () => {
  const { state, dispatch, dispatchAPI } = useResume()
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
  
  return (
    <>
      <FieldLegend className="font-bold border-b pb-2">Cover Letter</FieldLegend>
      <div className={`gap-4 flex ${mode === 'view' ? 'justify-between' : 'flex-col'}`}>
      {mode === 'add' || mode === 'edit' ? (
        <>
          <Section
            data={position}
            inputType="input"
            label="Job Title"
            name="position"
            placeholder="Job title"
            update={update}
          />
          <Section
            data={companyName}
            label="Company Name"
            name="companyName"
            inputType="input"
            placeholder="Personalize by adding the company name (optional)"
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
          <Section
            data={personalizedGreeting}
            label="Cover Letter Greeting"
            name="greeting"
            inputType="textarea"
            placeholder="Add a greeting"
            update={update}
          />
          <Section
            data={body}
            label="Cover Letter Body"
            name="body"
            inputType="textarea"
            placeholder="Personalize by adding the company name (optional)"
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
                dispatchAPI({ type: 'SET_RESUME', resume: { ...state, coverLetter } })
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

const ResumeBuilder = () => {
  const { authState, dispatch, dispatchAPI, state } = useResume()
  const { experience, summary } = state
  const resumeStarted = useMemo(() => hasPopulatedProperty(state), [state])

  useEffect(() => {
    if (authState.resume === undefined && resumeStarted) {
      dispatchAPI({ type: 'SET_RESUME', resume: {...state}})
    }
  }, [])
  
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
              <Section
                data={summary}
                label="Summary"
                inputType="textarea"
                name="summary" 
                placeholder="Professional Summary"
                update={(event) => dispatch({ type: 'SET_SUMMARY', summary: event.target.value })}
              />
              <Experience
                data={experience}
                label="Work History"
                name="experience"
                placeholder="Add your work history"
              />
              <CoverLetter />
            </FieldGroup>
          </FieldSet>         
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder