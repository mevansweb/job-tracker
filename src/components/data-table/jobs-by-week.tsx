import { type Job } from '@/global/types'

function getNumberOfJobsByWeek(jobs: Job[], weekNumber: number) {
  return jobs.filter((job) => {
    const jobDate = new Date(job.applicationDate)
    const firstDayOfMonth = new Date(jobDate.getFullYear(), jobDate.getMonth(), 1)
    const dayOfWeek = firstDayOfMonth.getDay() // 0 (Sun) to 6 (Sat)
    const adjustedDate = jobDate.getDate() + dayOfWeek
    const jobWeekNumber = Math.ceil(adjustedDate / 7)
    return jobWeekNumber === weekNumber
  }).length
}

export default function JobsByWeek({ keyPrefix, jobs }: { keyPrefix: string; jobs: Job[] }) {
  const weeks = [1, 2, 3, 4, 5]
  return (
    <div className="ml-4 flex text-sm max-md:hidden">
      <span className="mr-2">Jobs by week:</span>
      {weeks.map((week) => (
        <div key={`${keyPrefix}-week-${week}`} className="flex">
          {getNumberOfJobsByWeek(jobs, week)}
          {week < weeks.length && <span>/</span>}
        </div>
      ))}
    </div>
  )
}
