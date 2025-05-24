import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios
      .post('http://localhost:8080/api/user/login', null, {
        params: {
          email: formData.email,
          password: formData.password,
        },
      })
      .then((res) => {
        const user = res.data;
        // 假设 user 对象中包含 id/token/info
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      })
      .catch((err) => {
        const message =
          err.response?.data || '登录失败，请检查邮箱和密码';
        setError(message);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          登录
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="邮箱"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="密码"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            登录
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          没有账号？{' '}
          <Link component={RouterLink} to="/register">
            立即注册
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
