import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown, FunnelIcon, SaveIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobsModal } from '@/components/modal/jobs-modal'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Job, months } from '../../global/types'
import { columns } from './columns'
import { localStorageKey } from '../providers/const'
import { useAuth } from '../providers/hooks'

type JobsTableProps = {
  lastWeeksJobs: Job[]
  month: number
  monthSubGroup?: Job[]
  thisWeeksJobsCount?: number
}

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

export function JobsTable({ lastWeeksJobs, month, monthSubGroup, thisWeeksJobsCount }: JobsTableProps) {
  const { dispatch, existing, postData, state } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([])
  const [filterBy, setFilterBy] = useState<string>('company')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const filteredJobs = useMemo(() => {
    if (monthSubGroup && monthSubGroup.length > 0) {
      return monthSubGroup.filter((job) => {
        return columnFilters.every((filter) => {
          const jobValue = job[filter.id as keyof Job]
          if (typeof jobValue === 'string') {
            return jobValue
              .toLowerCase()
              .includes((filter.value as string).toLowerCase())
          }
          return true
        })
      })
    }
    return []
  }, [columnFilters, monthSubGroup])

  const handleSave = useCallback(async () => {
    const saveEmail: string = state?.email ? state.email : existing && existing.email ? existing.email : ''
    if (saveEmail) {
      postData('PUT', { email: saveEmail, jobs: state.jobs.length > 0 ? state.jobs : [] })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, jobs: state.jobs || []}))
    }
  }, [existing, postData, state.email, state.jobs])

  useEffect(() => {
    if (existing && existing.email && !state.email) {
      dispatch({ type: 'SET_ALL_DATA', ...existing, error: '', jobs: existing.jobs ?? [], loggedIn: true, password: ''})
    }
  },[dispatch, existing, state.email])

  const table = useReactTable({
    data: month > 0 || Number.isNaN(month) ? filteredJobs : lastWeeksJobs ?? [],
    columns,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder='Filter companies...'
            value={(table.getColumn('company')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }}
            className='max-w-sm'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='absolute right-8 top-1/2 -translate-y-1/2 h-7 w-7 p-0'>
                  <span className='sr-only'>Filter By</span>
                  <FunnelIcon className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setFilterBy('company')}>Company Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('position')}>Position Applied For</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('contactPerson')}>Recruiter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => table.getColumn('company')?.setFilterValue('')}
        >
            <XIcon className="h-4 w-4"/>
            <span className="sr-only">Clear</span>
          </Button>
        </div>
        <JobsModal />
        <Button onClick={handleSave} variant="outline"><SaveIcon />Save</Button>
        <span className="text-sm ml-4">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <span className="text-sm ml-4">
          Number of Jobs: {table.getFilteredRowModel().rows.length} {month === 0 ? ' last week' : ''}
          {month === 0 && thisWeeksJobsCount ? ` (vs. This week: ${thisWeeksJobsCount})` : ''}
        </span>
        {month > 0 ? (
          <span className="text-sm ml-4">
            Jobs by week: {getNumberOfJobsByWeek(monthSubGroup || [], 1)}/{getNumberOfJobsByWeek(monthSubGroup || [], 2)}/
            {getNumberOfJobsByWeek(monthSubGroup || [], 3)}/{getNumberOfJobsByWeek(monthSubGroup || [], 4)}/
            {getNumberOfJobsByWeek(monthSubGroup || [], 5)}
          </span>
        ) : null } 
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex items-center py-4'>
        <h2>Jobs you applied to {month === 0 ? 'last week' : `in ${months[month - 1]}`}:</h2>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='text-muted-foreground flex-1 text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
