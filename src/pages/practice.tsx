import { useCallback, useMemo, useState } from 'react'

import { CircleChevronLeft, CircleChevronRight, Eye } from 'lucide-react'

import equal from 'fast-deep-equal'
import { toast } from 'sonner'

import { ErrorMessage } from '@/components/error-message'
import Header from '@/components/header/header'
import { RoundedContainer } from '@/components/rounded-container'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type PracticeQuestion } from '@/global/types'

import { problems1, problems2 } from './practice-questions'

type InputType = string[] | number[] | string | number | object[]

const isNumeric = (str: InputType) => {
  if (typeof str !== 'string') return false
  if (str.trim() === '') return false
  return !isNaN(Number(str)) && isFinite(Number(str))
}

const convertArray = (arr: string[]) => {
  const isAllNumbers = arr.every((item) => {
    return !Number.isNaN(item)
  })
  if (isAllNumbers) {
    return arr.map(Number)
  }
  return arr
    .map((str: string) => {
      return str.trim()
    })
    .filter((str) => str.length > 0)
}

const getFunctionOutput = (input: InputType, code: string, secondInput?: InputType) => {
  const corrected = getProcessedInputs(input)
  if (corrected && secondInput) {
    const corrected2 = getProcessedInputs(secondInput)
    const func = new Function('x', 'y', code)
    return func(corrected, corrected2)
  } else if (corrected) {
    const func = new Function('x', code)
    return func(corrected)
  }
}

const notFinishedTyping = (input: InputType) => {
  return typeof input === 'string' && (input.endsWith(',') || input.endsWith('-'))
}

const getCorrectAnswer = ({
  input,
  question,
  secondInput,
}: {
  input: InputType
  question: PracticeQuestion
  secondInput?: InputType
}) => {
  const expectedStr = question.shouldReturn
  const defaultInput = question.exampleInput
  if (input && !notFinishedTyping(input) && input !== defaultInput) {
    // recalculate the correct answer if inputs were changed
    const solutionCode = question.solution
    try {
      return getFunctionOutput(input, solutionCode, secondInput ?? '')
    } catch (err) {
      const error = err as Error
      toast.error('Error: ' + error.message)
    }
  }
  // otherwise get correct answer from defaults
  if (typeof expectedStr === 'string' && expectedStr.includes(',')) {
    if (expectedStr.startsWith('{') && expectedStr.endsWith('}')) {
      return expectedStr
    }
    const splitInput = expectedStr.split(',')
    return convertArray(splitInput)
  } else if (typeof expectedStr === 'string') {
    return expectedStr.trim()
  } else {
    return expectedStr
  }
}

const hasRequiredInputs = ({
  code,
  input,
  question,
  secondInput,
}: {
  code: string
  input: InputType
  question: PracticeQuestion
  secondInput?: InputType
}) => {
  const missing: string[] = []
  if (!code) {
    missing.push('Your Code')
  }
  if (!input) {
    missing.push('Your first function argument')
  }
  if (question.secondInput && !secondInput) {
    missing.push('Your second function argument')
  }
  return missing
}

const getIsCorrect = ({
  answer,
  correctAnswer,
}: {
  answer: InputType
  correctAnswer: InputType
}) => {
  if (typeof answer === 'object') {
    if (typeof correctAnswer === 'string') {
      const stringified = JSON.stringify(answer).replace(/"/g, "'")
      return stringified === correctAnswer.replace(/\s+/g, '')
    } else if (typeof correctAnswer === 'object') {
      return equal(correctAnswer, answer)
    }
  } else if (Array.isArray(correctAnswer) && Array.isArray(answer)) {
    return equal(correctAnswer, answer)
  } else if (typeof correctAnswer === 'string' && typeof answer === 'string') {
    return correctAnswer.trim() === answer.trim()
  } else if (typeof answer === 'boolean' && typeof correctAnswer === 'string') {
    return correctAnswer === String(answer)
  } else {
    return correctAnswer == answer
  }
}

const getProcessedInputs = (input: InputType) => {
  const notFinished = notFinishedTyping(input)
  if (typeof input === 'string' && !notFinished && input.includes(',')) {
    const splitInput = input.split(',')
    const convertedArray = convertArray(splitInput)
    return convertedArray
  } else if (notFinished) {
    return input
  } else {
    return isNumeric(input) ? Number(input) : typeof input === 'string' ? input.trim() : input
  }
}

const Practice = () => {
  const [code, setCode] = useState('')
  const [answer, setAnswer] = useState<InputType>('')
  const [question, setQuestion] = useState<number>(0)
  const [group, setGroup] = useState(0)
  const questions = useMemo(() => (group === 1 ? problems2 : problems1), [group])

  const defaultInput = useMemo(
    () => getProcessedInputs(questions[question].exampleInput),
    [question, questions]
  )
  const defaultSecondInput = useMemo(
    () => getProcessedInputs(questions[question].secondInput ?? ''),
    [question, questions]
  )

  const [input, setInput] = useState<InputType>(defaultInput)
  const [secondInput, setSecondInput] = useState<InputType>(defaultSecondInput)

  const correctAnswer = useMemo(() => {
    return getCorrectAnswer({ input, question: questions[question], secondInput })
  }, [input, question, questions, secondInput])

  const isCorrect = useMemo(() => {
    return getIsCorrect({ answer, correctAnswer })
  }, [correctAnswer, answer])

  const processInput = useCallback(
    (name: string, inputText: string) => {
      const processedInput = getProcessedInputs(inputText)
      if (name === 'firstInput') {
        setInput(processedInput)
      } else if (name === 'secondInput') {
        setSecondInput(processedInput)
      }
    },
    [setInput, setSecondInput]
  )

  const runFunction = useCallback(() => {
    const missing = hasRequiredInputs({ code, input, question: questions[question], secondInput })
    if (missing.length === 0) {
      try {
        const output = getFunctionOutput(input, code, secondInput ?? '')
        setAnswer(output)
      } catch (err) {
        const error = err as Error
        toast.error('Error: ' + error.message)
      }
    } else {
      toast.error(<ErrorMessage errors={missing} />)
    }
  }, [code, input, question, questions, secondInput])

  const resetQuestion = useCallback(
    (goTo: number, which: 'number' | 'group') => {
      let nextQ = questions[goTo]

      if (which === 'group') {
        setGroup((prev) => (prev === 0 ? 1 : 0))
        nextQ = group === 0 ? problems2[goTo] : problems1[goTo]
      }
      const firstInput = nextQ.exampleInput
      const secondInput = nextQ.secondInput
      setCode('')
      setInput(firstInput)
      if (secondInput) {
        setSecondInput(secondInput)
      } else {
        setSecondInput('')
      }
      setAnswer('')
      setQuestion(goTo)
    },
    [questions, group]
  )

  return (
    <div className="flex flex-col p-4">
      <Header greeting="Practice Questions and solutions." middle="" title="Practice Page" />
      <RoundedContainer title={`Question #${question + 1}:`}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="textarea-message"></FieldLabel>
              <FieldDescription>{questions[question].question}</FieldDescription>
              <FieldDescription>
                Example input: // {questions[question].exampleInput}
              </FieldDescription>
              <FieldDescription>
                Should return: // {questions[question].shouldReturn}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="textarea-message">Your Code:</FieldLabel>
              <FieldDescription>
                Enter the body of your function below (without the outer function), assuming that x
                is the function's argument.
              </FieldDescription>
              <Textarea
                tabIndex={-1}
                className="h-80 font-mono"
                id="text-area-code"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here"
                spellCheck={false}
                value={code}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="textarea-message">Your function argument(s):</FieldLabel>
              <FieldDescription>
                Enter your function's input below (e.g. numbers or strings separated by commas for
                an array, or a string).
              </FieldDescription>
              <Input
                name="firstInput"
                onChange={(e) => processInput(e.target.name, e.target.value)}
                value={Array.isArray(input) ? input.join(',') : input}
              />
              {questions[question].secondInput ? (
                <>
                  <FieldDescription>
                    Enter your function's second input below (e.g. numbers or strings separated by
                    commas for an array, or a string).
                  </FieldDescription>
                  <Input
                    name="secondInput"
                    onChange={(e) => processInput(e.target.name, e.target.value)}
                    value={Array.isArray(secondInput) ? secondInput.join(',') : secondInput}
                  />
                </>
              ) : null}
            </Field>
            {answer ? (
              <Field>
                <FieldLabel htmlFor="textarea-message">
                  Your function's return value:{' '}
                  {isCorrect ? <span className="font-bold text-green-500">Correct!</span> : null}
                </FieldLabel>
                <code
                  className={`${isCorrect ? 'light:bg-green-100 dark:bg-green-900' : 'light:bg-red-100 dark:bg-red-900'} rounded-lg border border-gray-200 p-2`}
                >
                  {Array.isArray(answer)
                    ? answer.join(',')
                    : typeof answer === 'object'
                      ? JSON.stringify(answer).replace(/"/g, "'")
                      : String(answer)}
                </code>
              </Field>
            ) : null}
            <div className="flex flex-wrap justify-end gap-4">
              <Button
                className="light:bg-amber-500 w-44 dark:bg-amber-400"
                id="showSolution"
                onClick={() => {
                  setCode(questions[question].solution)
                }}
              >
                Show the solution
                <Eye />
              </Button>
              <Button
                className="light:bg-sky-500 w-40 dark:bg-sky-400"
                id="changeGroup"
                onClick={() => {
                  resetQuestion(0, 'group')
                }}
              >
                Next Group
                <CircleChevronRight />
              </Button>
              <Button
                className="light:bg-gray-500 w-30 dark:bg-gray-400"
                id="prevQuestion"
                onClick={() => {
                  const next = question - 1 > -1 ? question - 1 : questions.length - 1
                  resetQuestion(next, 'number')
                }}
              >
                <CircleChevronLeft />
                Previous
              </Button>
              <Button
                className="light:bg-gray-500 w-30 dark:bg-gray-400"
                id="nextQuestion"
                onClick={() => {
                  const next = question + 1 < questions.length ? question + 1 : 0
                  resetQuestion(next, 'number')
                }}
              >
                Next
                <CircleChevronRight />
              </Button>
              <Button className="w-40" onClick={runFunction}>
                Run Code
                <CircleChevronRight />
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </RoundedContainer>
    </div>
  )
}

export default Practice
