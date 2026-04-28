import { useState } from 'react'

import Header from '@/components/header'
import { FrontendQuestions } from '@/components/test-prep/frontend-questions'
import { ReactBasics } from '@/components/test-prep/react-basics'
import { ReactQuiz } from '@/components/test-prep/react-quiz'
import { Button } from '@/components/ui/button'

const TestPrep = () => {
  const [page, setPage] = useState('react-basics')

  return (
    <div className="flex flex-col p-4">
      <Header greeting="React Test Page." middle="" title="React Test Prep" />
      <div className="mx-auto flex w-200 gap-8 p-8">
        <Button
          className={`w-50 text-white ${page === 'react-basics' ? 'bg-blue-500!' : 'bg-gray-300'}`}
          onClick={() => setPage('react-basics')}
          size="lg"
        >
          React Basics Quiz
        </Button>
        <Button
          className={`w-50 text-white ${page === 'react-quiz' ? 'bg-blue-500!' : 'bg-gray-300'}`}
          onClick={() => setPage('react-quiz')}
          size="lg"
        >
          React Quiz
        </Button>
        <Button
          className={`w-50 text-white ${page === 'frontend-questions' ? 'bg-blue-500!' : 'bg-gray-300'}`}
          onClick={() => setPage('frontend-questions')}
          size="lg"
        >
          Frontend Questions
        </Button>
      </div>

      {page === 'react-basics' ? <ReactBasics /> : null}
      {page === 'react-quiz' ? <ReactQuiz /> : null}
      {page === 'frontend-questions' ? <FrontendQuestions /> : null}
    </div>
  )
}

export default TestPrep
