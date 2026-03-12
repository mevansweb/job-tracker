import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import type { Job } from '@/global/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { capitalizeWords } from '@/global/functions'

const MIN_QUERY_LENGTH = 3

const SEARCH_URL = 'http://localhost:8080/api/data/search/'

const Search = () => {
  const { state } = useAuth()
  const { id, jobs } = state
  const [query, setQuery] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchResults, setSearchResults] = useState<Job[]>([])

  const getUpcomingEvents = useCallback(async () => {
    // Get today's date without time (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter logic
    const filteredData = jobs
      .map(job => {
        // Keep only events with date > today
        const filteredDates = job.events.filter((event) => {
          const date = new Date(event.date);
          return !isNaN(date.getTime()) && date >= today;
        });

        // Return job only if it has future events
        return filteredDates.length > 0
          ? { ...job, events: filteredDates }
          : null;
      })
      .filter((job): job is Job => job !== null); // Remove null entries

    setSearchResults(filteredData)
  }, [jobs])

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
        toast.error(`Error: ${response.statusText}`)
      }

      const result = await response.json()
      setSearchResults(result)
    } catch (err) {
      const error = err as Error
      toast.error(`'Search error: ${error.message}`)
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
        greeting="Search for a job that you have applied for." 
        middle="" 
        title="Search"
      />
      <div className="w-200 mx-auto border border-input rounded-xl shadow p-10 mt-8">
        <div className="flex flex-col my-4 ml-4">
        <h1 className="text-lg mb-2">Search</h1>
        <Input
          type="text"
          placeholder="Search for a job by company name..."
          value={query}
          onChange={handleOnChange}
          className="my-4 w-full"
        />
        </div>
        <Button
          onClick={getUpcomingEvents}
        >Get Upcoming Events</Button>
      </div>

      {searchResults.length > 0 ? (
        <div className="flex flex-col w-200 mx-auto">
          {query ? (
            <div className="text-sm text-gray-500 mt-8">Showing results for "{query}":</div>
          ) : (
            <div className="text-sm text-gray-500 mt-8">Showing upcoming events:</div>
          )}
          <h2 className="text-lg font-semibold">Search Results:</h2>
          <div className="mt-2">
            {searchResults.map((job) => (
              <Card className="p-4 my-4" key={job.id}>
              <div key={job.id} className="mb-2">
                <strong>{job.position}</strong> at {job.company} (Applied on: {new Date(job.applicationDate).toLocaleDateString()})
                {job.linkToJobPosting ? <span> - <a href={job.linkToJobPosting} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Posting</a></span> : null}
              </div>
               <div className="text-sm light:text-gray-700 dark:text-gray-400">
                {job.events && job.events.length > 0 ? (
                  <div>
                    <p className="text-sm font-light italic">Events:</p>
                    <ul className="list-disc list-inside text-sm light:text-gray-700 dark:text-gray-400">
                      {job.events.map((event, index) => {
                        if (event.status === 'waiting-for-response') {
                          return (
                            <li key={`${job.id}-event-${index}`}>{job.applicationDate ? `${new Date(job.applicationDate).toLocaleDateString()}: ` : ''}Application Sent.</li>
                          )
                        } else {
                          return (
                            <li key={`${job.id}-event-${index}`}>{event.date ? `${new Date(event.date).toLocaleDateString()}: ` : ''}
                              {capitalizeWords(event.status.replace(/-/g, ' '))} {event.note ? `- ${event.note}` : ''}
                            </li>
                          )
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
        query.trim().length >= MIN_QUERY_LENGTH && <p className="light:text-gray-700 dark:text-gray-400">No results found for "{query}".</p>
      )}
    </div>
  )
}

export default Search