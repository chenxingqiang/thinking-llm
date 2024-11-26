import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Activity, activityService } from '../../services/supabase'

export const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const data = await activityService.list(10)
      setActivities(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load activities:', err)
      setError('Failed to load recent activities')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return <AddIcon />
      case 'edit':
        return <EditIcon />
      case 'delete':
        return <DeleteIcon />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return 'success.main'
      case 'edit':
        return 'info.main'
      case 'delete':
        return 'error.main'
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'create':
        return `Created "${activity.protocol_title}"`
      case 'edit':
        return `Updated "${activity.protocol_title}"`
      case 'delete':
        return `Deleted "${activity.protocol_title}"`
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={getActivityText(activity)}
              secondary={new Date(activity.created_at).toLocaleString()}
            />
          </ListItem>
        ))}
        {activities.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
            No recent activities
          </Typography>
        )}
      </List>
    </Box>
  )
}
