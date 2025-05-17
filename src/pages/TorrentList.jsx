import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material'

// 模拟后端返回的数据
const mockData = [
  {
    torrentId: '0d3990e5f130a9c0a153bc75548fbb97',
    name: '20221201152508353707.docx',
    filename: '20221201152508353707.docx.torrent',
    title: '20221201152508353707.docx',
    description: '测试',
    status: 0,
    createTime: '2025-05-15 14:48:04.471832',
    updateTime: '2025-05-15 14:48:04.471832',
    ownerId: null,
    type: 1,
    comments: 0,
    views: 0,
    leechers: 0,
    seeders: 0,
    completions: 0,
    infoHash: 'Q+ONMkoNq1iRDyoiro/l+M+go9A=',
    size: null,
    fileCount: null,
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
    ownerId: null,
    type: 1,
    comments: 0,
    views: 0,
    leechers: 0,
    seeders: 0,
    completions: 0,
    infoHash: null,
    size: null,
    fileCount: null,
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
    ownerId: null,
    type: 1,
    comments: 0,
    views: 0,
    leechers: 0,
    seeders: 0,
    completions: 0,
    infoHash: 'Q+ONMkoNq1iRDyoiro/l+M+go9A=',
    size: null,
    fileCount: null,
  },
]

export default function TorrentList() {
  const [torrents, setTorrents] = useState([])

  useEffect(() => {
    // 模拟后端请求
    setTorrents(mockData)
  }, [])

  return (
    <Box sx={{ maxWidth: '90%', mx: 'auto', mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        种子列表
      </Typography>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>做种</TableCell>
              <TableCell>下载</TableCell>
              <TableCell>完成</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torrents.map((torrent) => (
              <TableRow key={torrent.torrentId}>
                <TableCell>{torrent.title}</TableCell>
                <TableCell>{torrent.description}</TableCell>
                <TableCell>{new Date(torrent.createTime).toLocaleString()}</TableCell>
                <TableCell>{torrent.seeders}</TableCell>
                <TableCell>{torrent.leechers}</TableCell>
                <TableCell>{torrent.completions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
