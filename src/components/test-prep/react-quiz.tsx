//import { useEffect } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { Card } from '@/components/ui/card'

/* 
// question: What happens when you pass an array to the style prop in React?
function Box() {
  const styles = {
    container: { backgroundColor: 'blue' },
    text: { color: 'white' },
  }
  return <div style={[styles.container, styles.text]}>Hello World</div>
} */

/*
// question: What will be rendered on the screen?
function App() {
  const data = []
  const var1 = 10
  const var2 = 0

  return (
    <div>
      {data.length && <p>Data Loaded</p>}
      {var1 && <p>Var1 is {var1}</p>}
      {var2 && <p>Var2 is {var2}</p>}
    </div>
  )
}
*/

export const ReactQuiz = () => {
  const data = []
  const var1 = 10
  const var2 = 0
  const [swap, setSwap] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [top, setTop] = useState<number>(0)

  useLayoutEffect(() => {
    if (!ref.current) return

    const height = ref.current.getBoundingClientRect().height
    setTop(window.innerHeight / 2 - height / 2)
  }, [])

  return (
    <div className="flex flex-col p-4">
      <div className="mx-auto grid w-200 gap-8 p-8">
        <h1 className="text-xl font-bold">
          Quiz: 80% of React developers can’t answer all of these questions correctly
        </h1>
        <a
          className="font-bold underline"
          target="_blank"
          href="https://medium.com/@basit.miyanjee/80-of-react-developers-cant-answer-all-of-these-questions-correctly-fa735915637a"
        >
          View Article
        </a>
        <Card className="my-4 p-4">
          <h3>
            Question 01: In a standard React (Web) environment, what happens when you pass an array
            to the style prop as shown below?
          </h3>
          <pre>
            {`const styles = {
  container: { backgroundColor: 'blue' },
  text: { color: 'white' }
};

function Box() {
  return (
    <div style={[styles.container, styles.text]}>
      Hello World
    </div>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong> React will throw an error or ignore the styles because the
            style prop expects a single object, not an array.
            <br />
            <strong>Explanation:</strong> Don’t confuse it with react native; the style prop in
            React works differently from React Native.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>Question 02: What will be rendered on the screen?</h3>
          <pre>
            {`function App() {
  const data = []
  const var1 = 10
  const var2 = 0

  return (
    <div>
      {data.length && <p>Data Loaded</p>}
      {var1 && <p>Var1 is {var1}</p>}
      {var2 && <p>Var2 is {var2}</p>}
    </div>
  )
}

export default App`}
          </pre>
          <div>
            {data.length && <p>Data Loaded</p>}
            {var1 && <p>Var1 is {var1}</p>}
            {var2 && <p>Var2 is {var2}</p>}
          </div>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            0, “Var1 is 10”, 0
            <br />
            <strong>Explanation:</strong>
            In JSX, && returns the first falsy value, and 0 is rendered as text.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 03: Why is it considered invalid to define a useEffect hook as an async
            function directly?
          </h3>
          <pre>
            {`import { useEffect } from 'react'

function App() {
  useEffect(async () => {
    const res = await fetch('https://api.example.com/data')
    const data = await res.json()
    console.log(data)
  }, [])

  return <div>Check console</div>
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            Because an async function returns a Promise, but useEffect expects either nothing or a
            cleanup function
            <br />
            <strong>Explanation:</strong>
            Cleanup functions must be synchronous to ensure they run immediately before the next
            render or unmount. If React tried to await a Promise for cleanup, it could block the
            render cycle or cause unpredictable behavior
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 04: Which statement is correct about using index as a key in the following
            React code?
          </h3>
          <pre>
            {`function WeekDays() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <ul>
      {days.map((day, index) => (
        <li key={index}>{day}</li>
      ))}
    </ul>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            Using index as a key is always a bad practice and should never be used
            <br />
            <strong>Explanation:</strong>
            In the above case, weekdays will always remain the same. However, if the list were
            dynamic (items could be added, removed, or reordered), using index as a key could lead
            to issues with component state and performance. It’s generally recommended to use a
            unique identifier for keys whenever possible.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 05: In React, why does the following code snippet result in a syntax error?
          </h3>
          <pre>
            {`function App() {
  return (
    <h1>Hello</h1>
    <p>Welcome to React</p>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            JSX is converted into a single React.createElement call, and a function cannot return
            two values.
            <br />
            <strong>Explanation:</strong>
            Every JSX tag you write turns into a JavaScript function call, and a return statement
            can only pass back one result.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 06: In the following component, what happens to the focus and the value of the
            input field when the “Swap” button is clicked?
          </h3>
          <pre>
            {`import { useState } from 'react'

function App() {
  const [swap, setSwap] = useState(false)

  return (
    <>
      {swap ? (
        <input key="b" placeholder="B" />
      ) : (
        <input key="a" placeholder="A" />
      )}

      <button onClick={() => setSwap((s) => !s)}>Swap</button>
    </>
  )
}

export default App`}
          </pre>
          {swap ? <input key="b" placeholder="B" /> : <input key="a" placeholder="A" />}

          <button onClick={() => setSwap((s) => !s)}>Swap</button>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            React destroys the old input and creates a new one because the key has changed,
            resetting all state and focus.
            <br />
            <strong>Explanation:</strong>
            React uses the key as a unique ID; if the ID changes, React assumes the component is
            entirely new.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 07: In the following component, what is the main architectural concern
            regarding the tax state?
          </h3>
          <pre>
            {`import { useEffect, useState } from 'react'

function App() {
  const [price, setPrice] = useState(10)
  const [tax, setTax] = useState(0)

  useEffect(() => {
    setTax(price * 2)
  }, [price])

  return <p>Tax: {tax}</p>
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            tax is derived from price, so storing it in state is unnecessary and makes the component
            less predictable
            <br />
            <strong>Explanation:</strong>
            If a value can be calculated using existing state or props, you usually don’t need a new
            useState or useEffect for it.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 08: In the following React 19+ (TS) code, what happens to the text typed into
            the Form input when the mode toggles from "visible" to "hidden" and back to "visible"?
          </h3>
          <pre>
            {`import { Activity, useState, type ChangeEvent } from 'react'

function Form() {
  const [text, setText] = useState<string>('')

  return (
    <input
      value={text}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
      placeholder="Type something"
    />
  )
}

export default function App() {
  const [mode, setMode] = useState<'visible' | 'hidden'>('visible')

  return (
    <>
      <button
        onClick={() => setMode((m) => (m === 'visible' ? 'hidden' : 'visible'))}
      >
        Toggle
      </button>

      <Activity mode={mode}>
        <Form />
      </Activity>
    </>
  )
}`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            The component stays mounted in the background, preserving the text state and DOM values.
            <br />
            <strong>Explanation:</strong>
            Think of this component as putting a tab in the background; it’s not closed, just
            temporarily tucked away.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 09: An intern comes to you complaining that their code runs without errors his
            React code is not working. Can you spot the mistake within 2 seconds?
          </h3>
          <pre>
            {`import header from './Header'

function App() {
  return (
    <div>
      <header />
    </div>
  )
}

export default App`}
          </pre>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            React components must start with a capital letter to be recognized as custom components.
            <br />
            <strong>Explanation:</strong>
            React treats lowercase tags as plain HTML and uppercase tags as custom components.
          </p>
        </Card>
        <Card className="my-4 p-4">
          <h3>
            Question 10: In the following Modal component, the user notices that when the modal
            opens, it briefly appears at the very top of the screen before "jumping" to the center.
            What is the most effective way to fix this visual flicker?
          </h3>
          <pre>
            {`import { useEffect, useRef, useState } from 'react'

function Modal() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [top, setTop] = useState<number>(0)

  useEffect(() => {
    if (!ref.current) return

    const height = ref.current.getBoundingClientRect().height
    setTop(window.innerHeight / 2 - height / 2)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: top,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '20px',
      }}
    >
      Centered Modal
    </div>
  )
}

export default Modal`}
          </pre>
          <div
            ref={ref}
            style={{
              position: 'absolute',
              top: top,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: '20px',
            }}
          >
            Centered Modal
          </div>
          <p className="text-sm italic">
            <strong>Answer:</strong>
            Replace useEffect with useLayoutEffect to avoid layout shift
            <br />
            <strong>Explanation:</strong>
            One hook runs after the screen updates, while the other runs synchronously before the
            browser paints the pixels. <br />
            Why useEffect Causes Flicker In a modal example, you might: Render the modal container.
            Measure its width/height (e.g., with getBoundingClientRect). Update state (e.g.,
            setModalWidth) to adjust content or layout. If you do this in useEffect, the browser has
            already painted the initial modal, so the state update can cause a brief flash before
            the new layout is applied. <br />
            Why useLayoutEffect Prevents Flicker useLayoutEffect runs synchronously before the
            browser paints the screen. This means: DOM measurements happen before the visual update.
            Any state updates inside it are applied before the next paint cycle. No flash occurs
            because the browser doesn’t show the old state while the new one is being computed
          </p>
        </Card>
      </div>
    </div>
  )
}

/*
<Card className="my-4 p-4">
<h3>
</h3>
<pre>
  {``}
</pre>
<p className="text-sm italic">
  <strong>Answer:</strong> 
  <br />
  <strong>Explanation:</strong>
</p>
</Card>*/
