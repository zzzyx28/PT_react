import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { getFeaturedTorrents } from '../api/mockApi';

export default function Home() {
  const [torrents, setTorrents] = useState([]);

  useEffect(() => {
    getFeaturedTorrents().then(setTorrents);
  }, []);

  return (
    <Container maxWidth="md" style={{ paddingTop: '50px' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" color="primary" gutterBottom>
          Welcome to Our Private Tracker
        </Typography>
        <Typography variant="h5" paragraph>
          Your go-to destination for exclusive, high-quality torrents. Join our community and access
          a wide range of content from movies, TV shows, music, and more.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/register">
          Join Now
        </Button>
      </Box>

      <Box mb={4}>
        <Typography variant="h4" color="primary" gutterBottom>
          Featured Torrents
        </Typography>
        <Grid container spacing={3}>
          {torrents.map((torrent) => (
            <Grid item xs={12} md={4} key={torrent.id}>
              <Box border={1} borderRadius="8px" p={2}>
                <Typography variant="h6">{torrent.title}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {torrent.description}
                </Typography>
                <Button variant="outlined" color="primary" fullWidth>
                  Download
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box textAlign="center" mt={4}>
        <Typography variant="h5" paragraph>
          Ready to explore more? Dive into our vast collection of exclusive torrents!
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/browse-torrents">
          Browse Torrents
        </Button>
      </Box>
    </Container>
  );
}
