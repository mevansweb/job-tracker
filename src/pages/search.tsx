import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { toast } from 'sonner'

import Header from '@/components/header/header'
import { useAuth } from '@/components/providers/hooks'
import { RoundedContainer } from '@/components/rounded-container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { capitalizeWords } from '@/global/functions'
import type { Job } from '@/global/types'

type SearchType = 'company' | 'position'

const MIN_QUERY_LENGTH = 3

const SEARCH_URL = 'http://localhost:8080/api/data/search/'

const getJobsWithFutureEvents = (jobs: Job[]) => {
  // Get today's date without time (midnight)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter logic
  const filteredData = jobs
    .map((job) => {
      // Keep only events with date > today
      const filteredDates = job.events.filter((event) => {
        const date = new Date(event.date)
        return !isNaN(date.getTime()) && date >= today
      })

      // Return job only if it has future events
      return filteredDates.length > 0 ? { ...job, events: filteredDates } : null
    })
    .filter((job): job is Job => job !== null) // Remove null entries

  return filteredData
}

const SearchResult = ({ job }: { job: Job }) => {
  return (
    <Card className="my-4 p-4">
      <div key={job.id} className="mb-2">
        <strong>{job.position}</strong> at {job.company} (Applied on:{' '}
        {new Date(job.applicationDate).toLocaleDateString()})
        {job.linkToJobPosting ? (
          <span>
            {' '}
            -{' '}
            <a
              href={job.linkToJobPosting}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Posting
            </a>
          </span>
        ) : null}
        {job.address ? <p className="text-sm font-light">{job.address}</p> : null}
        {job.phone ? <p className="text-sm font-light">{job.phone}</p> : null}
      </div>
      <div className="light:text-gray-700 text-sm dark:text-gray-400">
        {job.events && job.events.length > 0 ? (
          <div>
            <p className="text-sm font-light italic">Events:</p>
            <ul className="light:text-gray-700 list-inside list-disc text-sm dark:text-gray-400">
              {job.events.map((event, index) => {
                if (event.status === 'waiting-for-response') {
                  return (
                    <li key={`${job.id}-event-${index}`}>
                      {job.applicationDate
                        ? `${new Date(job.applicationDate).toLocaleDateString()}: `
                        : ''}
                      Application Sent.
                    </li>
                  )
                } else {
                  return (
                    <li key={`${job.id}-event-${index}`}>
                      {event.date ? `${new Date(event.date).toLocaleDateString()}: ` : ''}
                      {capitalizeWords(event.status.replace(/-/g, ' '))}{' '}
                      {event.note ? `- ${event.note}` : ''}
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  )
}

const Search = () => {
  const { state } = useAuth()
  const { id, jobs } = state
  const [companyQuery, setCompanyQuery] = useState('')
  const [positionQuery, setPositionQuery] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchResults, setSearchResults] = useState<Job[] | null>([])
  const [upcoming, setUpcoming] = useState<Job[] | null>([])

  const noResultsText = useMemo(
    () =>
      searchResults === null && companyQuery.trim().length >= MIN_QUERY_LENGTH
        ? `No results found for "${companyQuery}`
        : searchResults === null && positionQuery.trim().length >= MIN_QUERY_LENGTH
          ? `No results found for "${positionQuery}`
          : '',
    [companyQuery, positionQuery, searchResults]
  )

  const getUpcomingEvents = useCallback(async () => {
    const filteredData = getJobsWithFutureEvents(jobs)
    setUpcoming(filteredData.length > 0 ? filteredData : null)
    setSearchResults([])
    setCompanyQuery('')
    setPositionQuery('')
  }, [jobs])

  const performSearch = useCallback(
    async (searchQuery: string, searchType: SearchType) => {
      try {
        const url = `${SEARCH_URL}${id}/${encodeURIComponent(searchQuery)}/${searchType}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          toast.error(`Error: ${response.statusText}`)
        }

        const result = await response.json()
        setSearchResults(result.length > 0 ? result : null)
        setUpcoming([])
      } catch (err) {
        const error = err as Error
        toast.error(`'Search error: ${error.message}`)
      }
    },
    [id]
  )

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value
      const searchType = event.target.name as SearchType
      if (searchType === 'company') {
        setCompanyQuery(newQuery)
      }
      if (searchType === 'position') {
        setPositionQuery(newQuery)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (newQuery.trim().length >= MIN_QUERY_LENGTH) {
        timeoutRef.current = setTimeout(async () => {
          await performSearch(newQuery, searchType)
        }, 500)
      }
    },
    [performSearch]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col p-4">
      <Header greeting="Search for a job that you have applied for." middle="" title="Search" />
      <RoundedContainer title="Search">
        <div className="my-4 ml-4 flex flex-col">
          <Label htmlFor="company">Company Name</Label>
          <Input
            className="my-4 w-full"
            name="company"
            onChange={handleOnChange}
            placeholder="Search for a job by company name..."
            value={companyQuery}
            type="text"
          />
          <Label htmlFor="position">Position Name</Label>
          <Input
            className="my-4 w-full"
            name="position"
            onChange={handleOnChange}
            placeholder="Search for a job by position name..."
            value={positionQuery}
            type="text"
          />
        </div>
        <Button className="ml-4" onClick={getUpcomingEvents}>
          Get Upcoming Events
        </Button>
      </RoundedContainer>

      <div className="mx-auto flex flex-col sm:w-9/8 md:w-9/10 lg:w-2/3">
        {(searchResults && searchResults.length > 0) || (upcoming && upcoming.length > 0) ? (
          <h2 className="mt-8 text-lg font-semibold">Search Results:</h2>
        ) : null}
        {companyQuery || positionQuery ? (
          <div className="mt-8 text-sm text-gray-500">
            Showing results for "{companyQuery ? companyQuery : positionQuery}":
          </div>
        ) : null}
        <div className="mt-2">
          {upcoming === null ? (
            <p className="light:text-gray-700 mt-8 text-center dark:text-gray-400">
              No upcoming events found.
            </p>
          ) : null}
          {upcoming && upcoming.length > 0 ? (
            <div className="mt-8 text-sm text-gray-500">Showing upcoming events:</div>
          ) : null}
          {upcoming &&
            upcoming.map((job) => <SearchResult key={`upcoming-events-job-${job.id}`} job={job} />)}
          {searchResults &&
            searchResults.map((job) => (
              <SearchResult key={`search-results-job-${job.id}`} job={job} />
            ))}
          {noResultsText ? (
            <p className="light:text-gray-700 dark:text-gray-400">{noResultsText}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Search
