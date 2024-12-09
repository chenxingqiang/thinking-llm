import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import { Template, ThinkingModel, ThinkingStep, ThinkingGuideline, ThinkingFramework, Protocol, Activity } from '../types/models'

export type { Template, ThinkingModel, ThinkingStep, ThinkingGuideline, ThinkingFramework, Protocol, Activity }

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

const handleError = (error: any, customMessage: string) => {
  console.error(customMessage, error)
  throw error
}

// Add DatabaseProtocol type to match DB schema
interface DatabaseProtocolRow {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string | null;
  category_id: string | null;
  users: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  categories: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  protocol_tags: {
    id: string;
    name: string;
  }[] | null;
}

// Transform function
const transformDatabaseRow = (row: DatabaseProtocolRow): Protocol => ({
  id: row.id,
  title: row.title,
  description: row.description,
  content: row.content,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_id: row.user_id || 'anonymous',
  category_id: row.category_id || undefined,
  author: {
    id: row.users?.id || 'anonymous',
    name: row.users?.name || 'Anonymous User',
    ...(row.users?.avatar_url && { avatar_url: row.users.avatar_url })
  },
  category: row.categories ? {
    id: row.categories.id,
    name: row.categories.name,
    ...(row.categories.description && { description: row.categories.description })
  } : undefined,
  tags: (row.protocol_tags || []).map(tag => ({
    id: tag.id,
    name: tag.name
  }))
});

export const protocolService = {
  async list(): Promise<Protocol[]> {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          id,
          title,
          description,
          content,
          status,
          created_at,
          updated_at,
          user_id,
          category_id,
          users:user_id (
            id,
            name,
            avatar_url
          ),
          categories:category_id (
            id,
            name,
            description
          ),
          protocol_tags (
            id,
            name
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as DatabaseProtocolRow[]).map(transformDatabaseRow);
    } catch (error) {
      console.error('Error fetching protocols:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Protocol | null> {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          id,
          title,
          description,
          content,
          status,
          created_at,
          updated_at,
          user_id,
          category_id,
          users:user_id (
            id,
            name,
            avatar_url
          ),
          categories:category_id (
            id,
            name,
            description
          ),
          protocol_tags (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? transformDatabaseRow(data as DatabaseProtocolRow) : null;
    } catch (error) {
      console.error(`Error fetching protocol ${id}:`, error);
      return null;
    }
  },

  async create(protocol: Omit<Protocol, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    try {
      const dbProtocol = {
        title: protocol.title,
        description: protocol.description,
        content: protocol.content,
        status: protocol.status as 'active' | 'archived'
      }

      const { data, error } = await supabase
        .from('protocols')
        .insert([dbProtocol])
        .select()
        .single()

      if (error) throw error
      return data ? transformDatabaseRow(data as DatabaseProtocolRow) : null
    } catch (error) {
      handleError(error, 'Error creating protocol:')
      return null
    }
  },

  async update(id: string, protocol: Partial<Protocol>) {
    try {
      const dbProtocol = {
        ...(protocol.title && { title: protocol.title }),
        ...(protocol.description && { description: protocol.description }),
        ...(protocol.content && { content: protocol.content }),
        ...(protocol.status && { status: protocol.status as 'active' | 'archived' })
      }

      const { data, error } = await supabase
        .from('protocols')
        .update(dbProtocol)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data ? transformDatabaseRow(data as DatabaseProtocolRow) : null
    } catch (error) {
      handleError(error, `Error updating protocol ${id}:`)
      return null
    }
  },

  async delete(id: string) {
    try {
      const { data: protocol, error: fetchError } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        handleError(fetchError, `Error fetching protocol with id ${id}:`)
        return
      }

      if (!protocol) {
        throw new Error(`Protocol with id ${id} not found`)
      }

      const { error: deleteError } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id)

      if (deleteError) {
        handleError(deleteError, `Error deleting protocol ${id}:`)
      }

      return protocol
    } catch (error) {
      handleError(error, `Error deleting protocol ${id}:`)
    }
  },
}

export const templateService = {
  async list() {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Template[]
    } catch (error) {
      handleError(error, 'Error fetching templates:')
      return []
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Template
    } catch (error) {
      handleError(error, `Error fetching template with id ${id}:`)
      return null
    }
  },

  async create(template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single()

      if (error) throw error
      return data as Template
    } catch (error) {
      handleError(error, 'Error creating template:')
      return null
    }
  },

  async update(id: string, template: Partial<Template>) {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(template)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Template
    } catch (error) {
      handleError(error, `Error updating template ${id}:`)
      return null
    }
  },

  async delete(id: string) {
    try {
      const { data: template, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        handleError(fetchError, `Error fetching template with id ${id}:`)
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
        handleError(deleteError, `Error deleting template ${id}:`)
      }

      return template
    } catch (error) {
      handleError(error, `Error deleting template ${id}:`)
    }
  },
}

export const activityService = {
  async list(limit?: number) {
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Activity[]
    } catch (error) {
      handleError(error, 'Error fetching activities:')
      return []
    }
  },

  async create(activity: Omit<Activity, 'id' | 'created_at' | 'user_id'>) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(activity)
        .select()
        .single()

      if (error) throw error
      return data as Activity
    } catch (error) {
      handleError(error, 'Error creating activity:')
      return null
    }
  },
}

export const thinkingService = {
  async listModels() {
    try {
      const { data, error } = await supabase
        .from('thinking_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ThinkingModel[]
    } catch (error) {
      handleError(error, 'Error fetching thinking models:')
      return []
    }
  },

  async getSteps(templateId: string) {
    try {
      const { data, error } = await supabase
        .from('thinking_steps')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data as ThinkingStep[]
    } catch (error) {
      handleError(error, `Error fetching thinking steps for template ${templateId}:`)
      return []
    }
  },

  async createStep(step: Omit<ThinkingStep, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('thinking_steps')
        .insert([step])
        .select()
        .single()

      if (error) throw error
      return data as ThinkingStep
    } catch (error) {
      handleError(error, 'Error creating thinking step:')
      return null
    }
  },

  async updateStep(id: string, step: Partial<ThinkingStep>) {
    try {
      const { data, error } = await supabase
        .from('thinking_steps')
        .update(step)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ThinkingStep
    } catch (error) {
      handleError(error, `Error updating thinking step ${id}:`)
      return null
    }
  },

  async deleteStep(id: string) {
    try {
      const { error } = await supabase
        .from('thinking_steps')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      handleError(error, `Error deleting thinking step ${id}:`)
      return false
    }
  },

  async getGuidelines(templateId: string) {
    try {
      const { data, error } = await supabase
        .from('thinking_guidelines')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ThinkingGuideline[]
    } catch (error) {
      handleError(error, `Error fetching thinking guidelines for template ${templateId}:`)
      return []
    }
  },

  async createGuideline(guideline: Omit<ThinkingGuideline, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('thinking_guidelines')
        .insert([guideline])
        .select()
        .single()

      if (error) throw error
      return data as ThinkingGuideline
    } catch (error) {
      handleError(error, 'Error creating thinking guideline:')
      return null
    }
  },

  async updateGuideline(id: string, guideline: Partial<ThinkingGuideline>) {
    try {
      const { data, error } = await supabase
        .from('thinking_guidelines')
        .update(guideline)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ThinkingGuideline
    } catch (error) {
      handleError(error, `Error updating thinking guideline ${id}:`)
      return null
    }
  },

  async deleteGuideline(id: string) {
    try {
      const { error } = await supabase
        .from('thinking_guidelines')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      handleError(error, `Error deleting thinking guideline ${id}:`)
      return false
    }
  },

  async getFrameworks(templateId: string) {
    try {
      const { data, error } = await supabase
        .from('thinking_frameworks')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ThinkingFramework[]
    } catch (error) {
      handleError(error, `Error fetching thinking frameworks for template ${templateId}:`)
      return []
    }
  },

  async createFramework(framework: Omit<ThinkingFramework, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('thinking_frameworks')
        .insert([framework])
        .select()
        .single()

      if (error) throw error
      return data as ThinkingFramework
    } catch (error) {
      handleError(error, 'Error creating thinking framework:')
      return null
    }
  },

  async updateFramework(id: string, framework: Partial<ThinkingFramework>) {
    try {
      const { data, error } = await supabase
        .from('thinking_frameworks')
        .update(framework)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as ThinkingFramework
    } catch (error) {
      handleError(error, `Error updating thinking framework ${id}:`)
      return null
    }
  },

  async deleteFramework(id: string) {
    try {
      const { error } = await supabase
        .from('thinking_frameworks')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      handleError(error, `Error deleting thinking framework ${id}:`)
      return false
    }
  },
}

export async function getProtocolById(id: string): Promise<Protocol | null> {
  try {
    const { data, error } = await supabase
      .from('protocols')
      .select(`
        *,
        author:users(id, name),
        category:categories(id, name),
        tags:protocol_tags(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;

    // Transform the data to match Protocol type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      category_id: data.category_id || undefined, // Convert null to undefined
      author: data.author || { // Provide default author if null
        id: 'unknown',
        name: 'Unknown Author'
      },
      category: data.category || undefined, // Convert null to undefined
      tags: data.tags || []
    };
  } catch (error) {
    console.error('Error fetching protocol:', error);
    throw error;
  }
}
