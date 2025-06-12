import React from 'react'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Navbar({ showBackButton = false }) {
  const adminId = '093dd981-e6a0-4adc-b774-c9e4ec75e392'
  const userId = localStorage.getItem('userId')
  const isAdmin = userId === adminId

  return (
    <AppBar position="fixed" sx={{ height: 64 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h6" sx={{ ml: 2 }}>
          My PT Site
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mr: 2,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <Button color="inherit" component={Link} to="/home">
            首页
          </Button>
          <Button color="inherit" component={Link} to="/torrents">
            种子列表
          </Button>
          <Button color="inherit" component={Link} to="/announcement">
            公告
          </Button>
          <Button color="inherit" component={Link} to="/forum">
            论坛
          </Button>
          {/* <Button color="inherit" component={Link} to="/search">
            Search
          </Button> */}
          <Button color="inherit" component={Link} to="/upload">
            上传
          </Button>
          <Button color="inherit" component={Link} to="/chat">
            私信
          </Button>
          <Button color="inherit" component={Link} to="/me">
            个人中心
          </Button>
          
          {isAdmin && (
            <Button color="inherit" component={Link} to="/management">
              后台管理
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
