import { bgThemeVariants, fontVariants, sbThemeVariants } from '@/global/constants'

type StylesProps = {
  name: string
  strKey: string
  theme: string
}

const colorSettings = ['backgroundColor', 'sidebarColor']
const nonColorSettings = ['font']

export function getStyles({theme, name, strKey} : StylesProps) {
  const themeVariant = name === 'backgroundColor' ? bgThemeVariants : name === 'sidebarColor' ? sbThemeVariants : name === 'font' ? fontVariants : null
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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