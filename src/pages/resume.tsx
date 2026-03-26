import { useCallback, useMemo, useState } from 'react'

import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import type { Certification, CoverLetter, Education, Employer, Resume, Skill } from '@/global/types'
import { spliceArray } from '@/global/functions'

type Mode = 'add' | 'view' | 'edit' | undefined

type ArrData = Certification[] | Education[] | Employer[] | Skill[]

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

const Section = ({ className = '', data, inputType, label, name, parentMode, placeholder, update, updateDate }: SectionProps & SingleProps) => {
  const [mode, setMode] = useState<Mode>('view')
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <Label className="text-lg" htmlFor={name}>{label}</Label>
      <div className="">
        {mode === 'edit' || parentMode === 'edit' || isEmpty ? (
          <div className="flex gap-4">
            {inputType === 'input' ? (
              <Input
                name={name}
                onChange={update}
                placeholder={placeholder}
                value={data}
              />
            ) : inputType === 'textarea' ? (
              <Textarea
                name={name}
                onChange={update}
                placeholder={placeholder}
                value={data}
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
            
            <Button
              className=""
              onClick={() => {
                setMode('view')
              }}
              variant="outline"
            >
              {isEmpty ? 'Add' : 'Save'}
            </Button>
          </div>
        ) : (
        <>
          {!parentMode ? (
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
            ) : null }
         </>
        )}
      </div>
    </div>
  )
}

const Experience = ({ className = '', data, label, name, updateObject }: SectionProps & { data: Employer[], updateObject: (name: string, data: Object ) => void }) => {
  let newId = crypto.randomUUID()
  const [experience, setExperience] = useState<Employer[]>(data)
  const [employer, setEmployer] = useState<Employer>({ company: '', dateFrom: '', dateTo: '', description: '', id: newId, location: '',  position: ''})
  
  const [editing, setEditing] = useState<{ id: string;  mode: Mode}>({ id: newId, mode: undefined})
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  

  const update = useCallback((event: TextUpdateEvent) => {
    const { name, value } = event.target
    setEmployer((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const updateDate = useCallback((d: Date, name: string) => {
    setEmployer((prevData) => ({
      ...prevData,
      [name]: d.toLocaleDateString(),
    }))
  }, [])

   return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <Label className="text-lg" htmlFor={name}>{label}</Label>

       {experience.map((item) => (
          <>
          <Section
            className="mt-6"
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
            className="mt-6"
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
            className="mt-6"
            data={item.description}
            inputType="input"
            key={`job-desc-${item.id}`}
            label="Job Description"
            name="description"
            parentMode={editing.id === item.id ? editing.mode : undefined}
            placeholder="Job Description"
            update={update}
           />
           <Section
            className="mt-6"
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
            className="mt-6"
            data={item.dateTo}
            inputType="calendar"
            key={`job-dateTo-${item.id}`}
            label="End Date"
            name="dateTo"
            parentMode={editing.id === item.id ? editing.mode : undefined}
            placeholder="End Date"
            updateDate={updateDate}
           />
           <Button
             name="edit-experience"
             onClick={() => {
               setEditing({ id: item.id, mode: 'edit' })
               setEmployer(item)
             }}
           >
             Edit
           </Button>
           <Button
             name="save-experience"
             onClick={() => {
               setEditing({ id: newId, mode: 'add' })
               const arr = spliceArray(employer, experience)
               setExperience(arr as Employer[])
               updateObject(name, arr)
             }}
           >
             Save
           </Button>
          </>
       ))}
       <Button
          name="add-new-work-experience"
          onClick={() => {
            setEditing({ id: crypto.randomUUID(), mode: 'add' })
            const arr = experience.concat(employer)
            setExperience(arr as Employer[])
            updateObject(name, arr)
          }}
        >
          Add New
        </Button>
       {isEmpty || editing.mode === 'add' ? (
         <>
         <Section
            className="mt-6"
            data=""
            inputType="input"
            key={`job-experience-${newId}`}
            label="Job Title"
            name="position"
            parentMode="add"
            placeholder="Job title"
            update={update}
           />
          <Section
            className="mt-6"
            data=""
            inputType="input"
            key={`job-company-${newId}`}
            label="Employer"
            name="company"
            parentMode="add"
            placeholder="Employer"
            update={update}
           />
         <Section
            className="mt-6"
            data=""
            inputType="input"
            key={`job-desc-${newId}`}
            label="Job Description"
            name="description"
            parentMode="add"
            placeholder="Job Description"
            update={update}
           />
          <Section
            className="mt-6"
            data=""
            inputType="calendar"
            key={`job-dateFrom-empty`}
            label="Start Date"
            name="dateFrom"
            parentMode="add"
            placeholder="End Date"
            updateDate={updateDate}
          />
          <Section
            className="mt-6"
            data=""
            inputType="calendar"
            key={`job-dateTo-empty`}
            label="End Date"
            name="dateTo"
            parentMode="add"
            placeholder="End Date"
            updateDate={updateDate}
           />
           <Button
             name="save-new-experience"
             onClick={() => {
               setEditing({ id: crypto.randomUUID(), mode: undefined })
               const arr = experience.concat(employer)
               setExperience(arr as Employer[])
               updateObject(name, arr)
             }}
           >
             Save
           </Button>
        </>
       ) : null}
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
          <Experience
            data={experience}
            label="Work History"
            name="experience"
            placeholder="Add your work history"
            updateObject={updateObj}
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