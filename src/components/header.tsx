import { Button } from '@/components/ui/button'

import { useAuth } from './providers/hooks'

const Header = ({ greeting, middle, title }: { greeting: string, middle: string, title: string }) => {
  const { dispatch, logout, state } = useAuth()
  return (
    <div className="flex justify-between">
      {title}
      <div className="flex items-center">
        <span className="mr-2">{greeting}</span>
      </div>
      {middle}
      <Button className="cursor-pointer size-min" 
        onClick={() => { 
          logout(state.email)
          dispatch({ type: 'SET_VIEW', view: 'sign-in' })
        }
      }>
        Log Out
      </Button>
    </div>
  )
}

export default Header