import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

export default function ForumPage() {
  const [threads, setThreads] = useState([])
  const [newThread, setNewThread] = useState({ title: '', content: '' })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('forumThreads')) || []
    setThreads(stored)
  }, [])

  const handleChange = (e) => {
    setNewThread({ ...newThread, [e.target.name]: e.target.value })
  }

  const handlePost = () => {
    if (!newThread.title || !newThread.content) return
    const updated = [
      ...threads,
      {
        id: Date.now(),
        title: newThread.title,
        content: newThread.content,
        author: 'MockUser', // Later: replace with logged-in user
        date: new Date().toLocaleString(),
        replies: [],
      },
    ]
    setThreads(updated)
    localStorage.setItem('forumThreads', JSON.stringify(updated))
    setNewThread({ title: '', content: '' })
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Forum
      </Typography>

      {/* Create New Thread */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Create New Thread</Typography>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={newThread.title}
          onChange={handleChange}
          sx={{ my: 1 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Content"
          name="content"
          value={newThread.content}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          onClick={handlePost}
          sx={{ mt: 2 }}
        >
          Post
        </Button>
      </Paper>

      {/* Thread List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Threads
        </Typography>
        {threads.length === 0 ? (
          <Typography>No threads yet. Be the first to post!</Typography>
        ) : (
          <List>
            {threads.map((thread) => (
              <ListItem
                key={thread.id}
                component="a"
                href={`/forum/thread/${thread.id}`}
                button
              >
                <ListItemText
                  primary={thread.title}
                  secondary={`by ${thread.author} on ${thread.date}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
