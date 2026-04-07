import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'

const Header = ({
  greeting,
  middle,
  title,
}: {
  greeting: string
  middle: string
  title: string
}) => {
  const { dispatch, logout, state } = useAuth()
  const { theme } = state.settings || {}
  const navigate = useNavigate()
  const logo =
    theme === 'dark'
      ? `bg-[url('/job-tracker-logo-dark.png')]`
      : `bg-[url('/job-tracker-logo-light.png')]`

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="md:hidden">Job Tracker &gt; {title}</div>
        <div className={`${logo} h-25 bg-cover bg-center max-md:hidden md:w-87.5`}>
          <span className="relative left-37.5">{title}</span>
        </div>
        <div className="ml-20 flex flex-col items-center justify-center">
          <div className="">{middle}</div>
          <div className="">{greeting}</div>
        </div>
      </div>
      <Button
        className="size-min cursor-pointer"
        onClick={async () => {
          if (state.loggedIn) {
            logout(state.email)
            dispatch({ type: 'SET_VIEW', view: 'sign-in' })
          } else {
            await navigate('/')
          }
        }}
      >
        {state.loggedIn ? 'Log Out' : 'Log In'}
      </Button>
    </div>
  )
}

export default Header
