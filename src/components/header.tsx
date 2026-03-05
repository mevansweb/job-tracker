import { useNavigate } from 'react-router-dom'

import lightLogo from '@/assets/job-tracker-logo-light.png'
import { Button } from '@/components/ui/button'
import { useAuth } from './providers/hooks'

const Header = ({ greeting, middle, title }: { greeting: string, middle: string, title: string }) => {
  const { dispatch, logout, state } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="flex flex-col">
          <img src={lightLogo} alt="Job Tracker Logo" width="350" />
          <div className="absolute left-[210px] top-[20px]">{title}</div>
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