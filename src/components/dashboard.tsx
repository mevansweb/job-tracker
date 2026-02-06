import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { JobsTable } from '@/components/data-table/jobs-table'
import { type Job, months } from '@/global/types'
import { useAuth } from './providers/hooks'

const groupJobsByMonthAndYear = (jobs: Job[]) => {
  const grouped: { [key: string]: Job[] } = {}
  jobs.forEach(job => {
    const date = new Date(job.applicationDate)
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`
    if (!grouped[monthYear]) {
      grouped[monthYear] = []
    }
    grouped[monthYear].push(job)
  })
  return grouped
}

export const Dashboard = () => {
  const { data, state } = useAuth()
  const [month, setMonth] = useState<number>(0)
  const [year, setYear] = useState<number>(0)
  const allJobs = data?.jobs ? data?.jobs : state.jobs
  const groupedByMonthAndYear = useMemo(() => groupJobsByMonthAndYear(allJobs), [allJobs])
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
        {groupedByMonthAndYear && Object.keys(groupedByMonthAndYear).sort((a, b) => {
          const [monthA, yearA] = a.split('-').map(Number)
          const [monthB, yearB] = b.split('-').map(Number)
          return yearA === yearB ? monthA - monthB : yearA - yearB
        }).map((monthYear) => {
          const [monthPart, yearPart] = monthYear.split('-').map(Number)
          return (
            <Button key={`view-jobs-by-month-year-${monthYear}`} className={`cursor-pointer mr-2 size-min hover:bg-orange-200 hover:border-orange-500 ${month === monthPart && year === new Date().getFullYear() ? 'bg-green-200 border-green-500 font-extrabold' : ''}`} onClick={() => { setMonth(monthPart); setYear(yearPart); }} variant="outline">
              {months[monthPart - 1] ? `${months[monthPart - 1]} ${yearPart}` : 'Missing Date'}
              <span className="text-gray-400 text-xs">{' '}({groupedByMonthAndYear[monthYear] ? groupedByMonthAndYear[monthYear].length : 0})</span>
            </Button>
          )
        }
        )}
      </div>
      <JobsTable
        lastWeeksJobs={lastWeeksJobs}
        month={month} monthSubGroup={groupedByMonthAndYear[`${month}-${year}`] ?? []}
        thisWeeksJobsCount={thisWeeksJobsCount}
        year={year}
      />
    </div>
  )
}