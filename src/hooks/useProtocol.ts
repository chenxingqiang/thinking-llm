import { useState, useEffect } from 'react'
import { Protocol } from '../types/protocol'
import { protocolService } from '../services/supabase'

interface UseProtocolOptions {
  id: string
}

interface UseProtocolResult {
  protocol: Protocol | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useProtocol({ id }: UseProtocolOptions): UseProtocolResult {
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProtocol = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await protocolService.getById(id)
      setProtocol(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch protocol')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProtocol()
  }, [id])

  return {
    protocol,
    loading,
    error,
    reload: fetchProtocol
  }
}
