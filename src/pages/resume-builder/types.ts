export type Mode = 'add' | 'copy' | 'view' | 'edit' | 'save' | 'undo' | undefined

export type TextUpdateEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
