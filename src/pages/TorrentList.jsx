import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material'

export default function TorrentList() {
  const [torrents, setTorrents] = useState([])

  useEffect(() => {
    const data = [
      {
        torrentId: '0d3990e5f130a9c0a153bc75548fbb97',
        name: '20221201152508353707.docx',
        filename: '20221201152508353707.docx.torrent',
        title: '20221201152508353707.docx',
        description: '测试',
        status: 0,
        createTime: '2025-05-15 14:48:04.471832',
        updateTime: '2025-05-15 14:48:04.471832',
        comments: 0,
        views: 0,
        leechers: 0,
        seeders: 0,
        completions: 0,
      },
      {
        torrentId: '3',
        name: '20221201152508353707.docx',
        filename: '20221201152508353707.docx.torrent',
        title: '20221201152508353707.docx',
        description: '测试',
        status: 0,
        createTime: '2025-05-15 14:43:03.210414',
        updateTime: '2025-05-15 14:43:03.211410',
        comments: 0,
        views: 0,
        leechers: 0,
        seeders: 0,
        completions: 0,
      },
      {
        torrentId: '4c7473a4-05dd-43a3-ac32-dd238fa14735',
        name: '20221201152508353707.docx',
        filename: '20221201152508353707.docx.torrent',
        title: '20221201152508353707.docx',
        description: '测试',
        status: 0,
        createTime: '2025-05-15 14:47:22.794204',
        updateTime: '2025-05-15 14:47:22.794204',
        comments: 0,
        views: 0,
        leechers: 0,
        seeders: 0,
        completions: 0,
      },
    ]
    setTorrents(data)
  }, [])

  const handleDownload = (torrent) => {
    const link = document.createElement('a')
    link.href = `/torrents/${torrent.filename}` // 替换成实际路径
    link.download = torrent.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        p: 4,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" gutterBottom>
        种子列表
      </Typography>
      <Paper elevation={3} sx={{ width: '100%', overflowX: 'auto', borderRadius: 2 }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>标题</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>上传时间</TableCell>
              <TableCell>评论</TableCell>
              <TableCell>浏览</TableCell>
              <TableCell>做种</TableCell>
              <TableCell>下载</TableCell>
              <TableCell>完成</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torrents.map((torrent) => (
              <TableRow key={torrent.torrentId} hover>
                <TableCell>{torrent.title}</TableCell>
                <TableCell>{torrent.description}</TableCell>
                <TableCell>{torrent.createTime}</TableCell>
                <TableCell>{torrent.comments}</TableCell>
                <TableCell>{torrent.views}</TableCell>
                <TableCell>{torrent.seeders}</TableCell>
                <TableCell>{torrent.leechers}</TableCell>
                <TableCell>{torrent.completions}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleDownload(torrent)}>
                    下载
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
