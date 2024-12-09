import { useCallback } from 'react'
import { protocolService, activityService } from '../services/supabase'

export function useProtocolExplore() {
  const handleDelete = useCallback(async (id: string) => {
    try {
      const protocol = await protocolService.getById(id)
      if (!protocol) {
        throw new Error('Protocol not found')
      }

      await protocolService.delete(id)
      
      await activityService.create({
        type: 'delete',
        protocol_id: id,
        protocol_title: protocol.title,
      })

      return true
    } catch (err) {
      console.error('Failed to delete protocol:', err)
      return false
    }
  }, [])

  return {
    handleDelete,
  }
}
