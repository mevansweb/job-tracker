import { useCallback, useEffect, useState, memo } from 'react'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { capitalizeWords } from '@/global/functions'
import { themes, backgroundColors, fonts, sidebarColors } from '@/global/constants'

const initialState = { backgroundColor: '', sidebarColor: '', font: '', theme: ''}

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
        <RadioGroup className="flex flex-wrap" name="backgroundColor" defaultValue={selectedValue} onValueChange={(val) => handleChange({ name, value: val })}>
          {options.map((option) => {
            const optionValue = option === 'default' ? '' : option
            const optionTitle = capitalizeWords(option)
            return (
              <div className="flex items-center gap-3" key={`${name}-${optionTitle}`}>
                <RadioGroupItem checked={selectedValue === optionValue} value={optionValue} id={optionTitle} />
                <Label htmlFor={name}>{optionTitle ? optionTitle : 'Default'}</Label>
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
    const updatedSettings = { ...editSettings, [name]: value }
    setEditSettings(updatedSettings)
    postData('PUT', { email: state.email, settings: updatedSettings, form: 'update-settings' })
    dispatch({ type: 'SET_SETTINGS', settings: updatedSettings })
    localStorage.setItem(localStorageKey, JSON.stringify({ ...state, settings: updatedSettings }))
  }, [dispatch, postData, state, editSettings])

  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you save your Job Tracker preferences." 
        middle="" 
        title="Settings"
      />
      <Card className="flex flex-col my-8 w-[800px] mx-auto mb-4 p-4">
        <h1 className="text-2xl flex justify-center">Settings</h1>
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
      </Card>
    </div>
  )
}

export default Settings