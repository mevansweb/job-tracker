import type { RefObject } from 'react'

import { Link } from 'react-router-dom'

import type { Job, SearchType } from '@/global/types'

export function AutoSuggestResults({
  ref,
  results,
  searchType,
}: {
  ref: RefObject<HTMLDivElement | null>
  results: Job[]
  searchType: SearchType
}) {
  if (!results || results.length === 0) return null

  return (
    <div
      className="absolute top-12 right-0 left-0 z-10 mt-1 w-100 rounded-md border border-gray-200 bg-white p-4 text-sm shadow-lg"
      ref={ref}
    >
      {results.map((result: Job) => (
        <Link
          className="flex flex-col"
          key={`search-bar-result-${result.id}`}
          to={`/search/application/${result.id}`}
        >
          {searchType === 'position' ? (
            <div>
              <strong>{result.position}</strong>
              <br />
              at {result.company} ({result.applicationDate})
            </div>
          ) : (
            <div>
              <strong>{result.company}</strong>
              <br />
              {result.position} ({result.applicationDate})
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
