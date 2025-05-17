import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"> {/* fixed to top */}
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ ml: 2 }}>
            My PT Site
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            <Button color="inherit" component={Link} to="/home">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/announcement">
              Announcement
            </Button>
            <Button color="inherit" component={Link} to="/forum">
              Forum
            </Button>
            <Button color="inherit" component={Link} to="/search">
              Search
            </Button>
            <Button color="inherit" component={Link} to="/upload">
              Upload
            </Button>
            <Button color="inherit" component={Link} to="/chat">
              Chat
            </Button>
            <Button color="inherit" component={Link} to="/me">
              Me
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Add top margin to push content below navbar */}
      <Toolbar /> {/* acts as a spacer equal to AppBar height */}
    </Box>
  )
}
