import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Snackbar,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [torrents, setTorrents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newInviteCode, setNewInviteCode] = useState(null); // 存储新购买的邀请码

  const fetchProfile = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('未找到用户ID，请重新登录');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8080/api/user/profile', {
        params: { userId },
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
      .then((res) => {
        setUser(res.data);
        fetchUserTorrents(userId);
      })
      .catch((err) => {
        console.error('获取用户信息失败:', err);
        setError('获取用户信息失败');
        setLoading(false);
      });
  };

  const fetchUserTorrents = (userId) => {
    const token = localStorage.getItem('token');

    axios
      .get(`http://localhost:8080/api/torrents/owner/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
      .then((res) => {
        setTorrents(res.data.records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('获取用户种子资源失败:', err.response?.data || err.message);
        setError('获取用户种子资源失败');
        setLoading(false);
      });
  };

  // 购买邀请码
  const buyInviteCode = () => {
    const token = localStorage.getItem('token');
    const username = user?.userId;

    if (!username) {
      setSnackbarMessage('无法获取用户名');
      setSnackbarOpen(true);
      return;
    }

    axios
      .post(
        `http://localhost:8080/api/admin/invite-code/buy/${username}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      )
      .then((res) => {
        const message = res.data;
        // 提取邀请码（假设后端返回格式是 "购买邀请码成功 XXXXXX"）
        const code = message.split(' ').pop(); // 获取最后一个单词（邀请码）
        setNewInviteCode(code); // 存储新邀请码
        setSnackbarMessage('购买成功！新邀请码已生成。');
        setSnackbarOpen(true);
        fetchProfile(); // 刷新用户信息（更新魔力值）
      })
      .catch((err) => {
        console.error('购买邀请码失败:', err.response?.data || err.message);
        setSnackbarMessage(err.response?.data || '购买邀请码失败');
        setSnackbarOpen(true);
      });
  };

  // 复制邀请码到剪贴板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage('已复制到剪贴板！');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage('复制失败，请手动复制。');
        setSnackbarOpen(true);
      });
  };

  const uploadCount = torrents.length;
  const downloadCount = torrents.reduce((sum, torrent) => sum + (torrent.completions || 0), 0);
  const shareRatio = uploadCount > 0 ? (downloadCount / uploadCount).toFixed(2) : '0.00';

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) return null;

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
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.href = '/';
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>
            <strong>邀请码：</strong>
            {newInviteCode || user.inviteCode || '无'}
          </Typography>
          {/* 购买按钮 */}
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 2 }}
            onClick={buyInviteCode}
            disabled={user.magic_value < 50}
          >
            购买邀请码（50魔力值）
          </Button>
          {/* 复制按钮（仅当有邀请码时显示） */}
          {(newInviteCode || user.inviteCode) && (
            <IconButton
              size="small"
              sx={{ ml: 1 }}
              onClick={() => copyToClipboard(newInviteCode || user.inviteCode)}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
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

      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}