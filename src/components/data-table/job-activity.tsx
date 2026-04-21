import { useMemo, useState } from 'react'

import { ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { capitalizeWords } from '@/global/functions'
import { type Job } from '@/global/types'

function getJobsActivity(jobs: Job[]) {
  const jobsWithActivity = jobs.filter((job) => {
    const events = job.events || []
    return events.length > 1
  })
  return jobsWithActivity
}

export default function JobActivity({ jobs }: { jobs: Job[] }) {
  const [viewSummary, setViewSummary] = useState(false)
  const jobsWithActivity = useMemo(() => {
    return getJobsActivity(jobs)
  }, [jobs])
  return (
    <>
      {jobsWithActivity.length > 0 && (
        <Button
          className="mb-4 cursor-pointer"
          variant={viewSummary ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewSummary(!viewSummary)}
        >
          {viewSummary ? 'Hide' : 'View'} Summary of Job Activity
          {viewSummary ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
        </Button>
      )}
      {jobsWithActivity.length > 0 && viewSummary && (
        <div className="mb-4 text-sm italic">
          {jobsWithActivity.map((job) => (
            <div key={job.id}>
              Activity on <strong>{job.position}</strong> at <strong>{job.company}</strong>:{' '}
              <ul>
                {job.events
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(
                    (event, index) =>
                      event.status !== 'waiting-for-response' && (
                        <li className="ml-4" key={index}>
                          {event.date} - {capitalizeWords(event.status.replace(/-/g, ' '))}
                          {event.note ? ` (${event.note})` : ''}
                          {index < job.events.length - 1 ? '; ' : ''}
                        </li>
                      )
                  )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
