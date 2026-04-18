import { useCallback, useEffect, useState } from 'react'

import bcrypt from 'bcryptjs'

//import { v4 as uuidv4 } from 'uuid'

import { Dashboard } from '@/components/dashboard'
import { type Action } from '@/components/providers/auth-provider'
import { localStorageKey } from '@/components/providers/const'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validatePassword } from '@/functions/validation'
import type { ApiResult } from '@/global/types'

const salt = bcrypt.genSaltSync(10)

const loadData = (
  user: ApiResult,
  to: string[],
  dispatch: React.ActionDispatch<[action: Action]>,
  existing: undefined | ApiResult
) => {
  if (to.includes('localStorage')) {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        id: user._id ? user._id : user.id,
        email: user.email,
        jobs: user.jobs || [],
        loggedIn: true,
        notes: user.notes || [],
        resume: user.resume,
        tasks: user.tasks || [],
        settings: user.settings,
      })
    )
  } else {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        ...existing,
        loggedIn: true,
      })
    )
  }
  if (to.includes('state')) {
    dispatch({
      type: 'SET_ALL_DATA',
      email: user.email,
      error: '',
      id: user._id,
      jobs: user?.jobs || [],
      loggedIn: true,
      notes: user?.notes || [],
      password: user.hashedPassword,
      resume: user.resume,
      tasks: user?.tasks || [],
      settings: user.settings,
      view: 'sign-in',
    })
  }
}

const Home = () => {
  const { data, dispatch, existing, postData, state } = useAuth()
  //const uuid = uuidv4()
  const [errors, setErrors] = useState<string[]>([])
  const [loadFromStorage, setLoadFromStorage] = useState<boolean>(true)

  const update = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: add validation to compare passwords
      const { name, value } = event.target
      if (name === 'email') {
        dispatch({ type: 'SET_EMAIL', email: value })
      }
      if (name === 'password') {
        dispatch({ type: 'SET_PASSWORD', password: value })
      }
    },
    [dispatch]
  )

  const handleLogin = useCallback(async () => {
    const { email, password, view } = state
    let hashedPassword = ''
    // check if user exists
    const response = await postData('POST', { email, form: view })
    if (data) {
      if (view === 'create-account') {
        setErrors(['An account with this email already exists.'])
      }
      if (view === 'forgot-password') {
        const err = validatePassword(password)
        setErrors(err)
        if (err.length === 0) {
          hashedPassword = bcrypt.hashSync(password, data.salt)
          await postData('PUT', { email, hashedPassword, salt: data.salt, form: view })
        }
      }
    } else {
      if (view === 'sign-in') {
        if (response === undefined) {
          setErrors(['There was no response from the server.'])
          setLoadFromStorage(true)
        } else {
          setErrors([
            'We were unable to find an account associated with this email address. Please create a new account.',
          ])
        }
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

  const loadFromLocalStorage = useCallback(() => {
    loadData(existing as ApiResult, ['state'], dispatch, existing as ApiResult)
    setErrors([])
  }, [dispatch, existing])

  useEffect(() => {
    if (data && state.view === 'sign-in') {
      const user = data as ApiResult
      bcrypt.compare(state.password, user.hashedPassword, function (_err, res) {
        if (res) {
          loadData(user, ['state', 'localStorage'], dispatch, existing as ApiResult)
          setErrors([])
        } else if (res === false) {
          setErrors(['The password you have entered is incorrect.'])
        }
      })
    }
  })

  return state.loggedIn ? (
    <Dashboard />
  ) : (
    <div className="relative inset-0 m-auto mt-36 w-md flex-col rounded-xl border border-gray-200 p-10 shadow-sm">
      {state.view === 'sign-in' ? (
        <>
          <h1 className="text-center">Sign in to Job Tracker</h1>
          <Input
            className="mt-4"
            name="email"
            onChange={update}
            required={true}
            placeholder={'Email'}
          />
          <Input
            className="mt-4"
            name="password"
            onChange={update}
            required={true}
            placeholder={'Password'}
          />
          <div className="flex">
            <Button className="mx-auto mt-8 w-24 cursor-pointer" onClick={handleLogin}>
              Log In
            </Button>
          </div>
          <div className="mt-4 flex flex-col text-center text-sm">
            Don't have a Job Tracker account?
            <Button
              className="m-0 mx-auto h-auto cursor-pointer p-0 text-left font-normal whitespace-normal text-blue-500"
              variant="link"
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'create-account' })}
            >
              Create your Job Tracker account
            </Button>
            <Button
              className="m-0 mx-auto h-auto cursor-pointer p-0 text-left font-normal whitespace-normal text-blue-500"
              variant="link"
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'forgot-password' })}
            >
              Forgot password?
            </Button>
          </div>
        </>
      ) : state.view === 'forgot-password' ? (
        <>
          <h1 className="text-center">Forgot Password?</h1>
          <Input
            className="mt-4"
            name="email"
            onChange={update}
            required={true}
            placeholder={'Email'}
          />
          <Input
            className="mt-4"
            name="password"
            onChange={update}
            required={true}
            placeholder={'Password'}
            type="password"
          />
          <Input
            className="mt-4"
            name="confirm-password"
            onChange={update}
            required={true}
            placeholder={'Confirm Password'}
            type="password"
          />
          <div className="flex">
            <Button className="mx-auto mt-8 w-auto cursor-pointer" onClick={handleLogin}>
              Reset my Password
            </Button>
          </div>
          <div className="mt-4 flex flex-col text-center text-sm">
            <Button
              className="m-0 mx-auto h-auto cursor-pointer p-0 text-left font-normal whitespace-normal text-blue-500"
              variant="link"
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'sign-in' })}
            >
              Sign In
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center">Create Your Job Tracker Account</h1>
          <Input
            className="mt-4"
            name="email"
            onChange={update}
            required={true}
            placeholder={'Email'}
            type="email"
          />
          <Input
            className="mt-4"
            name="password"
            onChange={update}
            required={true}
            placeholder={'Password'}
            type="password"
          />
          <Input
            className="mt-4"
            name="confirm-password"
            onChange={update}
            required={true}
            placeholder={'Confirm Password'}
            type="password"
          />
          <div className="flex">
            <Button className="mx-auto mt-8 w-24 cursor-pointer" onClick={handleLogin}>
              Log In
            </Button>
          </div>
          <div className="mt-4 flex flex-col text-center text-sm">
            Have a Job Tracker account?
            <Button
              className="m-0 mx-auto h-auto cursor-pointer p-0 text-left font-normal whitespace-normal text-blue-500"
              variant="link"
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'sign-in' })}
            >
              Sign In
            </Button>
          </div>
        </>
      )}
      {errors.map((err) => (
        <div
          key={`${err.replace(/ /g, '-')}`}
          className="mt-2 flex flex-col text-center text-xs text-red-500"
        >
          {err}
        </div>
      ))}
      {loadFromStorage &&
      errors.includes('There was no response from the server.') &&
      existing &&
      existing.email ? (
        <div className="mt-4 flex justify-center">
          <Button
            className="w-60 cursor-pointer"
            onClick={() => {
              loadFromLocalStorage()
              setLoadFromStorage(false)
            }}
          >
            Load Data from This Browser ?
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default Home
