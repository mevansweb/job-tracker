export type Mode = 'add' | 'view' | 'edit' | undefined

export type TextUpdateEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
