import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { mockRegister } from '../api/authMockApi' 
export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
  
    mockRegister(formData)
      .then(() => {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 1500)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success ? (
        <Alert severity="success">Registered successfully! Redirecting to login...</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            sx={{ backgroundColor: 'gray', color: 'white' }}
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required

          />
          <TextField
            label="Password"
            name="password"
            sx={{ backgroundColor: 'gray', color: 'white' }}
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
            sx={{ backgroundColor: 'gray', color: 'white' }}
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
