import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Management() {
  const navItems = [
    { text: '用户管理', path: '/management/users' },
    { text: '数据统计', path: '/management/statistics' },
    { text: '资源管理', path: '/management/resources' }
  ];

  const location = useLocation(); // 获取当前路径

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主体内容区域 */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        pt: '64px', // 顶部导航高度
        overflow: 'hidden'
      }}>
        {/* 左侧导航栏 */}
        <Box sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: '#1976d2',
          color: 'white',
          height: 'calc(100vh - 64px)',
          position: 'fixed',
          top: 64,
          left: 0,
          overflowY: 'auto'
        }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    py: 2,
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 'medium',
                      textTransform: 'uppercase',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* 右侧内容区域 */}
        <Box sx={{
          flex: 1,
          ml: '240px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px'
        }}>
          {/* 只在 /management 页面显示欢迎信息 */}
          {location.pathname === '/management' ? (
            <Box sx={{ maxWidth: '600px', margin: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                欢迎管理员进入后台管理界面
              </Typography>
              <Typography>详情请查看左侧导航栏。</Typography>
              <Typography>如需管理用户，请点击“用户管理”。</Typography>
              <Typography>如需统计数据，请点击“数据统计”。</Typography>
              <Typography>如需管理资源，请点击“资源管理”。</Typography>
            </Box>
          ) : (
            <Outlet />
          )}
        </Box>
      </Box>
    </Box>
  );
}
