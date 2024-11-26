import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with:', { supabaseUrl })

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Protocol = {
  id: string
  title: string
  description: string
  content: string
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
  user_id: string | null
  template_id: string | null
}

export type Template = {
  id: string
  title: string
  description: string | null
  content: string
  category: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

export type Activity = {
  id: string
  type: 'create' | 'edit' | 'delete'
  protocol_id: string
  protocol_title: string
  created_at: string
  user_id: string | null
}

const handleError = (error: any, customMessage: string) => {
  console.error(`${customMessage}:`, error)
  if (error?.code === '23503') {
    throw new Error('This protocol cannot be deleted because it is referenced by other items')
  }
  if (error?.code === '42501') {
    throw new Error('You do not have permission to perform this action')
  }
  throw new Error(customMessage)
}

export const protocolService = {
  list: async () => {
    try {
      console.log('Fetching protocols...')
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        handleError(error, 'Failed to fetch protocols')
      }
      
      console.log('Fetched protocols:', data)
      return data as Protocol[]
    } catch (err) {
      handleError(err, 'Failed to fetch protocols')
      return []
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        handleError(error, `Failed to fetch protocol with id ${id}`)
      }
      return data as Protocol
    } catch (err) {
      handleError(err, `Failed to fetch protocol with id ${id}`)
      return null
    }
  },

  create: async (protocol: Omit<Protocol, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .insert([protocol])
        .select()
        .single()

      if (error) {
        handleError(error, 'Failed to create protocol')
      }
      return data as Protocol
    } catch (err) {
      handleError(err, 'Failed to create protocol')
      return null
    }
  },

  update: async (id: string, protocol: Partial<Protocol>) => {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .update(protocol)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        handleError(error, `Failed to update protocol with id ${id}`)
      }
      return data as Protocol
    } catch (err) {
      handleError(err, `Failed to update protocol with id ${id}`)
      return null
    }
  },

  delete: async (id: string) => {
    try {
      // First check if the protocol exists
      const { data: protocol, error: fetchError } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        handleError(fetchError, `Failed to fetch protocol with id ${id}`)
        return
      }

      if (!protocol) {
        throw new Error(`Protocol with id ${id} not found`)
      }

      // Then attempt to delete
      const { error: deleteError } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id)

      if (deleteError) {
        handleError(deleteError, `Failed to delete protocol with id ${id}`)
      }

      return protocol
    } catch (err) {
      handleError(err, `Failed to delete protocol with id ${id}`)
    }
  },
}

export const templateService = {
  list: async () => {
    try {
      console.log('Fetching templates...')
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('title', { ascending: true })

      if (error) {
        handleError(error, 'Failed to fetch templates')
      }
      
      console.log('Fetched templates:', data)
      return data as Template[]
    } catch (err) {
      handleError(err, 'Failed to fetch templates')
      return []
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        handleError(error, `Failed to fetch template with id ${id}`)
      }
      return data as Template
    } catch (err) {
      handleError(err, `Failed to fetch template with id ${id}`)
      return null
    }
  },

  create: async (template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single()

      if (error) {
        handleError(error, 'Failed to create template')
      }
      return data as Template
    } catch (err) {
      handleError(err, 'Failed to create template')
      return null
    }
  },

  update: async (id: string, template: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(template)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        handleError(error, `Failed to update template with id ${id}`)
      }
      return data as Template
    } catch (err) {
      handleError(err, `Failed to update template with id ${id}`)
      return null
    }
  },

  delete: async (id: string) => {
    try {
      const { data: template, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        handleError(fetchError, `Failed to fetch template with id ${id}`)
        return
      }

      if (!template) {
        throw new Error(`Template with id ${id} not found`)
      }

      const { error: deleteError } = await supabase
        .from('templates')
        .delete()
        .eq('id', id)

      if (deleteError) {
        handleError(deleteError, `Failed to delete template with id ${id}`)
      }

      return template
    } catch (err) {
      handleError(err, `Failed to delete template with id ${id}`)
    }
  },
}

export const activityService = {
  list: async (limit?: number) => {
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        handleError(error, 'Failed to fetch activities')
      }
      return data as Activity[]
    } catch (err) {
      handleError(err, 'Failed to fetch activities')
      return []
    }
  },

  create: async (activity: Omit<Activity, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single()

      if (error) {
        handleError(error, 'Failed to create activity')
      }
      return data as Activity
    } catch (err) {
      handleError(err, 'Failed to create activity')
      return null
    }
  },
}
