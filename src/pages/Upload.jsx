import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    Alert,
  } from '@mui/material'
  import { useState } from 'react'
  
  export default function Upload() {
    const [form, setForm] = useState({
      title: '',
      category: '',
      description: '',
      torrentFile: null,
      imageFile: null,
    })
  
    const [success, setSuccess] = useState(false)
  
    const handleChange = (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  
    const handleFileChange = (e) => {
      setForm((prev) => ({ ...prev, torrentFile: e.target.files[0] }))
    }
  
    const handleImageChange = (e) => {
      setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }))
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
  
      // Simulate saving
      const mockData = {
        ...form,
        torrentFile: form.torrentFile?.name,
        imageFile: form.imageFile?.name,
      }
  
      console.log('Uploaded:', mockData)
      localStorage.setItem('mockUpload', JSON.stringify(mockData))
      setSuccess(true)
    }
  
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Upload Torrent
        </Typography>
  
        {success && <Alert severity="success">Torrent uploaded successfully!</Alert>}
  
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
  
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="Movies">Movies</MenuItem>
              <MenuItem value="TV">TV</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Games">Games</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
  
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
          />
  
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Torrent File</Typography>
            <input
              type="file"
              accept=".torrent"
              required
              onChange={handleFileChange}
            />
          </Box>
  
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Optional Image</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>
  
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Upload
          </Button>
        </form>
      </Box>
    )
  }
  