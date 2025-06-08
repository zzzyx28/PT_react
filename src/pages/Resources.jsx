import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material'
import axios from 'axios'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // 替换为你自己的 API 地址
        const response = await axios.get('http://localhost:8080/api/resources/list')
        setResources(response.data)
      } catch (err) {
        console.error('获取资源失败:', err)
        setError('加载资源失败，请稍后重试。')
      }
    }

    fetchResources()
  }, [])

  const handleDelete = (resource) => {
    console.log('删除资源：', resource)
    alert(`已点击删除「${resource.title}」，尚未连接后端。`)
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f0f2f5', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        资源管理
      </Typography>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3} sx={{ width: '100%', overflowX: 'auto', borderRadius: 2 }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>标题</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>上传时间</TableCell>
                <TableCell>上传用户</TableCell>
                <TableCell>浏览</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.resourceId} hover>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>{resource.createTime}</TableCell>
                  <TableCell>{resource.username}</TableCell>
                  <TableCell>{resource.views}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(resource)}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}
