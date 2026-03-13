import { memo, useCallback, useEffect, useState } from 'react'

import { ChevronDownIcon } from 'lucide-react'

import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/hooks'
import { localStorageKey } from '@/components/providers/const'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { capitalizeWords, getAfterChar, getStyles } from '@/global/functions'
import { backgroundColors, fonts, sidebarColors, themes } from '@/global/constants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const initialState = { backgroundColor: '', sidebarColor: '', font: '', theme: ''}

type SettingToggleProps = {
  name: string
  handleChange: ({ name, value }: {
    name: string;
    value: string;
}) => Promise<void>
  options: string[]
  selectedValue: string
  selectedStyle: string
  title: string
  type: 'radio'| 'dropdown' | 'checkbox'
}

const SettingToggle = memo(function SettingToggle({ name, handleChange, options, selectedStyle, selectedValue, title, type } : SettingToggleProps) {
  const buttonCss = getAfterChar(selectedStyle, ':')
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col my-4 ml-4">
        <h1 className="text-lg mb-2">{title}</h1>
        {type === 'radio' ? (
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
        ) : ''}
        {type === 'dropdown' ? (
          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className={`cursor-pointer w-50 ${buttonCss ? `${buttonCss} hover:${buttonCss}` : ''}`}
                  variant="outline"
                >
                  {title}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-50" align="start">
                {options.map((option) => {
                  const optionValue = option === 'default' ? '' : option
                  const optionTitle = capitalizeWords(option)
                  return (
                    <DropdownMenuItem
                      id={optionTitle}
                      key={`${name}-${optionTitle}`}
                      onClick={() => {
                        handleChange({ name, value: optionValue })
                      }}
                    >
                      {optionTitle ? optionTitle : 'Default'}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </div>
  )
})

const Settings = () => {
  const { dispatch, postData, state } = useAuth()
  const { backgroundColor = '', font, sidebarColor = '', theme } = state.settings ? state.settings : { backgroundColor: '', font: '', theme: ''}
  const bgStyle = getStyles({ theme, name: 'backgroundColor', strKey: backgroundColor})
  const sbStyle = getStyles({ theme, name: 'sidebarColor', strKey: sidebarColor})
  const fontStyle = getStyles({ theme, name: 'font', strKey: font})
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
      <Card className="flex flex-col my-8 w-200 mx-auto mb-4 p-4">
        <h1 className="text-2xl flex justify-center">Settings</h1>
        <SettingToggle
          name="theme"
          handleChange={handleSettingsChange}
          options={themes}
          selectedStyle=""
          selectedValue={editSettings.theme}
          title="Theme"
          type="radio"
        />
        <SettingToggle
          name="backgroundColor"
          handleChange={handleSettingsChange}
          options={backgroundColors}
          selectedStyle={bgStyle}
          selectedValue={editSettings.backgroundColor}
          title="Background Color"
          type="dropdown"
        />
        <SettingToggle
          name="font"
          handleChange={handleSettingsChange}
          options={fonts}
          selectedStyle={fontStyle}
          selectedValue={editSettings.font}
          title="Font"
          type="radio"
        />
        <SettingToggle
          name="sidebarColor"
          handleChange={handleSettingsChange}
          options={sidebarColors}
          selectedStyle={sbStyle}
          selectedValue={editSettings.sidebarColor}
          title="Sidebar Color"
          type="dropdown"
        />
      </Card>
    </div>
  )
}

export default Settings