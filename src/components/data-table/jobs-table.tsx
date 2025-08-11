import { useCallback, useEffect, useState } from 'react' //
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
import { ChevronDown, SaveIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { JobsModal } from '@/components/modal/jobs-modal'
import {
  DropdownMenu,
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
import type { Job } from '../../global/types'
import { columns } from './columns'
import { localStorageKey } from '../providers/const'
import { useAuth } from '../providers/hooks'

type JobsTableProps = {
  month: number
  monthSubGroup?: Job[]
}

export function JobsTable({ month, monthSubGroup }: JobsTableProps) {
  const { dispatch, existing, loading, postData, state } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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
    data: monthSubGroup || [],
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

  return month > 0 || Number.isNaN(month) ?  (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder='Filter companies...'
            value={(table.getColumn('company')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('company')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
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
          Page {table.getState().pagination.pageIndex + 1}
          {loading? '   loading...' : ''}
        </span>
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
  ) : null
}
