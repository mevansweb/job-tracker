import { memo, useCallback, useEffect, useState } from 'react'

import { ChevronDownIcon } from 'lucide-react'

import Header from '@/components/header'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'
import { RoundedContainer } from '@/components/rounded-container'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { availableColors, fonts, themes } from '@/global/constants'
import { capitalizeWords, getAfterChar, getStyles } from '@/global/functions'

const settingDescriptions = {
  theme:
    'Choose between light and dark mode themes. Light mode uses a bright background with dark text, while dark mode inverts this with a dark background and light text, each offering unique benefits for readability, accessibility, and user experience.',
  backgroundColor: 'Change the background color of the app.',
  font: 'Change the font used throughout the app.',
  sidebarColor: 'Change the background color of the sidebar.',
  accentColor:
    'Change the color of accents throughout the app, such as buttons, table headers, and header backgrounds.',
}

const initialState = { accentColor: '', backgroundColor: '', sidebarColor: '', font: '', theme: '' }

type SettingToggleProps = {
  name: string
  description?: string
  handleChange: ({ name, value }: { name: string; value: string }) => Promise<void>
  options: string[]
  selectedValue: string
  selectedStyle: string
  title: string
  type: 'radio' | 'dropdown' | 'checkbox'
}

const SettingToggle = memo(function SettingToggle({
  description,
  handleChange,
  name,
  options,
  selectedStyle,
  selectedValue,
  title,
  type,
}: SettingToggleProps) {
  const buttonCss = getAfterChar(selectedStyle, ':')
  return (
    <div className="mt-4 flex flex-col">
      <div className="my-4 ml-4 flex flex-col gap-4">
        <h1 className="border-b pb-2 text-base font-bold">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
        {type === 'radio' ? (
          <RadioGroup
            className="flex flex-wrap"
            name={name}
            defaultValue={selectedValue}
            onValueChange={(val) => handleChange({ name, value: val })}
          >
            {options.map((option) => {
              const optionValue = option === 'default' ? '' : option
              const optionTitle = capitalizeWords(option)
              return (
                <div className="flex items-center gap-3" key={`${name}-${optionTitle}`}>
                  <RadioGroupItem
                    checked={selectedValue === optionValue}
                    value={optionValue}
                    id={optionTitle}
                  />
                  <Label htmlFor={name}>{optionTitle ? optionTitle : 'Default'}</Label>
                </div>
              )
            })}
          </RadioGroup>
        ) : (
          ''
        )}
        {type === 'dropdown' ? (
          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`w-50 cursor-pointer ${buttonCss ? `${buttonCss} hover:${buttonCss}` : ''}`}
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
  const {
    accentColor = '',
    backgroundColor = '',
    font,
    sidebarColor = '',
    theme,
  } = state.settings
    ? state.settings
    : { accentColor: '', backgroundColor: '', font: '', theme: '' }
  const acStyle = getStyles({ theme, name: 'accentColor', strKey: accentColor })
  const bgStyle = getStyles({ theme, name: 'backgroundColor', strKey: backgroundColor })
  const sbStyle = getStyles({ theme, name: 'sidebarColor', strKey: sidebarColor })
  const fontStyle = getStyles({ theme, name: 'font', strKey: font })
  const [editSettings, setEditSettings] = useState(initialState)

  useEffect(() => {
    if (
      state.settings &&
      (state.settings.accentColor ||
        state.settings.backgroundColor ||
        state.settings.font ||
        state.settings.sidebarColor ||
        state.settings.theme)
    ) {
      setEditSettings({
        accentColor: state.settings.accentColor,
        backgroundColor: state.settings?.backgroundColor,
        font: state.settings.font,
        sidebarColor: state.settings?.sidebarColor,
        theme: state.settings.theme,
      })
    }
  }, [state.settings])

  const handleSettingsChange = useCallback(
    async ({ name, value }: { name: string; value: string }) => {
      const updatedSettings = { ...editSettings, [name]: value }
      setEditSettings(updatedSettings)
      postData('PUT', { email: state.email, settings: updatedSettings, form: 'update-settings' })
      dispatch({ type: 'SET_SETTINGS', settings: updatedSettings })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...state, settings: updatedSettings }))
    },
    [dispatch, postData, state, editSettings]
  )

  return (
    <div className="flex flex-col p-4">
      <Header
        greeting="This is where you save your Job Tracker preferences."
        middle=""
        title="Settings"
      />
      <RoundedContainer title="Settings">
        <SettingToggle
          name="theme"
          description={settingDescriptions.theme}
          handleChange={handleSettingsChange}
          options={themes}
          selectedStyle=""
          selectedValue={editSettings.theme}
          title="Theme"
          type="radio"
        />
        <SettingToggle
          name="backgroundColor"
          description={settingDescriptions.backgroundColor}
          handleChange={handleSettingsChange}
          options={availableColors}
          selectedStyle={bgStyle}
          selectedValue={editSettings.backgroundColor}
          title="Background Color"
          type="dropdown"
        />
        <SettingToggle
          name="font"
          description={settingDescriptions.font}
          handleChange={handleSettingsChange}
          options={fonts}
          selectedStyle={fontStyle}
          selectedValue={editSettings.font}
          title="Font"
          type="radio"
        />
        <SettingToggle
          name="sidebarColor"
          description={settingDescriptions.sidebarColor}
          handleChange={handleSettingsChange}
          options={availableColors}
          selectedStyle={sbStyle}
          selectedValue={editSettings.sidebarColor}
          title="Sidebar Color"
          type="dropdown"
        />
        <SettingToggle
          name="accentColor"
          description={settingDescriptions.accentColor}
          handleChange={handleSettingsChange}
          options={availableColors}
          selectedStyle={acStyle}
          selectedValue={editSettings.accentColor}
          title="Accent Color"
          type="dropdown"
        />
      </RoundedContainer>
    </div>
  )
}

export default Settings
