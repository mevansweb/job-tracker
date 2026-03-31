import { useMemo, useState } from 'react'

import { BookCopy, FilePen, Save, Undo2 } from 'lucide-react'

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
import { capitalizeWords, getIsEmpty } from '@/global/functions'
import type { Mode, TextUpdateEvent } from './types'

type ResumeInputProps = {
  className?: string
  data: string
  id: string
  inputType: 'input' | 'textarea' | 'calendar'
  label: string
  name: string
  parentMode?: Mode
  placeholder: string
  update?: (event: TextUpdateEvent, id?: string) => void
  updateDate?: (d: Date, name: string, id?: string) => void
  save?: (event: React.MouseEvent<SVGSVGElement>) => void
  saveById?: (id?: string | undefined) => void
  setButtonAction: (mode: Mode, id: string, value?: string) => void
  warning?: boolean
}

type ButtonWithTooltipProps = {
  id: string
  name: string
  onClick: (action: string, id: string, value?: string) => void
  setMode: React.Dispatch<React.SetStateAction<Mode>>
  tooltipText: string
  type: Mode
  value?: string
}

const ButtonWithTooltip = ({ id, name, onClick, setMode, tooltipText, type, value }: ButtonWithTooltipProps) => {
  return (
  <Tooltip>
    <TooltipTrigger asChild>
      {type === 'copy' && value ? (
        <BookCopy
          className="mr-2 w-4 h-4 cursor-pointer"
          onClick={() => onClick('copy', id, value)}
        />
      ) : type === 'edit' ? (
        <FilePen
          className="mr-2 w-4 h-4 cursor-pointer"
          onClick={() => {
            onClick('edit', id)
            setMode('edit')
          }}
          size={16}
        />
      ) : type === 'save' ? (
        <Save
          className="mr-2 w-4 h-4 cursor-pointer"
          onClick={() => onClick('save', id)}
          size={16}
        />
      ) : type === 'undo' ? (
        <Undo2
          className="mr-2 w-4 h-4 cursor-pointer"
          onClick={() => {
            onClick('undo', id)
            setMode('view')
          }}
          size={16}
        />
      ) : null}
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltipText + ' ' + capitalizeWords(name)}</p>
    </TooltipContent>
  </Tooltip>
)}

export const ResumeInput = ({ className = '', data, id, inputType, label, name, parentMode, placeholder, save, update, updateDate, setButtonAction, warning }: ResumeInputProps) => {
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
              {setButtonAction ? (
                <ButtonWithTooltip
                  id={id}
                  name={name}
                  setMode={setMode}
                  tooltipText="Go back"
                  type="undo"
                  onClick={() => setButtonAction('view', id)}

                />
               ) : null}  
              {save ? (
                <ButtonWithTooltip
                  id={id}
                  name={name}
                  onClick={() => setButtonAction('save', id)}
                  setMode={setMode}
                  tooltipText="Save"
                  type="save"
                />
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
          <div className="flex flex-col gap-4">
              <ButtonWithTooltip
                id={id}
                name={name}
                onClick={() => setButtonAction('edit', id)}
                setMode={setMode}
                tooltipText="Edit"
                type="edit"
              />
              <ButtonWithTooltip
                id={id}
                name={name}
                onClick={() => setButtonAction('copy', id, data)}
                setMode={setMode}
                tooltipText="Copy"
                type="copy"
              />
          </div>
        </div>
        ) : mode !== 'add' && mode !== 'edit' && inputType === 'textarea' ? (
        <div className="flex justify-between">
          <div className="w-9/10 text-sm font-light whitespace-pre-line">{data}</div>
            <div className="flex flex-col gap-4">
              <ButtonWithTooltip
                id={id}
                name={name}
                onClick={() => setButtonAction('edit', id)}
                setMode={setMode}
                tooltipText="Edit"
                type="edit"
              />
              <ButtonWithTooltip
                id={id}
                name={name}
                onClick={() => setButtonAction('copy', id, data)}
                setMode={setMode}
                tooltipText="Copy"
                type="copy"
                value={data}
                />
            </div>       
          </div>
      ) : null}
    </Field>
  )
}

