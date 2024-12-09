import React, { useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Paper,
  Typography
} from '@mui/material'
import { Comment } from '../../types/protocol'

interface ProtocolCommentsProps {
  comments: Comment[]
  onAddComment: (content: string) => Promise<void>
}

export const ProtocolComments: React.FC<ProtocolCommentsProps> = ({
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{comment.user_id.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={new Date(comment.created_at).toLocaleString()}
              secondary={comment.content}
            />
          </ListItem>
        ))}
        {comments.length === 0 && (
          <ListItem>
            <ListItemText primary="No comments yet" />
          </ListItem>
        )}
      </List>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 1 }}
          disabled={!newComment.trim() || isSubmitting}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  )
}
