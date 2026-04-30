import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { useAuth } from '@/components/providers/hooks'
import { Input } from '@/components/ui/input'
import type { Job, SearchType } from '@/global/types'

import { AutoSuggestResults } from './auto-suggest-results'
import { SearchResultCards } from './search-result-cards'

const MIN_QUERY_LENGTH = 3

const SEARCH_URL = 'http://localhost:8080/api/data/search/'

type DisplayType = 'auto-suggest' | 'search-result-cards'

export function SearchBar({
  displayType = 'auto-suggest',
  searchType = 'company',
}: {
  displayType?: DisplayType
  searchType?: SearchType
}) {
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
      {open && displayType === 'auto-suggest' ? (
        <AutoSuggestResults ref={boxRef} results={results || []} searchType={searchType} />
      ) : null}
      {displayType === 'search-result-cards' ? (
        <SearchResultCards
          minQueryLength={MIN_QUERY_LENGTH}
          query={query}
          results={results || []}
          searchType={searchType}
        />
      ) : null}
    </div>
  )
}
