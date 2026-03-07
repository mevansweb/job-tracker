import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import Header from '@/components/header'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const initialState = { backgroundColor: '', sidebarColor: '', font: '', theme: ''}

const Settings = () => {
  const { dispatch, postData, state } = useAuth()
  const [editSettings, setEditSettings] = useState(initialState)
  
  useEffect(() => {
    if (state.settings && (state.settings.backgroundColor || state.settings.font || state.settings.sidebarColor || state.settings.theme )) {
      setEditSettings({
        backgroundColor: state.settings?.backgroundColor,
        font: state.settings.font,
        sidebarColor: state.settings?.sidebarColor,
        theme: state.settings.theme,
      })
    }
  }, [state.settings])

  const handleSettingsChange = useCallback(async ({ name, value }: { name: string; value: string }) => {
    setEditSettings((prev) => ({ ...prev, [name]: value }))
    postData('PUT', { email: state.email, settings: { ...editSettings, [name]: value }, form: 'update-settings' })
    dispatch({ type: 'SET_SETTINGS', settings: { ...editSettings, [name]: value } })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...state, settings: { ...editSettings, [name]: value } }))
  }, [dispatch, postData, state, editSettings])

  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you save your Job Tracker preferences." 
        middle="" 
        title="Settings"
      />
      <h1 className="text-2xl flex justify-center">Settings</h1>
      <div className="flex flex-col my-8 w-[800px] mx-auto border border-gray-300 rounded-lg shadow">
        <div className="flex flex-col my-4 ml-4">
          <div className="flex flex-col mt-4">
            <h1 className="text-lg mb-2">Theme</h1>
            <RadioGroup className="flex" name="theme" defaultValue={editSettings.theme} onValueChange={(value) => handleSettingsChange({ name: 'theme', value })}>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.theme === 'light' || editSettings.theme === 'light'} value="light" id="light" />
                <Label htmlFor="light">Light Theme</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.theme === 'dark'} value="dark" id="dark" />
                <Label htmlFor="dark">Dark Theme</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <hr className="my-6" />
        <div className="flex flex-col mt-4">
          <div className="flex flex-col my-4 ml-4">
            <h1 className="text-lg mb-2">Background Color</h1>
            <RadioGroup className="flex" name="backgroundColor" defaultValue={editSettings.backgroundColor} onValueChange={(value) => handleSettingsChange({ name: 'backgroundColor', value })}>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.backgroundColor === ''} value="" id="default" />
                <Label htmlFor="default">Default Background</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.backgroundColor === 'blue'} value="bg-blue-500" id="blue" />
                <Label htmlFor="blue">Blue Background</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.backgroundColor === 'green'} value="bg-green-500" id="green" />
                <Label htmlFor="green">Green Background</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <hr className="my-6" />
        <div className="flex flex-col mt-4">
          <div className="flex flex-col my-4 ml-4">
            <h1 className="text-lg mb-2">Font</h1>
            <RadioGroup className="flex" name="font" defaultValue={editSettings.font} onValueChange={(value) => handleSettingsChange({ name: 'font', value })}>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('outfit')} value="font-(family-name:--font-outfit)" id="font-default" />
              <Label htmlFor="font-default">Outfit</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('inter')} value="font-(family-name:--font-inter)" id="inter" />
              <Label htmlFor="inter">Inter</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('montserrat')} value="font-(family-name:--font-montserrat)" id="montserrat" />
              <Label htmlFor="montserrat">Montserrat</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('serif')} value="font-serif" id="serif" />
              <Label htmlFor="serif">Serif Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('sans')}value="font-sans" id="sans" />
              <Label htmlFor="sans-serif">Sans-Serif Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('mono')} value="font-mono" id="mono" />
              <Label htmlFor="mono">Monospace Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem checked={editSettings.font.includes('roboto')} value="font-(family-name:--font-roboto)" id="roboto" />
              <Label htmlFor="roboto">Roboto</Label>
            </div>
          </RadioGroup>
          </div>
        </div>
        <hr className="my-6" />
        <div className="flex flex-col mt-4">
          <div className="flex flex-col my-4 ml-4">
            <h1 className="text-lg mb-2">Sidebar Color</h1>
            <RadioGroup className="flex" name="sidebarColor" defaultValue={editSettings.sidebarColor} onValueChange={(value) => handleSettingsChange({ name: 'sidebarColor', value })}>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.sidebarColor === ''} value="" id="sidebarColor-default" />
                <Label htmlFor="sidebarColor-default">Default Sidebar Color</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.sidebarColor === 'blue'} value="blue" id="sidebarColor-blue" />
                <Label htmlFor="sidebarColor-blue">Blue Sidebar</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem checked={editSettings.sidebarColor === 'green'} value="green" id="sidebarColor-green" />
                <Label htmlFor="sidebarColor-green">Green Sidebar</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings