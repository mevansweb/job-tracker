import { useCallback, useEffect, useState, memo } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import Header from '@/components/header'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { capitalizeWords } from '@/global/functions'

const initialState = { backgroundColor: '', sidebarColor: '', font: '', theme: ''}

const themes = ['light', 'dark']
const backgroundColors = ['default|x', 'blue|bg-blue-200', 'green|bg-green-200']
const fonts = ['inter|font-(family-name:--font-inter)', 'montserrat|font-(family-name:--font-monterrat)', 'monospace|font-mono', 'outfit|font-(family-name:--font-outfit)', 'roboto|font-(family-name:--font-roboto)', 'sans-serif|font-sans', 'serif|font-serif']
const sidebarColors = ['default|x', 'blue|bg-blue-200', 'green|bg-green-200']

type SettingToggleProps = {
  name: string
  handleChange: ({ name, value }: {
    name: string;
    value: string;
}) => Promise<void>
  options: string[]
  selectedValue: string
  title: string
}

const SettingToggle = memo(function SettingToggle({ name, handleChange, options, selectedValue, title } : SettingToggleProps) {
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col my-4 ml-4">
        <h1 className="text-lg mb-2">{title}</h1>
        <RadioGroup className="flex" name="backgroundColor" defaultValue={selectedValue} onValueChange={(val) => handleChange({ name, value: val })}>
          {options.map((option) => {
            let optionValue = option
            let optionTitle = capitalizeWords(option)
            if (option.includes('|')) {
              const pair = option.split('|');
              if (pair[0] && pair[1]) {
                optionTitle = capitalizeWords(pair[0])
                optionValue = pair[1]
              }
            }

            return (
              <div className="flex items-center gap-3" key={`${name}-${optionTitle}`}>
                <RadioGroupItem checked={selectedValue === optionValue} value={optionValue} id={optionTitle} />
                <Label htmlFor={name}>{optionTitle}</Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>
    </div>
  )
})

const Settings = () => {
  const { dispatch, postData, state } = useAuth()
  const [editSettings, setEditSettings] = useState(initialState)
  console.log('editSettings', editSettings)
  
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
        <SettingToggle
          name="theme"
          handleChange={handleSettingsChange}
          options={themes}
          selectedValue={editSettings.theme}
          title="Theme"
        />
        <SettingToggle
          name="backgroundColor"
          handleChange={handleSettingsChange}
          options={backgroundColors}
          selectedValue={editSettings.backgroundColor}
          title="Background Color"
        />
        <SettingToggle
          name="font"
          handleChange={handleSettingsChange}
          options={fonts}
          selectedValue={editSettings.font}
          title="Font"
        />
        <SettingToggle
          name="sidebarColor"
          handleChange={handleSettingsChange}
          options={sidebarColors}
          selectedValue={editSettings.sidebarColor}
          title="Sidebar Color"
        />
      </div>
    </div>
  )
}

export default Settings