import { useState } from 'react'

import Header from '@/components/header'
import { ReactBasics } from '@/components/test-prep/react-basics'
import { Button } from '@/components/ui/button'

const TestPrep = () => {
  const [page, setPage] = useState('react-basics')

  return (
    <div className="flex flex-col p-4">
      <Header greeting="React Test Page." middle="" title="React Test Prep" />
      <div className="mx-auto grid w-200 gap-8 p-8">
        <Button className="w-50 text-white" onClick={() => setPage('react-basics')} size="lg">
          React Basics Quiz
        </Button>
      </div>

      {page === 'react-basics' ? <ReactBasics /> : null}
    </div>
  )
}

export default TestPrep
