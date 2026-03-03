import { useCallback, useState } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import Header from '@/components/header'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Settings = () => {
  const { dispatch, postData, state } = useAuth()
  const [editSettings, setEditSettings] = useState({
    theme: 'light',
  })

  const handleThemeChange = useCallback((value: string) => {
    document.documentElement.setAttribute('data-theme', value)
    setEditSettings((prev) => ({ ...prev, theme: value }))
    postData('PUT', { email: state.email, settings: { theme: value }, form: 'update-settings' })
    dispatch({ type: 'SET_SETTINGS', settings: { theme: value } })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...state, settings: { theme: value } }))
  }, [dispatch, postData, state])

  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you save your Job Tracker preferences." 
        middle="" 
        title="Settings"
      />
      <div className="flex flex-col my-8">
        <h1 className="text-xl font-medium">Settings coming soon!</h1>
        <div className="flex mt-4">
          <RadioGroup defaultValue={editSettings.theme} onValueChange={handleThemeChange}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light Theme</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Theme</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

export default Settings