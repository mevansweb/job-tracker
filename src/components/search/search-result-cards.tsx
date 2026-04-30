import { useMemo } from 'react'

import type { Job, SearchType } from '@/global/types'

import { SearchResult } from './search-result'

export function SearchResultCards({
  minQueryLength = 3,
  query,
  results,
  searchType,
}: {
  minQueryLength?: number
  query: string
  results: Job[]
  searchType: SearchType
}) {
  const noResultsText = useMemo(
    () =>
      results === null && query.trim().length >= minQueryLength
        ? `No results found for "${query}" by ${searchType}.`
        : '',
    [minQueryLength, query, results, searchType]
  )
  if (!results) return null

  return (
    <div className="mx-auto flex flex-col sm:w-9/8 md:w-9/10 lg:w-2/3">
      <div className="flex justify-between">
        {results.length > 0 ? <h2 className="text-lg font-semibold">Search Results:</h2> : null}
        {query ? <div className="text-sm text-gray-500">Showing results for "{query}":</div> : null}
      </div>
      <div className="mt-2">
        {results &&
          results.map((job) => <SearchResult key={`search-results-job-${job.id}`} job={job} />)}
        {noResultsText ? (
          <p className="light:text-gray-700 dark:text-gray-400">{noResultsText}</p>
        ) : null}
      </div>
    </div>
  )
}
