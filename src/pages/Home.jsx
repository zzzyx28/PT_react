import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          欢迎来到 My PT Site
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          一个高效、有趣的私有种子分享社区。您可以上传、搜索和下载种子，与他人互动，并保持良好的分享率。
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/torrents"
            sx={{ mx: 1 }}
          >
            浏览种子
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            component={Link}
            to="/upload"
            sx={{ mx: 1 }}
          >
            上传种子
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
