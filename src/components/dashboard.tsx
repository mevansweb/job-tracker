import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { JobsTable } from '@/components/data-table/jobs-table'
import { months } from '@/global/types'

import { useAuth } from './providers/hooks'

export const Dashboard = () => {
  const { data, state } = useAuth()
  const [month, setMonth] = useState<number>(0)
  const allJobs = data?.jobs ? data?.jobs : state.jobs
  const groupedByMonth = new Map();
  allJobs.forEach(obj => {
    const month = new Date(obj.applicationDate).getMonth() + 1 // Get month (1-12)
    if (!groupedByMonth.has(month)) groupedByMonth.set(month, [])
    groupedByMonth.get(month).push(obj)
  })
  const groups = Object.fromEntries(groupedByMonth)// Convert Map to Object if needed
  const monthNumbers = Object.keys(groups).map(Number).sort((a, b) => a - b)
  const lastWeeksJobs = useMemo(() => {
    const today = new Date()
    const lastWeekStart = new Date(today)
    lastWeekStart.setDate(today.getDate() - today.getDay() - 7) // Last week's Sunday
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6) // Last week's Saturday

    return allJobs.filter((job) => {
      const jobDate = new Date(job.applicationDate)
      return jobDate >= lastWeekStart && jobDate <= lastWeekEnd
    })
  }, [allJobs])
  const thisWeeksJobsCount = useMemo(() => {
    const today = new Date()
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay()) // This week's Sunday
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6) // This week's Saturday
    return allJobs.filter((job) => {
      const jobDate = new Date(job.applicationDate)
      return jobDate >= thisWeekStart && jobDate <= thisWeekEnd
    }).length
  }, [allJobs])

  return (
    <div className="flex flex-col m-4">
      <Header 
        greeting={`Welcome, ${state.email.split('@')[0].toUpperCase().replace(/[^a-zA-Z0-9]/g, ' ')}!`} 
        middle=""
        title="Dashboard" 
      />
      <div className="flex align-center my-4 justify-center">
        {monthNumbers.map((m) => (
          <Button key={`view-jobs-by-month-${m}`} className={`cursor-pointer mr-2 size-min hover:bg-orange-200 hover:border-orange-500 ${month === m ? 'bg-green-200 border-green-500 font-extrabold' : ''}`} onClick={() => setMonth(m)} variant="outline">
            {months[m - 1] ? months[m - 1] : 'Missing Date'}
            <span className="text-gray-400 text-xs">{' '}({groups[m] ? groups[m].length : 0})</span>
          </Button>
        ))}
      </div>
      <JobsTable
        lastWeeksJobs={lastWeeksJobs}
        month={month} monthSubGroup={groups[month] ?? []}
        thisWeeksJobsCount={thisWeeksJobsCount}
      />
    </div>
  )
}