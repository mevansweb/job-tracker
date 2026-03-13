import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'
import equal from 'fast-deep-equal'
import { CircleChevronRight } from 'lucide-react'

import Header from '@/components/header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'

import { practiceQuestions } from './practice-questions'

const convertArray = (arr: string[]) => {
  const isAllNumbers =  arr.every((item) => typeof item === 'number' && !Number.isNaN(item))
  if (isAllNumbers) {
    return arr.map(Number)
  }
  return arr.map((str: string) => { return str.trim()}).filter((str) => str.length > 0)
}

const Practice = () => {
  const [code, setCode] = useState('')
  const [answer, setAnswer] = useState<number[] | string[] | string>('')
  const [question, setQuestion] = useState<number>(0)
  const defaultInput = useMemo(() => {
    const first = practiceQuestions[question].exampleInput
    if (first.includes(',')) {
      const splitInput = first.split(',')
      return convertArray(splitInput)
    } else {
      return first.trim()
    }
  }, [])
  const correctAnswer = useMemo(() => {
    const expectedStr = practiceQuestions[question].shouldReturn
    if (expectedStr.includes(',')) {
      const splitInput = expectedStr.split(',')
      return convertArray(splitInput)
    } else {
      return expectedStr.trim()
    }
  }, [question])

  const isCorrect = useMemo(() => equal(correctAnswer, answer), [correctAnswer, answer])

  const [input, setInput] = useState<number[] | string[] | string>(defaultInput)
  
  const processInput = useCallback((inputText: string) => {
    if (inputText.includes(',')) {
      const splitInput = inputText.split(',')
      const convertedArray = convertArray(splitInput)
      setInput(convertedArray)
    } else {
      setInput(inputText.trim())
    }
  }, [setInput])

  const runFunction = useCallback(() => {
    try {
      const func = new Function('x', code)
      const output = func(input);
      setAnswer(output);
    } catch (err) {
      const error = err as Error
      toast.error("Error: " + error.message);
    }
  }, [code, input, setAnswer])
  
  return (
    <div className="p-4 flex flex-col">
      <Header
        greeting="Practice Questions and solutions."
        middle=""
        title="Practice Page"
      />
      <div className="flex flex-col gap-8 mx-auto w-200">
        <Field>
          <FieldLabel htmlFor="textarea-message">Question #{question + 1}:</FieldLabel>
          <FieldDescription>{practiceQuestions[question].question}</FieldDescription>
          <FieldDescription>Example input: // {practiceQuestions[question].exampleInput}</FieldDescription>
          <FieldDescription>Should return: // {practiceQuestions[question].shouldReturn}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-message">Your Code:</FieldLabel>
          <FieldDescription>Enter the body of your function below (without the outer function), assuming that x is the function's argument.</FieldDescription>
          <Textarea
            className="font-mono h-80"
            id="text-area-code"
            placeholder="Enter your code here"
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-message">Your function argument(s):</FieldLabel>
          <FieldDescription>Enter your function's input below (e.g. numbers or strings separated by commas for an array, or a string).</FieldDescription>
          <Input
            onChange={(e) => processInput(e.target.value)}
            value={Array.isArray(input) ? input.join(',') : input}
          />
        </Field>
        {answer ? (
          <Field>
            <FieldLabel htmlFor="textarea-message">Your function's return value: {isCorrect ? ( <span className="font-bold text-green-500">Correct!</span>): null }</FieldLabel>
            <code 
              className={`${isCorrect? 'light:bg-green-100 dark:bg-green-900' : 'light:bg-red-100 dark:bg-red-900'} border border-gray-200 p-2 rounded-lg`}
            >
              {Array.isArray(answer) ? answer.join(',') : answer}
            </code>
          </Field>
          ) : null}
        <div className="flex justify-end gap-8">
          <Button
            className="w-40 light:bg-gray-500 dark:bg-gray-400"
            id="changeQuestion"
            onClick={() => {
              const next = question + 1 !== practiceQuestions.length ? question + 1 : 1
              setQuestion(next)
            }}
          >
            Next Question
            <CircleChevronRight />
          </Button>
          <Button 
            className="w-40" 
            onClick={runFunction}
          >
            Run Code
            <CircleChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )

}

export default Practice