import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar({ showBackButton = false }) {
  return (
    <AppBar position="fixed" sx={{ height: 64 }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        overflow: 'hidden', // 防止内容溢出
      }}>
        <Typography variant="h6" sx={{ ml: 2 }}>
          My PT Site
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mr: 2,
          overflowX: 'auto', // 允许横向滚动
          whiteSpace: 'nowrap', // 防止换行
        }}>
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
          <Button color="inherit" component={Link} to="/torrents">
            TorrentList
          </Button>
          <Button color="inherit" component={Link} to="/management">
            Management
          </Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}
