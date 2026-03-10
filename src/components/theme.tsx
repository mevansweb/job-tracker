import { useEffect } from 'react'

import { useAuth } from './providers/hooks'
import { type ApiResult } from '@/global/types'
import { getStyles } from '@/global/functions'

export default function Theme({ children }: { children: React.ReactNode }) {
    const { data, dispatch, existing, state } = useAuth()
    const { backgroundColor = '', font, theme } = state.settings ? state.settings : { backgroundColor: '', font: '', theme: ''}
    const themeClasses = `${getStyles({ theme, name: 'backgroundColor', strKey: backgroundColor})} ${getStyles({ theme, name: 'font', strKey: font})}`

    useEffect(() => {
      if (state.settings?.theme) {
        document.documentElement.classList.remove(state.settings.theme === 'light' ? 'dark' : 'light')
        document.documentElement.classList.add(state.settings.theme)
      }
    }, [state.settings?.theme])

    useEffect(() => {
      if (existing && existing.id && state.id === '' && data === null) {
          const user = existing as ApiResult
          dispatch({ type: 'SET_ALL_DATA', email: user.email, error: '', id: user.id ? user.id : user._id ? user._id : '', loggedIn: true, password: user.hashedPassword, jobs: user?.jobs || [], notes: user?.notes || [], tasks: user?.tasks || [], settings: user.settings, view: 'sign-in' })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])  

  return (
    <main 
      className={`${themeClasses.trim()} w-[calc(100vw-48px)] peer-data-[state=expanded]:w-[calc(100vw-256px)] h-screen`}>
    {children}
    </main>
  )
}