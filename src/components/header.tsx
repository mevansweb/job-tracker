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
  // grid place-items-center border border-red-600 relative
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className={`${logo} h-25 w-87.5 bg-cover bg-center`}>
          <span className="relative left-37.5">{title}</span>
        </div>
        <div className="ml-20 flex flex-col items-center justify-center">
          <div className="">{middle}</div>
          <div className="">{greeting}</div>
        </div>
      </div>
      <Button
        className="size-min cursor-pointer"
        onClick={() => {
          if (state.loggedIn) {
            logout(state.email)
            dispatch({ type: 'SET_VIEW', view: 'sign-in' })
          } else {
            navigate('/')
          }
        }}
      >
        {state.loggedIn ? 'Log Out' : 'Log In'}
      </Button>
    </div>
  )
}

export default Header
