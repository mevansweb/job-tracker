import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import Header from '@/components/header'
import { JobsModal } from '@/components/modal/jobs-modal'
import { useAuth } from '@/components/providers/hooks'
import { RoundedContainer } from '@/components/rounded-container'
import { type Job } from '@/global/types'

const SEARCH_URL = 'http://localhost:8080/api/data/application/'

export default function Application() {
  const {
    state: { id },
  } = useAuth()
  const { id: applicationId } = useParams()
  const [error, setError] = useState<string | null>(null)
  const [application, setApplication] = useState<Job | null>(null)

  useEffect(() => {
    async function fetchApplication() {
      if (applicationId && id) {
        try {
          const url = `${SEARCH_URL}${id}/${encodeURIComponent(applicationId)}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (!response.ok) {
            setError(`Error: ${response.statusText}`)
          }

          const result = await response.json()
          const applicationData = Array.isArray(result) && result.length > 0 ? result[0] : null
          setApplication(applicationData)
        } catch (err) {
          const error = err as Error
          setError(`Search error: ${error.message}`)
        }
      }
    }
    void fetchApplication()
  }, [applicationId, id])

  return (
    <div className="flex flex-col p-4">
      <Header
        greeting="View and edit details of your job application."
        middle=""
        title="Application Details"
      />
      <RoundedContainer
        title={'Application Details'}
        button={application ? <JobsModal job={application} /> : undefined}
      >
        {error ? <div className="text-red-500">{error}</div> : null}
        <div className="">
          {application ? (
            <div className="mt-4">
              <div className="flex justify-between">
                <div className="text-md flex w-100 font-semibold">
                  <span className="w-1/3">Company:</span>
                  <span className="w-2/3">{application.company}</span>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Applied on: {new Date(application.applicationDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-md flex w-100 font-semibold">
                <span className="w-1/3">Position:</span>
                <span className="w-2/3">{application.position}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">{application.address}</p>
              {application.phone ? (
                <p className="text-sm text-gray-500 italic">{application.phone}</p>
              ) : null}
              <hr className="my-2" />
              {application.jobType ? (
                <p className="text-sm text-gray-500 italic">Job Type: {application.jobType}</p>
              ) : null}
              {application.notes ? (
                <p className="text-sm text-gray-500 italic">Notes: {application.notes}</p>
              ) : null}
              {application.contactPerson ? (
                <p className="text-sm text-gray-500 italic">
                  Contact Person: {application.contactPerson}
                </p>
              ) : null}
              {application.salaryRange ? (
                <p className="text-sm text-gray-500 italic">
                  Salary Range: {application.salaryRange}
                </p>
              ) : null}
              <hr className="my-2" />
              {application.events && application.events.length > 0 ? (
                <div>
                  <p className="text-sm font-light italic">Events:</p>
                  <ul className="list-inside list-disc text-sm text-gray-500">
                    {application.events.map((event, index) => {
                      if (event.status === 'waiting-for-response') {
                        return (
                          <li key={`application-event-${index}`}>
                            {application.applicationDate
                              ? `${new Date(application.applicationDate).toLocaleDateString()}: `
                              : ''}
                            Application Sent.
                          </li>
                        )
                      } else {
                        return (
                          <li key={`application-event-${index}`}>
                            {event.date ? `${new Date(event.date).toLocaleDateString()}: ` : ''}
                            {event.status.replace(/-/g, ' ')} {event.note ? `- ${event.note}` : ''}
                          </li>
                        )
                      }
                    })}
                  </ul>
                </div>
              ) : null}
              <hr className="my-2" />
              <div className="flex flex-col gap-2">
                {application.linkToJobPosting ? (
                  <a
                    href={application.linkToJobPosting}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Job Posting
                  </a>
                ) : null}
                {application.linkToJobAccount ? (
                  <a
                    href={application.linkToJobAccount}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Job Account
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            !error && <p>Loading application details...</p>
          )}
        </div>
      </RoundedContainer>
    </div>
  )
}
