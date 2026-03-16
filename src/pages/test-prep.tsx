import { useState } from 'react'

import { ReactBasics } from '@/components/test-prep/react-basics'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'


const TestPrep = () => {
  const [page, setPage] = useState('')

  return (
    <div className="p-4 flex flex-col">
      <Header
          greeting="React Test Page."
          middle=""
          title="React Test Prep"
      />
      <div className="grid gap-8 mx-auto w-200 p-8">
        <Button
          className="w-50"
          onClick={() => setPage('react-basics')}
          variant="default"
        >
          React Basics Quiz
        </Button>
      </div>
      
      {page === 'react-basics' ? (
        <ReactBasics />
      ) : null }
    </div>
  )
}

export default TestPrep