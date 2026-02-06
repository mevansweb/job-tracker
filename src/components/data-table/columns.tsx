import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/global/functions'
import { EventsModal } from '../modal/events-modal'
import { JobsModal } from '../modal/jobs-modal'
import { type Job, type Status } from '../../global/types'

//"waiting-for-response" | "recruiter-screening" | "rejected" | "coding-assessment" | "ghosted" | "hiring-manager-screening" | "panel-interview" | "waiting-for-next-steps"

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'waiting-for-response':
      return 'bg-gray-100'
    case 'recruiter-screening':
      return 'bg-yellow-100'
    case 'hiring-manager-screening':
      return 'bg-blue-100'
    case 'panel-interview':
      return 'bg-green-100'
    case 'behavioral-assessment':
      return 'bg-purple-100'
    case 'ccat':
      return 'bg-purple-100'
    case 'coding-assessment':
      return 'bg-purple-100'
    case 'waiting-for-next-steps':
      return 'bg-green-200'
    case 'received-offer':
      return 'bg-green-300'
    case 'accepted-offer':
      return 'bg-green-400'
    case 'ghosted':
      return 'bg-red-100'      
    case 'rejected':
      return 'bg-red-100'
    default:
      return 'text-gray-500'
  }
}

const jobHostToContactName = (link: string) => {
  try {
    const url = new URL(link)
    const host = url.hostname.replace(/^www\./, '').replace('.com', '')
    switch (host) {
      case 'linkedin':
        return 'LinkedIn'
      case 'indeed':
        return 'Indeed'
      case 'glassdoor':
        return 'Glassdoor'
      case 'monster.com':
        return 'Monster'
      case 'ziprecruiter':
        return 'ZipRecruiter'
      default:
        return host
    }

  } catch {
    return link
  }
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'applicationDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Applied Date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('applicationDate')}</div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId))
      const dateB = new Date(rowB.getValue(columnId))
      return dateA.getTime() - dateB.getTime()
    },
  },
  {
    accessorKey: 'company',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Company
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('company')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original
      const events = row.getValue('events') as Array<{ status?: string }> | undefined
      const lastStatus = (events && events.length > 0 ? events[events.length - 1]?.status ?? '' : 'waiting-for-response') as Status
      const jobHost = job.linkToJobPosting ? jobHostToContactName(job.linkToJobPosting) : 'N/A'

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cursor-pointer" align="end">
            <div className="flex justify-between mt-1 mb-2">
              <JobsModal job={job} />
              <EventsModal job={job} />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!job.company}
              onClick={() => navigator.clipboard.writeText(job.company)}
            >
              Copy Company Name
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!job.address}
              onClick={() => navigator.clipboard.writeText(job.address)}
            >
              Copy Company Address
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!job.phone}
              onClick={() => navigator.clipboard.writeText(job.phone)}
            >
              Copy Company Phone Number
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!job.position}
              onClick={() => navigator.clipboard.writeText(job.position)}
            >
              Copy Position Applied For
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!job.linkToJobPosting}
              onClick={() => navigator.clipboard.writeText(job.linkToJobPosting)}
            >
              Copy Link to Job Posting
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={false}
              onClick={() => navigator.clipboard.writeText(job.contactPerson ? job.contactPerson : jobHost)}
            >
              Copy Contact Name or Job Website
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!job.events}
              onClick={() => navigator.clipboard.writeText(lastStatus.replace(/-/g, ' '))}
            >
              Copy Applicant Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: 'events',
    header: 'Status',
    cell: ({ row }) => {
      const events = row.getValue('events') as Array<{ status?: string }> | undefined
      const lastStatus = (events && events.length > 0 ? events[events.length - 1]?.status ?? '' : 'waiting-for-response') as Status
      return (
      <div className={`font-medium p-1 rounded-lg w-auto text-center ${getStatusColor(lastStatus)}`}>{capitalizeWords(lastStatus.replace(/-/g, ' '))}</div>
      )
    }
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('address')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('phone')}</div>
    ),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('position')}</div>
    ),
  },
  {
    accessorKey: 'salaryRange',
    header: 'Salary Range',
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('salaryRange')}</div>
    ),
  },
  {
    accessorKey: 'contactPerson',
    header: 'Contact',
    cell: ({ row }) => (
      <div className='text-left font-medium'>{row.getValue('contactPerson')}</div>
    ),
  },
]