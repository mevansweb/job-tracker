import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function Child(props: { user: { name: string } }) {
  props.user.name = 'John'
  return <div>{props.user.name}</div>
}

function Parent() {
  const user = { name: 'Alex' }
  return <Child user={user} />
}

type ToggleProps = {
  isOn: boolean
  onToggle: (value: boolean) => void
  children: (args: { isOn: boolean; toggle: () => void }) => React.ReactNode
}

function Toggle({ isOn, onToggle, children }: ToggleProps) {
  return children({
    isOn,
    toggle: () => onToggle(!isOn),
  })
}

function Project({
  name,
  duration,
  status,
  type,
}: {
  name: string
  duration: string
  status: string
  type: string
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Duration: {duration}</p>
      <p>Status: {status}</p>
      <p>Type: {type}</p>
    </div>
  )
}

export const ReactBasics = () => {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)
  const [isMilestoneAchieved, setIsMilestoneAchieved] = useState(false)
  const [isOn, setIsOn] = useState(false)
  const [project] = useState({
    name: 'Website Redesign',
    duration: '3 months',
    status: 'In Progress',
    type: 'Personal Project',
  })

  const secondCount = count
  const obj = { value: count }

  if (count >= 5) {
    setIsMilestoneAchieved(true)
  }

  const handleClick = () => {
    setTimeout(() => {
      setCount2((prevCount) => prevCount + 1)
    }, 1000)
  }

  //console.log('Rendered')

  const [inputs, setInputs] = useState([{ id: 1, value: '' }])

  const addInput = () => {
    inputs.push({ id: inputs.length + 1, value: '' })
    //console.log('mutated inputs', inputs)
    setInputs(inputs)
  }

  const handleChange = (id: number, newValue: string) => {
    const updated = inputs.map((input) => (input.id === id ? { ...input, value: newValue } : input))
    setInputs(updated)
  }

  //console.log('current inputs', inputs)

  return (
    <div className="flex flex-col p-4">
      <div className="mx-auto grid w-200 gap-8 p-8">
        <h1 className="text-xl font-bold">
          Quiz: If You Can Answer These 10 React Questions: You are Above Average
        </h1>
        <a
          className="font-bold underline"
          target="_blank"
          href="https://medium.com/@basit.miyanjee/10-reactjs-conceptual-interview-quiz-questions-690c7b19a387"
        >
          View Article
        </a>
        <Card className="my-4 p-4">
          <h3>What happens when the Increment button is clicked?</h3>
          <pre>
            {`import {useState} from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const secondCount = count
  const obj = { value: count }

  return (
    <div>
      <p>Second Count: {secondCount}</p>
      <p>Object Value: {obj.value}</p>

      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}`}
          </pre>
          <p>Second Count: {secondCount}</p>
          <p>Object Value: {obj.value}</p>
          <Button className="mx-auto w-50" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
          {isMilestoneAchieved && <p>🎉 Milestone Achieved!</p>}
          <p className="text-sm italic">
            <strong>Answer:</strong> Both Second Count and Object Value update together
            <br />
            <strong>Explanation:</strong> Both values are derived from the same state and are
            recalculated on every render.
          </p>
          <h3>What happens when the Increment button is clicked?</h3>
          <pre>
            {`import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const [isMilestoneAchieved, setIsMilestoneAchieved] = useState(false)

  if (count >= 5) {
    setIsMilestoneAchieved(true)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {isMilestoneAchieved && <p>🎉 Milestone Achieved!</p>}
    </div>
  )
}`}
          </pre>
          <Button className="mx-auto w-50" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
          <p className="text-sm italic">
            <strong>Answer:</strong> The app crashes with “Too many re-renders” error when count
            reaches 5.
            <br />
            <strong>Explanation:</strong> Updating state inside the render phase causes an infinite
            loop.
          </p>
          <h3>Will component re-render?</h3>
          <pre>
            {`import { useState } from 'react'

function ResetButton() {
  const [value, setValue] = useState(0)

  const handleUpdate = () => {
    setValue(0)
  }

  //console.log('Rendered')

  return (
    <div>
      <span>{value}</span>
      <button onClick={handleUpdate}>Update</button>
    </div>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> The component re-renders every time the button is clicked
            <br />
            <strong>Explanation:</strong> React uses Object.is to compare the previous state and the
            next state.
          </p>
          <Button className="mx-auto w-30" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
        </Card>
        <Card className="my-4 p-4">
          <h3>What will be rendered when the Parent component is rendered?</h3>
          <pre>
            {`function Child(props) {
  props.user.name = 'John'
  return <div>{props.user.name}</div>
}

function Parent() {
  const user = { name: 'Alex' }
  return <Child user={user} />
}

export default Parent`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> John – The Child component mutates the user object passed from
            Parent.
            <br />
            <strong>Explanation:</strong> Props are read-only references in React, but JavaScript
            objects are passed by reference.
          </p>
          <Parent />
        </Card>
        <Card className="my-4 p-4">
          <h3>Which UI design pattern is used in the following code?</h3>
          <pre>
            {`import { useState } from 'react'

function Toggle({ isOn, onToggle, children }) {
  return children({
    isOn,
    toggle: () => onToggle(!isOn),
  })
}

function App() {
  const [isOn, setIsOn] = useState(false)

  return (
    <Toggle isOn={isOn} onToggle={setIsOn}>
      {({ isOn, toggle }) => (
        <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>
      )}
    </Toggle>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> Portal pattern (The Toggle component does not render any UI
            itself.)
            <br />
            <strong>Explanation:</strong>
          </p>
          <div className="text-sm italic">
            <ul className="list-inside list-disc">
              <li>
                The Component UI pattern is a fundamental design pattern in React that emphasizes
                the composition of components, allowing for a modular and scalable architecture. It
                is essential for maintaining a clean and maintainable codebase.
              </li>
              <li>
                The Polymorphic UI pattern is used when the UI needs to be flexible and can display
                different types of content based on the data it receives.
              </li>
              <li>
                The Portal pattern is used for rendering UI elements in a way that allows for easy
                navigation and interaction between different components.
              </li>
              <li>
                The Headless UI pattern is used when full styling freedom is required, allowing
                developers to create components that can be styled in any way they choose. Each
                pattern serves a different purpose and is used in different scenarios, depending on
                the requirements of the application and the design choices made by the developers.
              </li>
            </ul>
          </div>
          <Toggle isOn={isOn} onToggle={setIsOn}>
            {({ isOn, toggle }) => (
              <Button className="mx-auto w-30" onClick={toggle}>
                {isOn ? 'ON' : 'OFF'}
              </Button>
            )}
          </Toggle>
        </Card>
        <Card className="my-4 p-4">
          <h3>What happens if the Increment button is clicked 3 times quickly? (setTimeout)</h3>
          <pre>
            {`import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1)
    }, 1000)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}`}
          </pre>
          <p>Count: {count2}</p>
          <p className="text-sm italic">
            <strong>Answer:</strong> Count becomes 3 after 3 seconds
            <br />
            <strong>Explanation:</strong> Using the functional form of setCount ensures each
            increment uses the latest state, so all three clicks accumulate correctly.
          </p>
          <Button className="mx-auto w-30" onClick={handleClick}>
            Increment
          </Button>
        </Card>
        <Card className="my-4 p-4">
          <h3>What will be the value of type prop?</h3>
          <pre>
            {`function Project({ name, duration, status, type }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Duration: {duration}</p>
      <p>Status: {status}</p>
      <p>Type: {type}</p>
    </div>
  )
}

function App() {
  const [project] = useState({
    name: 'Website Redesign',
    duration: '3 months',
    status: 'In Progress',
    type: 'Personal Project',
  })

  return <Project {...project} type="Client Work" />
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> Type will be "Client Work" because explicitly passed props
            override the spread object
            <br />
            <strong>Explanation:</strong> When spreading an object into props, any explicitly passed
            props after the spread override the values from the object.
          </p>
          <Project {...project} type="Client Work" />
        </Card>
        <Card className="my-4 p-4">
          <h3>What is wrong with the following React component?</h3>
          <pre>
            {`
            function User({ isLoggedIn }) {
              if (isLoggedIn) {
                const [user, setUser] = useState({ name: 'Guest' })
              }

              return <div>Hello, {user ? user.name : 'Guest'}</div>
              }
            }
          `}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> React throws an error because hooks cannot be called
            conditionally
            <br />
            <strong>Explanation:</strong> Hooks must be called unconditionally in the same order on
            every render, and calling useState inside an if breaks this rule, causing a React error.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>What happens when you click the “Add Input” button?</h3>
          <pre>
            {`import { useState } from 'react'

function DynamicForm() {
  const [inputs, setInputs] = useState([{ id: 1, value: '' }])

  const addInput = () => {
    inputs.push({ id: inputs.length + 1, value: '' })
    setInputs(inputs)
  }

  const handleChange = (id, newValue) => {
    const updated = inputs.map((input) =>
      input.id === id ? { ...input, value: newValue } : input,
    )
    setInputs(updated)
  }

  return (
    <div>
      {inputs.map((input) => (
        <input
          key={input.id}
          value={input.value}
          onChange={(e) => handleChange(input.id, e.target.value)}
        />
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  )
}

export default DynamicForm`}
          </pre>
          {inputs.map((input) => (
            <Input
              key={input.id}
              value={input.value}
              onChange={(e) => handleChange(input.id, e.target.value)}
            />
          ))}
          <Button className="mx-auto w-30" onClick={addInput}>
            Add Input
          </Button>
          <p className="text-sm italic">
            <strong>Answer:</strong> Nothing happens — no new input appears
            <br />
            <strong>Explanation:</strong> The addInput function mutates the array directly with
            inputs.push() and then passes the same array reference to setInputs() In React, when you
            use useState, the state value you get is immutable in terms of React’s reactivity —
            meaning mutating it directly (e.g., with .push()) will not trigger a re-render unless
            you call the state setter function.
          </p>
          <div className="text-sm italic">
            <ul className="list-inside list-disc">
              <li>Why .push() doesn’t work as expected</li>
              <li>.push() mutates the existing array in place.</li>
              <li>
                React does not detect that the state has changed if the reference to the array stays
                the same.
              </li>
              <li>
                Without calling the setter returned by useState, React won’t schedule a re-render.
              </li>
            </ul>
          </div>
        </Card>
        {/*
        <Card className="p-4 my-4">
          <h3></h3>
          <p className="italic text-sm">
            <strong>Answer:</strong><br />
            <strong>Explanation:</strong>
          </p>
        </Card>
        */}
      </div>
    </div>
  )
}
