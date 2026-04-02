import equal from 'fast-deep-equal/es6/react'

import { bgThemeVariants, fontVariants, sbThemeVariants } from '@/global/constants'
import { Status } from '@/global/types'

type StylesProps = {
  name: string
  strKey: string
  theme: string
}

const colorSettings = ['backgroundColor', 'sidebarColor']
const nonColorSettings = ['font']

export function getStyles({ theme, name, strKey }: StylesProps) {
  const themeVariant =
    name === 'backgroundColor'
      ? bgThemeVariants
      : name === 'sidebarColor'
        ? sbThemeVariants
        : name === 'font'
          ? fontVariants
          : null
  if (colorSettings.includes(name) && theme && themeVariant) {
    const themeKey = theme as keyof typeof themeVariant
    const colorKey = themeVariant[themeKey]
    if (colorKey && strKey in colorKey) {
      return colorKey[strKey as keyof typeof colorKey]
    }
  } else if (themeVariant) {
    if (colorSettings.includes(name)) {
      const colorKey = (themeVariant as typeof bgThemeVariants | typeof sbThemeVariants)['light']
      if (colorKey && strKey in colorKey) {
        return colorKey[strKey as keyof typeof colorKey]
      }
    }
    if (nonColorSettings.includes(name)) {
      return themeVariant[strKey as keyof typeof themeVariant]
    }
  }
  return ''
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getAfterChar(str: string | string[], char: string | string[]) {
  if (typeof str !== 'string' || typeof char !== 'string' || char.length === 0) {
    return str
  }

  const index = str.indexOf(char)
  if (index === -1) {
    return str // Character not found, just return as is
  }

  return str.slice(index + char.length)
}

export function getProgress(status: Status) {
  switch (status) {
    case 'waiting-for-response': {
      return 10
    }
    case 'behavioral-assessment':
    case 'ccat':
    case 'recruiter-emailed':
    case 'recruiter-messaged':
    case 'recruiter-screening':
    case 'waiting-for-next-steps': {
      return 20
    }
    case 'coding-assessment':
    case 'hiring-manager-screening': {
      return 30
    }
    case 'panel-interview': {
      return 40
    }
    case 'received-offer': {
      return 90
    }
    case 'accepted-offer': {
      return 100
    }
    case 'ghosted':
    case 'rejected': {
      return 100
    }
  }
}

type UnknownWithId = { id: string } & Record<string, unknown>

export function spliceOrConcatArray(item: UnknownWithId, arr: UnknownWithId[]) {
  const pos = arr.map((e) => e.id).indexOf(item.id)
  let arrCopy = arr
  if (pos === -1) {
    arrCopy = arr.concat(item)
  } else {
    arrCopy = arr.filter((j) => j.id !== item.id)
    arrCopy.splice(pos, 0, item)
  }
  return arrCopy
}

export function getItemToEdit(item: UnknownWithId, arr: UnknownWithId[], id: string) {
  let itemToUpdate = item
  if (id !== item.id) {
    const found = arr.find((f) => f.id === id)
    if (found) {
      itemToUpdate = found
    }
  }
  return itemToUpdate
}

export function disableSave(item: UnknownWithId, arr: UnknownWithId[], id: string) {
  const local = item
  const original = arr.find((a) => a.id === id)
  const isEmpty = getIsEmpty({ ...local, id: '' })
  if (isEmpty) return true
  if (!original || !local) return false // should not disable if either copy is missing, user may have added or deleted an item and should be allowed to save
  return equal(local, original)
}

export function getIsEmpty(data: string | object) {
  if (typeof data === 'string' && !data) {
    return true
  }
  if (typeof data === 'object') {
    if (Array.isArray(data) && data.length === 0) {
      return true
    } else {
      return Object.values(data).every((value) => {
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

export function getEmptyRequiredFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): (keyof T)[] {
  const emptyFields: (keyof T)[] = []

  for (const field of requiredFields) {
    const value = obj[field]

    // Check for null, empty string, or empty array
    if (
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      emptyFields.push(field)
    }
  }

  return emptyFields
}
