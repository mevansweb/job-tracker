import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'
import equal from 'fast-deep-equal'
import { CircleChevronRight } from 'lucide-react'

import Header from '@/components/header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'

import { easyQuestions } from './practice-questions'

const convertArray = (arr: string[]) => {
  const isAllNumbers = arr.every((item) => !Number.isNaN(item))
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
    const first = easyQuestions[question].exampleInput
    if (first.includes(',')) {
      const splitInput = first.split(',')
      return convertArray(splitInput)
    } else {
      return first.trim()
    }
  }, [])

  const [input, setInput] = useState<number[] | string[] | string>(defaultInput)

  const correctAnswer = useMemo(() => {
    let expectedStr = easyQuestions[question].shouldReturn
    const defaultInput = easyQuestions[question].exampleInput

    if (input.length > 0 && input !== defaultInput) {
      // recalculate the correct answer if inputs were changed
      const solutionCode = easyQuestions[question].solution
      try {
        let corrected: string[] | number[] | string = input
        if (Array.isArray(input) && input.every(item => typeof item === 'string')) {
          corrected = convertArray(input as string[])
        }
        const func = new Function('x', solutionCode)
        const output = func(corrected);
        return output
      } catch (err) {
        const error = err as Error
        toast.error("Error: " + error.message);
      }
    }
    // otherwise get correct answer from defaults
    if (typeof expectedStr === 'string' && expectedStr.includes(',')) {
      const splitInput = expectedStr.split(',')
      return convertArray(splitInput)
    } else if (typeof expectedStr === 'string') {
      return expectedStr.trim()
    }
  }, [input, question])

  const isCorrect = useMemo(() => {
    if (Array.isArray(correctAnswer) && Array.isArray(answer)) {
      return equal(correctAnswer, answer)
    } else if (typeof correctAnswer === 'string' && typeof answer === 'string') {
      return correctAnswer.trim() === answer.trim()
    } else if (typeof answer === 'boolean' && typeof correctAnswer === 'string') {
      return correctAnswer === String(answer)
    } else {
      return correctAnswer == answer
    }
  }, [correctAnswer, answer])

  const processInput = useCallback((inputText: string) => {
    if (inputText.includes(',') && !inputText.endsWith(',')) {
      const splitInput = inputText.split(',')
      const convertedArray = convertArray(splitInput)
      setInput(convertedArray)
    } else {
      setInput(inputText)
    }
  }, [setInput])

  const runFunction = useCallback(() => {
    try {
      let corrected: string[] | number[] | string = input
      if (Array.isArray(input) && input.every(item => typeof item === 'string')) {
        corrected = convertArray(input as string[])
      }
      const func = new Function('x', code)
      const output = func(corrected);
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
          <FieldDescription>{easyQuestions[question].question}</FieldDescription>
          <FieldDescription>Example input: // {easyQuestions[question].exampleInput}</FieldDescription>
          <FieldDescription>Should return: // {easyQuestions[question].shouldReturn}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="textarea-message">Your Code:</FieldLabel>
          <FieldDescription>Enter the body of your function below (without the outer function), assuming that x is the function's argument.</FieldDescription>
          <Textarea
            tabIndex={-1}
            className="font-mono h-80"
            id="text-area-code"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here"
            spellCheck={false}
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
              {Array.isArray(answer) ? answer.join(',') : String(answer)}
            </code>
          </Field>
          ) : null}
        <div className="flex justify-end gap-8">
          <Button
            className="w-40 light:bg-gray-500 dark:bg-gray-400"
            id="changeQuestion"
            onClick={() => {
              const next = question + 1 !== easyQuestions.length ? question + 1 : 1
              setCode('')
              setInput(easyQuestions[next].exampleInput)
              setAnswer('')
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