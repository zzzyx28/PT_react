import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'

export default function UserRanking() {
  const [magicRanking, setMagicRanking] = useState([])
  const [downloadRanking, setDownloadRanking] = useState([])
  const [torrentRanking, setTorrentRanking] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/ranking/top-magic_value'),
      axios.get('http://localhost:8080/api/ranking/top-download'),
      axios.get('http://localhost:8080/api/ranking/topTorrent-download'),
    ])
      .then(([magicRes, downloadRes, torrentRes]) => {
        const magicSorted = Array.isArray(magicRes.data)
          ? magicRes.data.sort((a, b) => b.magic_value - a.magic_value)
          : []
        const downloadSorted = Array.isArray(downloadRes.data)
          ? downloadRes.data.sort((a, b) => b.downloadCount - a.downloadCount)
          : []
        const torrentSorted = Array.isArray(torrentRes.data)
          ? torrentRes.data.sort((a, b) => b.downloadCount - a.downloadCount)
          : []

        setMagicRanking(magicSorted)
        setDownloadRanking(downloadSorted)
        setTorrentRanking(torrentSorted)
        setLoading(false)
      })
      .catch((err) => {
        console.error('排行榜请求出错:', err)
        setError('获取排行榜失败')
        setLoading(false)
      })
  }, [])

  const renderTable = (title, data, columns) => (
    <Paper
      elevation={4}
      sx={{
        flex: '1',
        minWidth: '300px',
        mx: 1,
        p: 2,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">排名</TableCell>
              {columns.map((col) => (
                <TableCell key={col.key} align="center">
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} align="center">
                    {item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
        px: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        用户排行榜
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // 兼容小屏幕换行
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {renderTable('魔力值排行榜', magicRanking, [
          { key: 'username', label: '用户名' },
          { key: 'level', label: '等级' },
        //   { key: 'downloadCount', label: '下载次数' },
        //   { key: 'magic_value', label: '魔力值' },
        ])}

        {renderTable('用户下载量排行榜', downloadRanking, [
          { key: 'username', label: '用户名' },
          { key: 'level', label: '等级' },
          { key: 'downloadCount', label: '下载次数' },
        ])}

        {renderTable('种子下载量排行榜', torrentRanking, [
          { key: 'username', label: '用户名' },
          { key: 'downloadCount', label: '下载次数' },
        ])}
      </Box>
    </Box>
  )
}
