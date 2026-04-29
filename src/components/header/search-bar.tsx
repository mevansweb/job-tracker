import { useCallback, useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'

import { toast } from 'sonner'

import { useAuth } from '@/components/providers/hooks'
import { Input } from '@/components/ui/input'
import type { Job } from '@/global/types'

const MIN_QUERY_LENGTH = 3

const SEARCH_URL = 'http://localhost:8080/api/data/search/'

type SearchType = 'company' | 'position'

export function SearchBar({ searchType = 'company' }: { searchType?: SearchType }) {
  const {
    state: { id },
  } = useAuth()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Job[] | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)

  const performSearch = useCallback(
    async (searchQuery: string, searchType: SearchType) => {
      try {
        const url = `${SEARCH_URL}${id}/${encodeURIComponent(searchQuery)}/${searchType}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          toast.error(`Error: ${response.statusText}`)
        }

        const result = await response.json()
        setResults(result.length > 0 ? result : null)
        setOpen(true)
      } catch (err) {
        const error = err as Error
        toast.error(`'Search error: ${error.message}`)
      }
    },
    [id]
  )
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value
      const searchType = event.target.name as SearchType
      setQuery(newQuery)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (newQuery.trim().length >= MIN_QUERY_LENGTH) {
        timeoutRef.current = setTimeout(async () => {
          await performSearch(newQuery, searchType)
        }, 500)
      }
    },
    [performSearch]
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If click is outside the box, close it
      if (
        boxRef.current &&
        event.target instanceof Node &&
        !boxRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    // Listen for clicks
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative flex flex-col">
      <Input
        className="my-4 w-full cursor-pointer"
        name={searchType}
        onClick={() => {
          setOpen((prev) => !prev)
        }}
        onChange={handleOnChange}
        placeholder={`Search for a job by ${searchType}...`}
        value={query}
        type="text"
      />
      {open && results && results.length > 0 && (
        <div
          className="absolute top-12 right-0 left-0 z-10 mt-1 w-100 rounded-md border border-gray-200 bg-white p-4 text-sm shadow-lg"
          ref={boxRef}
        >
          {results.map((result: Job) => (
            <Link
              className="flex flex-col"
              key={`search-bar-result-${result.id}`}
              to={`/search/application/${result.id}`}
            >
              {searchType === 'position' ? (
                <div>
                  <strong>{result.position}</strong>
                  <br />
                  at {result.company} ({result.applicationDate})
                </div>
              ) : (
                <div>
                  <strong>{result.company}</strong>
                  <br />
                  {result.position} ({result.applicationDate})
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
