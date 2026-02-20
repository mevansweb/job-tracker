import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

import { validatePassword } from '@/functions/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dashboard } from '@/components/dashboard'
import type { ApiResult } from '@/global/types'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'

const salt = bcrypt.genSaltSync(10)

const Home = () => {
  const { data, dispatch, existing, postData, state } = useAuth()
  const uuid = uuidv4()
  const [errors, setErrors] = useState<string[]>([])

  const update = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: add validation to compare passwords
    const { name, value } = event.target
    if (name === 'email') {
      dispatch({ type: 'SET_EMAIL', email: value})
    }
    if (name === 'password') {
      dispatch({ type: 'SET_PASSWORD', password: value})
    }
  }, [dispatch])

  const handleSubmit = useCallback(async () => {
    const { email, password, view } = state
    let hashedPassword = ''
    // check if user exists
    await postData('POST', { email, form: view })
    if (data) {
      if (view === 'create-account') {
        setErrors(['An account with this email already exists.'])
      }
      if (view === 'forgot-password') {
        const err = validatePassword(password)
        setErrors(err)
        if (err.length === 0) {
          hashedPassword = bcrypt.hashSync(password, data.salt)
          postData('PUT', { email, hashedPassword, salt: data.salt, form: view })
        }
      }
      
    } else {
      if (view === 'sign-in') {
        setErrors(['We were unable to find an account associated with this email address. Please create a new account.'])
      }
      if (view === 'create-account') {
        const err = validatePassword(password)
        setErrors(err)
        if (err.length === 0) {
          hashedPassword = bcrypt.hashSync(password, salt)
          await postData('POST', { email, hashedPassword, salt, jobs: [], form: view })
        } 
      }
    } 
  }, [data, state, postData])
  
  useEffect(() => {
    if (!existing && data && state.view === 'sign-in') {
      const user = data as ApiResult
      bcrypt.compare(state.password, user.hashedPassword, function(_err, res) {
        if (res) {
          localStorage.setItem(localStorageKey, JSON.stringify({ id: user._id, email: user.email, jobs: user.jobs || []}))
          dispatch({ type: 'SET_ALL_DATA', email: user.email, error: '', loggedIn: true, password: user.hashedPassword, jobs: user?.jobs || [], tasks: user?.tasks || [], view: 'sign-in' })
          setErrors([])
        } else if (res === false) {
          setErrors(['The password you have entered is incorrect.'])
        }
      })
    }
  }, [data, existing, state, dispatch, uuid])

  return state.loggedIn || existing ? <Dashboard /> : (
    <div className="relative inset-0 flex-col m-auto mt-36 w-md border border-gray-200 rounded-xl p-10 shadow-sm">
      {state.view === 'sign-in' ? (
        <>
          <h1 className="text-center">Sign in to Job Tracker</h1>
          <Input className="mt-4" name="email" onChange={update} required={true} placeholder={"Email"} />
          <Input className="mt-4" name="password" onChange={update} required={true} placeholder={"Password"} />
          <div className="flex">
            <Button className="mt-8 mx-auto w-24 cursor-pointer" onClick={handleSubmit}>Log In</Button>
          </div>
          <div className="flex flex-col mt-4 text-center text-sm">
            Don't have a Job Tracker account?
            <Button className="cursor-pointer font-normal text-left h-auto p-0 m-0 whitespace-normal mx-auto text-blue-500" variant="link" onClick={() => dispatch({ type: 'SET_VIEW', view: 'create-account'})}>
              Create your Job Tracker account
            </Button>
            <Button className="cursor-pointer font-normal text-left h-auto p-0 m-0 whitespace-normal mx-auto text-blue-500" variant="link" onClick={() => dispatch({ type: 'SET_VIEW', view: 'forgot-password' })}>
              Forgot password?
            </Button>
          </div>
        </>
      ) : state.view === 'forgot-password' ? (
        <>
          <h1 className="text-center">Forgot Password?</h1>
          <Input className="mt-4" name="email" onChange={update} required={true} placeholder={"Email"} />
          <Input className="mt-4" name="password" onChange={update} required={true} placeholder={"Password"} type="password" />
          <Input className="mt-4" name="confirm-password" onChange={update} required={true} placeholder={"Confirm Password"} type="password" />
          <div className="flex">
            <Button className="mt-8 mx-auto w-auto cursor-pointer" onClick={handleSubmit}>Reset my Password</Button>
          </div>
          <div className="flex flex-col mt-4 text-center text-sm">
            <Button className="cursor-pointer font-normal text-left h-auto p-0 m-0 whitespace-normal mx-auto text-blue-500" variant="link" onClick={() => dispatch({ type: 'SET_VIEW', view: 'sign-in' })}>
              Sign In
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center">Create Your Job Tracker Account</h1>
          <Input className="mt-4" name="email" onChange={update} required={true} placeholder={"Email"} type="email" />
          <Input className="mt-4" name="password" onChange={update} required={true} placeholder={"Password"} type="password" />
          <Input className="mt-4" name="confirm-password" onChange={update} required={true} placeholder={"Confirm Password"} type="password" />
          <div className="flex">
            <Button className="mt-8 mx-auto w-24 cursor-pointer" onClick={handleSubmit}>Log In</Button>
          </div>
          <div className="flex flex-col mt-4 text-center text-sm">
            Have a Job Tracker account?
            <Button className="cursor-pointer font-normal text-left h-auto p-0 m-0 whitespace-normal mx-auto text-blue-500" variant="link" onClick={() => dispatch({ type: 'SET_VIEW', view: 'sign-in' })}>
              Sign In
            </Button>
          </div>
        </>
      )}
      {errors.map((err) => (
        <div key={`${err.replace(/ /g, '-')}`} className="flex flex-col text-red-500 text-xs text-center mt-2">
          {err}
        </div>
      ))}
  </div>
  )
}

export default Home