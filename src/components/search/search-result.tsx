import { Card } from '@/components/ui/card'
import { capitalizeWords } from '@/global/functions'
import type { Job } from '@/global/types'

export function SearchResult({ job }: { job: Job }) {
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
