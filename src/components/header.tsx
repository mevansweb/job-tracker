import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from './providers/hooks'

const Header = ({ greeting, middle, title }: { greeting: string, middle: string, title: string }) => {
  const { dispatch, logout, state } = useAuth()
  const { theme } = state.settings || {}
  const navigate = useNavigate()
  const logo = theme === 'dark' ? `bg-[url('/job-tracker-logo-dark.png')]` : `bg-[url('/job-tracker-logo-light.png')]`
  // grid place-items-center border border-red-600 relative 
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className={`${logo} w-87.5 h-25 bg-center bg-cover`}>
          <span className="relative left-37.5">{title}</span>  
        </div>
        <div className="flex flex-col ml-20 justify-center items-center">
          <div className="">{middle}</div>
          <div className="">{greeting}</div>
        </div>
      </div>
      <Button className="cursor-pointer size-min" 
        onClick={() => { 
          if (state.loggedIn) {
            logout(state.email)
            dispatch({ type: 'SET_VIEW', view: 'sign-in' })
          } else {
            navigate('/')
          }
        }
      }>
        {state.loggedIn ? 'Log Out' : 'Log In'}
      </Button>
    </div>
  )
}

export default Header