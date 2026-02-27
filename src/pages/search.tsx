import { useState } from 'react'
import Header from '@/components/header'
import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/components/providers/hooks'
import type { Job } from '@/global/types'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const MIN_QUERY_LENGTH = 3

const SEARCH_URL = 'http://localhost:8080/api/data/search/'

const Search = () => {
  const { existing } = useAuth()
  const id = existing && existing.id ? existing.id : ''
  const [query, setQuery] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchResults, setSearchResults] = useState<Job[]>([])

  const performSearch = useCallback(async (searchQuery: string) => {
    try {
      const url = `${SEARCH_URL}${id}/${encodeURIComponent(searchQuery)}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setSearchResults(result)
    } catch (err) {
      const error = err as Error
      console.error('Search error:', error.message)
    }
  }, [id])

  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (newQuery.trim().length >= MIN_QUERY_LENGTH) {
      timeoutRef.current = setTimeout(() => {
        performSearch(newQuery)
      }, 500)
    }
  }, [performSearch])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="p-4 flex flex-col">
      <Header 
        greeting="This is where you search for a job that you have applied for (TODO)." 
        middle="" 
        title="Search"
      />
      <Input
        type="text"
        placeholder="Search for a job..."
        value={query}
        onChange={handleOnChange}
        className="my-4 w-full"
      />
      {searchResults.length > 0 ? (
        <div className="flex-col">
          <div className="text-sm text-gray-500 mb-2">Showing results for "{query}":</div>
          <h2 className="text-lg font-semibold mb-2">Search Results:</h2>
          <div className="mt-2">
            {searchResults.map((job) => (
              <Card className="p-4 my-4" key={job.id}>
              <div key={job.id} className="mb-2">
                <strong>{job.position}</strong> at {job.company} (Applied on: {new Date(job.applicationDate).toLocaleDateString()})
                {job.linkToJobPosting ? <span> - <a href={job.linkToJobPosting} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Posting</a></span> : null}
              </div>
               <div className="text-sm text-gray-700">
                {job.events && job.events.length > 1 ? (
                  <div>
                    <p className="text-sm font-light italic">Events:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {job.events.map((event, index) => {
                        if (event.status === 'waiting-for-response') {
                          return <li key={`${job.id}-event-${index}`}>{event.date ? `${new Date(event.date).toLocaleDateString()}: ` : ''}Application Sent.</li>
                        } else {
                          return <li key={`${job.id}-event-${index}`}>{event.date ? `${new Date(event.date).toLocaleDateString()}: ` : ''}{event.note}</li>
                        }
                      })}
                    </ul>
                  </div>
                ) : (
                  null
                )}
              </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        query.trim().length >= MIN_QUERY_LENGTH && <p className="text-gray-700">No results found for "{query}".</p>
      )}
    </div>
  )
}

export default Search