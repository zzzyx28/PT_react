import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Alert,
  Snackbar,
} from '@mui/material'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

 const handleUpload = async () => {
  if (!file) {
    setErrorMessage('请选择一个 .torrent 文件')
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', category)
  formData.append('description', description)

  // 从 localStorage 读取 userId
  const userId = localStorage.getItem('userId')
  if (userId) {
    formData.append('uid', userId)
  } else {
    setErrorMessage('未找到用户ID，请重新登录')
    return
  }

  try {
    const token = localStorage.getItem('token') // 如果需要 token 带上
    const response = await axios.post('http://localhost:8080/api/torrents/upload', formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '', // 可选，带 token 认证
      },
    })

    setSuccessMessage(`上传成功：${response.data.title || response.data.filename}`)
    setFile(null)
    setCategory('')
    setDescription('')
  } catch (error) {
    console.error('上传失败', error)
    setErrorMessage(error.response?.data || '上传失败，请稍后再试')
  }
}

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        上传种子文件
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} mt={3}>
        <input
          type="file"
          accept=".torrent"
          onChange={handleFileChange}
          style={{ display: 'block' }}
        />

        <FormControl fullWidth>
          <InputLabel>分类</InputLabel>
          <Select value={category} label="分类" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="1">电影</MenuItem>
            <MenuItem value="2">电视剧</MenuItem>
            <MenuItem value="3">游戏</MenuItem>
            <MenuItem value="4">软件</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="描述"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button variant="contained" onClick={handleUpload}>
          上传
        </Button>
      </Box>

      {/* 成功提示 */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* 错误提示 */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}
