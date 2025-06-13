import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
import { Buffer } from 'buffer'  // 这一行要加在最顶
import bencode from 'bencode'
// hex 转 Uint8Array（Buffer）
const hexStringToUint8Array = (hexString) => {
  const array = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    array[i / 2] = parseInt(hexString.substr(i, 2), 16)
  }
  return array
}
// base64 转为 hex（tracker 用 hex 编码的 info_hash）
const base64ToHex = (base64) => {
  const raw = atob(base64)
  return Array.from(raw)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

// 向 tracker 查询种子信息
const fetchTrackerInfo = async (infoHashHex) => {
  try {
    // 用 buffer polyfill 转换
    const infoHashBuffer = Buffer.from(infoHashHex, 'hex')
    const infoHashEncoded = Array.from(infoHashBuffer)
      .map((byte) => `%${byte.toString(16).padStart(2, '0').toUpperCase()}`)
      .join('')

    const url = `/api/proxy/announce?info_hash=${infoHashEncoded}&peer_id=12345678901234567890&port=6881&uploaded=0&downloaded=0&left=0&event=started`
 console.log('Tracker Request URL:', url) // 打印 URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    })

    console.log('Tracker Response:', response) // 打印完整响应
    console.log('Response Data (Raw):', response.data) // 打印原始数据

    // 这里同样用 Buffer polyfill 包裹响应数据
    const decoded = bencode.decode(Buffer.from(response.data))
   console.log('Decoded Tracker Response:', decoded) // 打印解码后的数据
    return {
      seeders: decoded.complete || 0,
      leechers: decoded.incomplete || 0,
      completion: decoded.downloaded || 0,
    }
  } catch (err) {
    console.error('Tracker 请求失败:', err)
    return {
      seeders: '-',
      leechers: '-',
      completion: '-',
    }
  }
}


export default function TorrentList() {
  const [torrents, setTorrents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTorrents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/torrents/list")
        const data = response.data

        // 并发向 tracker 获取种子状态
        const enrichedData = await Promise.all(
          data.map(async (torrent) => {
            const infoHashHex = base64ToHex(torrent.infoHash)
            const trackerData = await fetchTrackerInfo(infoHashHex)
            return {
              ...torrent,
              ...trackerData,
            }
          })
        )

        setTorrents(enrichedData)
      } catch (err) {
        console.error('获取种子列表失败', err)
        setError('无法加载种子列表，请稍后重试。')
      }
    }

    fetchTorrents()
  }, [])

  const handleDownload = async (torrent) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/torrents/download/${torrent.torrentId}`,
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', torrent.filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败', error)
      alert('下载失败，请稍后再试')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f0f2f5', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        种子列表
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
                {/* <TableCell>评论</TableCell>
                <TableCell>浏览</TableCell> */}
                <TableCell>做种</TableCell>
                {/* <TableCell>下载中</TableCell> */}
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
                  {/* <TableCell>{torrent.comments}</TableCell>
                  <TableCell>{torrent.views}</TableCell> */}
                  <TableCell>{torrent.seeders}</TableCell>
                  {/* <TableCell>{torrent.leechers}</TableCell> */}
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
      )}
    </Box>
  )
}
