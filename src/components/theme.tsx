import { useEffect } from 'react'

import { useAuth } from '@/components/providers/hooks'
import { getStyles } from '@/global/functions'

export default function Theme({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const { backgroundColor, font, theme } = state.settings
    ? state.settings
    : { backgroundColor: '', font: '', theme: '' }
  const themeClasses = `${getStyles({ theme, name: 'backgroundColor', strKey: backgroundColor })} ${getStyles({ theme, name: 'font', strKey: font })}`

  useEffect(() => {
    if (state.settings?.theme) {
      document.documentElement.classList.remove(state.settings.theme === 'light' ? 'dark' : 'light')
      document.documentElement.classList.add(state.settings.theme)
    }
  }, [state.settings?.theme])

  return (
    <main
      className={`${themeClasses.trim()} h-full w-[calc(100vw-48px)] peer-data-[state=expanded]:w-[calc(100vw-256px)] max-md:w-[calc(100vw)] max-md:peer-data-[state=expanded]:w-[calc(100vw)]`}
    >
      {children}
    </main>
  )
}
