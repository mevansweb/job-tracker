import { useMemo, useState } from 'react'

import { FilePen, Save, Undo2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getIsEmpty } from '@/global/functions'
import type { Mode, TextUpdateEvent } from './types'

type ResumeInputProps = {
  className?: string
  data: string
  id?: string
  inputType: 'input' | 'textarea' | 'calendar'
  label: string
  name: string
  parentMode?: Mode
  placeholder: string
  update?: (event: TextUpdateEvent, id?: string) => void
  updateDate?: (d: Date, name: string, id?: string) => void
  save?: (event: React.MouseEvent<SVGSVGElement>) => void
  saveById?: (id?: string | undefined) => void
  warning?: boolean
}

export const ResumeInput = ({ className = '', data, id, inputType, label, name, parentMode, placeholder, save, update, updateDate, warning }: ResumeInputProps) => {
  const [mode, setMode] = useState<Mode>(parentMode)
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <Field className={`${className} mt-6`}>
      <FieldLabel className="font-bold" htmlFor={name}>{label}</FieldLabel>
      {(mode === 'edit' || mode === 'add' || isEmpty) && inputType !== 'calendar' ? (
        <div className="flex justify-between gap-4">
          {inputType === 'input' ? (
            <Input
              aria-invalid={warning}
              className="w-9/10"
              defaultValue={data}
              id={name}
              name={name}
              onChange={(event) => id && update ? update(event, id) : update ? update(event) : null}
              placeholder={placeholder}
            />
          ) : inputType === 'textarea' ? (
            <Textarea
              aria-invalid={warning}
              className="w-9/10"
              defaultValue={data}
              id={name}
              name={name}
              onChange={(event) => {
                if (id && update) {
                  update(event, id)
                } else if (update) {
                  update(event)
                }
              }}
              placeholder={placeholder}
            />
          ) : null}

          {['textarea', 'input'].includes(inputType) ? (
            <div className="flex flex-col gap-4">
              {data.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Undo2
                      className="mr-2 w-4 h-4 cursor-pointer"
                      onClick={() => setMode('view')}
                    />
                </TooltipTrigger>
                 <TooltipContent>
                  <p>Go back</p>
                </TooltipContent>
              </Tooltip>
              ) : null}  
              {save ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Save
                    className="mr-2 w-4 h-4 cursor-pointer"
                    onClick={(event) => {                     
                      save(event)
                      setMode('view')
                    }}
                    size={16}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {inputType === 'calendar' && updateDate ? (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-invalid={warning}
              className={`w-23.75 flex text-muted-foreground font-normal justify-between`}
              id={name}
              variant="outline"
            >
              {data ? new Date(data).toLocaleDateString() : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              captionLayout="dropdown"
              defaultMonth={data ? new Date(data) : new Date()}
              mode="single"
              onSelect={(d) => {
                if (d) {
                  updateDate(d, name, id)
                  setCalendarOpen(false)
                } 
              }}
              required={true}
              selected={data ? new Date(data) : new Date()}
            />
          </PopoverContent>
        </Popover>
      ) : mode !== 'add' && mode !== 'edit' && inputType === 'input' ? (
        <div className="flex justify-between text-sm font-light">
          {data}
          <Tooltip>
            <TooltipTrigger asChild>
              <FilePen
                className="mr-2 w-4 h-4 cursor-pointer"
                onClick={() => setMode('edit')}
                size={16}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
        ) : mode !== 'add' && mode !== 'edit' && inputType === 'textarea' ? (
        <div className="flex justify-between">
          <div className="w-9/10 text-sm font-light whitespace-pre-line">{data}</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <FilePen
                className="mr-2 w-4 h-4 cursor-pointer"
                onClick={() => setMode('edit')}
                size={16}
                />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          </div>
      ) : null}
    </Field>
  )
}

