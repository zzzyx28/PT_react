import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [torrents, setTorrents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProfile = () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setError('未找到用户ID，请重新登录')
      setLoading(false)
      return
    }

    axios
      .get('http://localhost:8080/api/user/profile', {
        params: { userId },
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
      .then((res) => {
        setUser(res.data)
        // 再请求种子资源
        fetchUserTorrents(userId)
      })
      .catch((err) => {
        console.error('获取用户信息失败:', err)
        setError('获取用户信息失败')
        setLoading(false)
      })
  }

  const fetchUserTorrents = (userId) => {
  const token = localStorage.getItem('token')

  axios
    .get(`http://localhost:8080/api/torrents/owner/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    .then((res) => {
      console.log('获取到的种子资源数据:', res.data)
      setTorrents(res.data.records) // ✅ 改成 records
      setLoading(false)
    })
    .catch((err) => {
      console.error('获取用户种子资源失败:', err.response?.data || err.message)
      setError('获取用户种子资源失败')
      setLoading(false)
    })
}
const uploadCount = torrents.length
const downloadCount = torrents.reduce((sum, torrent) => sum + (torrent.completions || 0), 0)
const shareRatio = uploadCount > 0 ? (downloadCount / uploadCount).toFixed(2) : '0.00'


  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!user) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, width: 500, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={user.avatarUrl || ''} sx={{ width: 80, height: 80, mr: 2 }}>
            {user.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Chip
              label={user.is_email_verified ? '邮箱已验证' : '邮箱未验证'}
              color={user.is_email_verified ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
            <Button
    variant="outlined"
    color="error"
    size="small"
    onClick={() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      window.location.href = '/' // 或使用 navigate('/')，如果你使用 useNavigate
    }}
  >
    登出
  </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography>
          <strong>等级：</strong>
          {user.level}
        </Typography>
        <Typography>
          <strong>经验值：</strong>
          {user.experience}
        </Typography>
        <Typography>
          <strong>魔力值：</strong>
          {user.magic_value ?? '未设置'}
        </Typography>
        <Typography>
          <strong>邀请码：</strong>
          {user.inviteCode}
        </Typography>
        <Typography>
          <strong>个性签名：</strong>
          {user.signature || '未设置'}
        </Typography>
        <Typography>
          <strong>个人简介：</strong>
          {user.bio || '未填写'}
        </Typography>
        <Typography>
          <strong>注册时间：</strong>
          {new Date(user.createdAt).toLocaleString()}
        </Typography>
        <Typography>
          <strong>手机号：</strong>
          {user.phone || '未绑定'}
          {user.isPhoneVerified === 1 && (
            <Chip label="已验证" color="success" size="small" sx={{ ml: 1 }} />
          )}
        </Typography>
        <Typography color={user.isBanned ? 'error' : 'inherit'}>
          <strong>封禁状态：</strong>
          {user.isBanned ? '已封禁' : '正常'}
        </Typography>

        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button variant="outlined" size="small" onClick={fetchProfile}>
            刷新信息
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
  <Typography variant="h6">分享统计</Typography>
  <Typography>上传量（种子数量）：{uploadCount}</Typography>
  <Typography>下载量（总完成次数）：{downloadCount}</Typography>
  <Typography>分享率（平均每个种子被下载次数）：{shareRatio}</Typography>
</Box>

      </Paper>

      {/* 展示用户发布的种子资源 */}
      <Paper elevation={3} sx={{ p: 4, width: 500 }}>
        <Typography variant="h6" gutterBottom>
          我的种子资源
        </Typography>

        {torrents.length === 0 ? (
          <Typography color="text.secondary">暂无发布的种子资源。</Typography>
        ) : (
          <List>
            {torrents.map((torrent) => (
              <ListItem key={torrent.id}>
                <ListItemText
                  primary={torrent.title || torrent.filename}
                  secondary={`上传时间: ${new Date(torrent.createdAt).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
