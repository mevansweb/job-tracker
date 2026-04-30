import { useCallback, useState } from 'react'

import Header from '@/components/header'
import { useAuth } from '@/components/providers/hooks'
import { RoundedContainer } from '@/components/rounded-container'
import { SearchBar } from '@/components/search/search-bar'
import { SearchResult } from '@/components/search/search-result'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Job } from '@/global/types'

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

const Search = () => {
  const { state } = useAuth()
  const { jobs } = state
  const [upcoming, setUpcoming] = useState<Job[] | null>([])

  const getUpcomingEvents = useCallback(async () => {
    const filteredData = getJobsWithFutureEvents(jobs)
    setUpcoming(filteredData.length > 0 ? filteredData : null)
  }, [jobs])

  return (
    <div className="flex flex-col p-4">
      <Header
        greeting="Search for a job that you have applied for."
        middle=""
        showSearch={false}
        title="Search"
      />
      <RoundedContainer title="Search">
        <div className="my-4 ml-4 flex flex-col">
          <Label htmlFor="company">Company Name</Label>
          <SearchBar displayType="search-result-cards" searchType="company" />
          <Label htmlFor="position">Position Name</Label>
          <SearchBar displayType="search-result-cards" searchType="position" />
        </div>
        <Button className="ml-4" onClick={getUpcomingEvents}>
          Get Upcoming Events
        </Button>
      </RoundedContainer>

      <div className="mx-auto flex flex-col sm:w-9/8 md:w-9/10 lg:w-2/3">
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
        </div>
      </div>
    </div>
  )
}

export default Search
