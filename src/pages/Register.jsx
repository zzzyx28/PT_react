import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '', // ✅ 新增字段
    password: '',
    confirm: '',
    inviteCode: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/user/register', null, {
        params: {
          username: formData.username,
          email: formData.email,
          phone: formData.phone, // ✅ 传入手机号
          password: formData.password,
          inviteCode: formData.inviteCode,
        },
      });
      console.log(res.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
      <Typography variant="h4" gutterBottom>Register</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success ? (
        <Alert severity="success">Registered successfully! Check your email to verify.</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Invite Code"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            name="confirm"
            type="password"
            value={formData.confirm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>
      )}

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account? <Link to="/">Login</Link>
      </Typography>
    </Box>
  );
}
