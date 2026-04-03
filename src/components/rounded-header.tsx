import { useAuth } from '@/components/providers/hooks'
import { getStyles } from '@/global/functions'

export const RoundedHeader = ({ title }: { title: string }) => {
  const { state } = useAuth()
  const { accentColor, theme } = state.settings || { accentColor: '', theme: '' }
  const accentClasses = `${getStyles({ theme, name: 'accentColor', strKey: accentColor })}`

  return (
    <div
      className={`shadow-t-md shadow-l-md shadow-r-md rounded-tl-lg rounded-tr-lg border-t border-r border-b border-l px-4 py-2 ${accentClasses}`}
    >
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  )
}
