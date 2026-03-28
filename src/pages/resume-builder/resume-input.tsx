import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getIsEmpty } from '@/global/functions'
import type { Mode, TextUpdateEvent } from './types'

type ResumeInputProps = {
  className?: string
  data: string
  inputType: 'input' | 'textarea' | 'calendar'
  label: string
  name: string
  parentMode?: Mode
  placeholder: string
  update?: (event: TextUpdateEvent) => void
  updateDate?: (d: Date, name: string) => void
  save?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  saveById?:  (id?: string | undefined) => void
}

export const ResumeInput = ({ className = '', data, inputType, label, name, parentMode, placeholder, save, update, updateDate }: ResumeInputProps) => {
  const [mode, setMode] = useState<Mode>(parentMode)
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <Field className={className}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
        {mode === 'edit' || mode === 'add' || isEmpty ? (
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
          ) : null}
          {['textarea', 'input'].includes(inputType) ? (
            <div className="flex flex-col gap-4 w-30">
              {data.length > 0 ? (
                <Button
                  className="w-30"
                  onClick={() => setMode('view')}
                  variant="outline"
                >
                  Cancel
                </Button>
              ) : null }
              
              {save ? (
                <Button
                  className="w-30"
                  onClick={save}
                  variant="outline"
                >
                  Save
                </Button> 
              ) : null }
              </div>
          ) : null }
          {inputType === 'calendar' && updateDate ? (
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
          <div className="flex justify-between">
            {data}
            <Button
              className="w-30"
              onClick={() => setMode('edit')}
              variant="outline"
            >
              Edit
            </Button>  
          </div>
         </>
        )}
    </Field>
  )
}

