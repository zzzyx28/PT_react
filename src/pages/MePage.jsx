import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material'

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
  }, [])

  if (!user) return <Typography>加载中...</Typography>

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 5,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.avatarUrl || ''}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {user.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography><strong>等级：</strong>{user.level}</Typography>
        <Typography><strong>经验值：</strong>{user.experience}</Typography>
        <Typography><strong>魔力值：</strong>{user.magicValue}</Typography>
        <Typography><strong>邀请码：</strong>{user.inviteCode}</Typography>
        <Typography>
          <strong>邮箱验证状态：</strong>
          {user.is_email_verified ? '已验证' : '未验证'}
        </Typography>
        <Typography><strong>个性签名：</strong>{user.signature || '未设置'}</Typography>
        <Typography>
          <strong>注册时间：</strong>
          {new Date(user.createdAt).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  )
}
