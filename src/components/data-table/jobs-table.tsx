import { useCallback, useMemo, useState } from 'react'

import { ChevronDown, FunnelIcon, SaveIcon, XIcon } from 'lucide-react'

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { JobsModal } from '@/components/modal/jobs-modal'
import { localStorageKey } from '@/components/providers//const'
import { useAuth } from '@/components/providers/hooks'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { exportToExcel, getStyles } from '@/global/functions'
import { type Job, months } from '@/global/types'

import { createColumns, getStatusColor } from './columns'
import JobActivity from './job-activity'
import JobsByWeek from './jobs-by-week'
import Pagination from './pagination'

type JobsTableProps = {
  lastWeeksJobs: Job[]
  month: number
  monthSubGroup?: Job[]
  thisWeeksJobsCount?: number
  year?: number
}

export function JobsTable({
  lastWeeksJobs,
  month,
  monthSubGroup,
  thisWeeksJobsCount,
  year,
}: JobsTableProps) {
  const { existing, postData, state } = useAuth()
  const [tableState, setTableState] = useState({
    sorting: [] as SortingState,
    filterBy: 'company',
    columnFilters: [] as ColumnFiltersState,
    columnVisibility: {} as VisibilityState,
    rowSelection: {},
  })
  const { sorting, filterBy, columnFilters, columnVisibility, rowSelection } = tableState
  const { accentColor, theme } = state.settings || { accentColor: '', theme: '' }
  const accentClasses = `${getStyles({ theme, name: 'accentColor', strKey: accentColor })}`

  const filteredJobs = useMemo(() => {
    if (monthSubGroup && monthSubGroup.length > 0) {
      return monthSubGroup.filter((job) => {
        return columnFilters.every((filter) => {
          const jobValue = job[filter.id as keyof Job]
          if (typeof jobValue === 'string') {
            return jobValue.toLowerCase().includes((filter.value as string).toLowerCase())
          }
          return true
        })
      })
    }
    return []
  }, [columnFilters, monthSubGroup])

  const handleSave = useCallback(async () => {
    const saveEmail: string = state.email
    if (saveEmail) {
      await postData('PUT', { email: saveEmail, jobs: state.jobs.length > 0 ? state.jobs : [] })
      localStorage.setItem(localStorageKey, JSON.stringify({ ...existing, jobs: state.jobs || [] }))
    }
  }, [existing, postData, state.email, state.jobs])

  const columns = useMemo(
    () => createColumns(getStatusColor, state.settings?.theme || 'light'),
    [state.settings]
  )

  const table = useReactTable({
    data: month > 0 || Number.isNaN(month) ? filteredJobs : (lastWeeksJobs ?? []),
    columns,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    onSortingChange: (sorting) =>
      setTableState((prev) => ({
        ...prev,
        sorting: typeof sorting === 'function' ? sorting(prev.sorting) : sorting,
      })),
    onColumnFiltersChange: (columnFilters) =>
      setTableState((prev) => ({
        ...prev,
        columnFilters:
          typeof columnFilters === 'function' ? columnFilters(prev.columnFilters) : columnFilters,
      })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (columnVisibility) =>
      setTableState((prev) => ({
        ...prev,
        columnVisibility:
          typeof columnVisibility === 'function'
            ? columnVisibility(prev.columnVisibility)
            : columnVisibility,
      })),
    onRowSelectionChange: (rowSelection) =>
      setTableState((prev) => ({
        ...prev,
        rowSelection:
          typeof rowSelection === 'function' ? rowSelection(prev.rowSelection) : rowSelection,
      })),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.getColumn(filterBy)?.setFilterValue(event.target.value)
      table.setPageIndex(0) // Reset to first page
    },
    [filterBy, table]
  )

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={`Filter companies ${month > 0 ? `from ${months[month - 1]}` : 'from last week'}...`}
            value={(table.getColumn('company')?.getFilterValue() as string) ?? ''}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-8 h-7 w-7 -translate-y-1/2 p-0"
              >
                <span className="sr-only">Filter By</span>
                <FunnelIcon className="hidden h-4 w-4 lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTableState((prev) => ({ ...prev, filterBy: 'company' }))}
              >
                Company Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTableState((prev) => ({ ...prev, filterBy: 'position' }))}
              >
                Position Applied For
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTableState((prev) => ({ ...prev, filterBy: 'contactPerson' }))}
              >
                Recruiter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {typeof table.getColumn('company')?.getFilterValue() === 'string' &&
          (table.getColumn('company')?.getFilterValue() as string).length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => table.getColumn('company')?.setFilterValue('')}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          ) : null}
        </div>
        <JobsModal />
        <Button className="max-sm:hidden" onClick={handleSave} variant="outline">
          <SaveIcon />
          Save
        </Button>
        <span className="ml-4 text-sm max-sm:hidden">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <span className="ml-4 text-sm md:hidden">
          Number of Jobs: {table.getFilteredRowModel().rows.length}{' '}
          {month === 0 ? ' last week' : ''}
          {month === 0 && thisWeeksJobsCount ? ` (vs. This week: ${thisWeeksJobsCount})` : ''}
        </span>
        {month > 0 ? (
          <JobsByWeek keyPrefix={`jobs-for-${month}-${year}`} jobs={monthSubGroup || []} />
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto max-md:hidden">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center py-4">
        <h2>
          Jobs you applied to{' '}
          {month === 0 ? 'last week' : `in ${months[month - 1]} ${year ? year : ''}`}:
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() =>
            exportToExcel(
              month > 0 || Number.isNaN(month) ? filteredJobs : lastWeeksJobs || [],
              [
                'applicationDate',
                'company',
                'address',
                'phone',
                'position',
                'linkToJobPosting',
                'salaryRange',
                'jobType',
                'linkToJobAccount',
              ],
              `jobs-${month > 0 ? `month-${month}` : 'last-week'}${year ? `-${year}` : ''}`
            )
          }
        >
          Export to Excel
        </Button>
      </div>
      <JobActivity jobs={monthSubGroup || []} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className={accentClasses}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  )
}
