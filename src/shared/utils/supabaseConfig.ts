export const supabaseConfig = {
  apiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.SUPABASE_JWT_SECRET,
  storageConfig: {
    buckets: {
      protocols: 'protocols',
      avatars: 'avatars',
      attachments: 'attachments'
    },
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  realtimeConfig: {
    eventsPerSecond: 10,
    channels: {
      protocol: 'protocol',
      comments: 'comments',
      notifications: 'notifications'
    }
  }
} as const;

export type StorageBucket = keyof typeof supabaseConfig.storageConfig.buckets;
export type RealtimeChannel = keyof typeof supabaseConfig.realtimeConfig.channels; 