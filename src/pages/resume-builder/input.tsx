import { useMemo, useState } from 'react'

import { BookCopy, FilePen, Save, Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getIsEmpty } from '@/global/functions'

import type { Mode, TextUpdateEvent } from './types'

type ResumeInputProps = {
  className?: string
  data: string
  id: string
  inputType: 'input' | 'textarea' | 'calendar'
  instructions?: string
  label: string
  name: string
  originalData?: string
  parentMode?: Mode
  placeholder: string
  update?: (event: TextUpdateEvent, id?: string) => void
  updateDate?: (d: Date, name: string, id?: string) => void
  saveById?: (id?: string | undefined) => void
  setButtonAction: (mode: Mode, id: string, name?: string, value?: string) => void
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

const ButtonWithTooltip = ({
  id,
  onClick,
  setMode,
  tooltipText,
  type,
  value,
}: ButtonWithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {type === 'copy' && value ? (
          <BookCopy
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => onClick('copy', id, value)}
          />
        ) : type === 'edit' ? (
          <FilePen
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => {
              onClick('edit', id)
              setMode('edit')
            }}
            size={16}
          />
        ) : type === 'save' ? (
          <Save
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => {
              onClick('save', id)
              setMode('view')
            }}
            size={16}
          />
        ) : type === 'undo' ? (
          <Undo2
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => {
              onClick('undo', id)
              setMode('view')
            }}
            size={16}
          />
        ) : null}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const ResumeInput = ({
  className = '',
  data,
  id,
  inputType,
  instructions,
  label,
  name,
  originalData,
  parentMode,
  placeholder,
  update,
  updateDate,
  setButtonAction,
}: ResumeInputProps) => {
  const [mode, setMode] = useState<Mode>(parentMode ?? 'view')
  const isEmpty = useMemo(() => getIsEmpty(data), [data])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const showUndo = useMemo(() => {
    if (originalData !== undefined && mode === 'edit') {
      return originalData !== data
    }
    return false
  }, [originalData, data, mode])

  return (
    <Field className={`mt-6 ${className}`}>
      {label ? (
        <FieldLabel className="font-bold" htmlFor={name}>
          {label}
        </FieldLabel>
      ) : null}
      {instructions ? (
        <FieldDescription className="text-sm font-light">{instructions}</FieldDescription>
      ) : null}
      {(mode === 'edit' || isEmpty) && inputType !== 'calendar' ? (
        <div className="flex justify-between gap-4">
          {inputType === 'input' ? (
            <Input
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
                setMode('edit')
              }}
              placeholder={placeholder}
            />
          ) : inputType === 'textarea' ? (
            <Textarea
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
                setMode('edit')
              }}
              placeholder={placeholder}
            />
          ) : null}

          {['textarea', 'input'].includes(inputType) ? (
            <div className="flex flex-col gap-4">
              {showUndo && setButtonAction ? (
                <ButtonWithTooltip
                  id={id}
                  name={name}
                  setMode={setMode}
                  tooltipText="Undo Changes"
                  type="undo"
                  onClick={() => setButtonAction('undo', id)}
                />
              ) : null}
              {showUndo && setButtonAction ? (
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
              className="text-muted-foreground bg-background! flex w-23.75 justify-between font-normal"
              id={name}
              variant="outline"
            >
              {data ? new Date(data).toLocaleDateString() : 'From Date'}
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
      ) : mode === 'view' && !isEmpty && inputType === 'input' ? (
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
              onClick={() => setButtonAction('copy', id, undefined, data)}
              setMode={setMode}
              tooltipText="Copy"
              type="copy"
              value={data}
            />
          </div>
        </div>
      ) : mode === 'view' && !isEmpty && inputType === 'textarea' ? (
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
              onClick={() => setButtonAction('copy', id, undefined, data)}
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
