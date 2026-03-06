import { useCallback, useState } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import Header from '@/components/header'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Settings = () => {
  const { dispatch, postData, state } = useAuth()
  const [editSettings, setEditSettings] = useState({
    backgroundColor: state.settings?.backgroundColor || 'default',
    font: state.settings?.font || 'default',
    sidebarColor: state.settings?.sidebarColor || 'default',
    theme: state.settings?.theme || 'light',
  })

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
        <hr className="my-6" />
        <div className="flex flex-col mt-4">
          <div className="flex flex-col my-4 ml-4">
            <h1 className="text-lg mb-2">Background Color</h1>
            <RadioGroup className="flex" name="backgroundColor" defaultValue={editSettings.backgroundColor} onValueChange={(value) => handleSettingsChange({ name: 'backgroundColor', value })}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="bg-white" id="default" />
                <Label htmlFor="default">Default Background</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="bg-black" id="black" />
                <Label htmlFor="black">Black Background</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="bg-blue-500" id="blue" />
                <Label htmlFor="blue">Blue Background</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="bg-green-500" id="green" />
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
              <RadioGroupItem value="font-(family-name:--font-outfit)" id="font-default" />
              <Label htmlFor="font-default">Outfit</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="font-(family-name:--font-inter)" id="inter" />
              <Label htmlFor="inter">Inter</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="font-serif" id="serif" />
              <Label htmlFor="serif">Serif Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="font-sans" id="sans" />
              <Label htmlFor="sans-serif">Sans-Serif Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="font-mono" id="mono" />
              <Label htmlFor="mono">Monospace Font</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="font-(family-name:--font-roboto)" id="roboto" />
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
                <RadioGroupItem value="default" id="sidebarColor-default" />
                <Label htmlFor="sidebarColor-default">Default Sidebar Color</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="blue" id="sidebarColor-blue" />
                <Label htmlFor="sidebarColor-blue">Blue Sidebar</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="green" id="sidebarColor-green" />
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