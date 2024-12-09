import { useState, useEffect } from 'react'
import { Protocol, protocolService } from '../services/supabase'

export function useProtocolSearch(initialQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchProtocols = async () => {
      setLoading(true)
      setError(null)

      try {
        const results = await protocolService.list()
        const filteredProtocols = results.filter((protocol) =>
          protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          protocol.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setProtocols(filteredProtocols)
      } catch (err) {
        console.error('Failed to search protocols:', err)
        setError('Failed to search protocols')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimeout = setTimeout(searchProtocols, 300)
    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    protocols,
    loading,
    error,
  }
}
