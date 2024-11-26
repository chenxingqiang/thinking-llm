import React from 'react';
import { Box, Typography, Avatar, Paper, TextField, Button } from '@mui/material';
import { useProtocolComments } from '../../hooks/useProtocolComments';
import { Comment } from '../../types/comment';

export const ProtocolComments: React.FC = () => {
  const { comments, addComment } = useProtocolComments();
  const [newComment, setNewComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">
            Post Comment
          </Button>
        </form>
      </Paper>

      {comments?.map((comment: Comment) => (
        <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Avatar src={comment.author.avatar} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle2">
                {comment.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Typography>{comment.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
}; 