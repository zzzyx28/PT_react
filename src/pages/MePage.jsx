import { useEffect, useState } from 'react'
import { Box, Typography, Paper, Avatar, Divider } from '@mui/material'

export default function MePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('fakeUser'))
    if (stored) {
      setUser(stored)
    }
  }, [])

  if (!user) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">You are not logged in.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: Just now (mock)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Account Information:</Typography>
        <Typography>Username: {user.username}</Typography>
        <Typography>Password: {user.password}</Typography> {/* ⚠️ for dev only */}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Tracker Stats (Mock):</Typography>
        <Typography>Uploaded: 0 GB</Typography>
        <Typography>Downloaded: 0 GB</Typography>
        <Typography>Ratio: ∞</Typography>
        <Typography>Forum Posts: 0</Typography>
      </Paper>
    </Box>
  )
}
