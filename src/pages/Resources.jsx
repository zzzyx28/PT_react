import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';

export default function ResourceManager() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 分页相关（你后端默认page=1,size=10）
  const [page, setPage] = useState(1);
  const size = 10;

  useEffect(() => {
  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/torrents/list?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error(`请求失败，状态码 ${response.status}`);
      }
      const data = await response.json();
      console.log('接口返回数据:', data);
      setResources(data);
    } catch (err) {
      setError(err.message);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  fetchResources();
}, [page]);


  const handleDelete = (id) => {
    // 这里示例只是前端删除状态，不调用后端删除接口
    setResources(prev => prev.filter(item => item.torrentId !== id));
  };

  return (
    <Box sx={{ px: 4, pt: 1, width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 0 }}>
        资源管理
      </Typography>

      {loading && <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>标题</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.length > 0 ? (
                resources.map((row) => (
                  <TableRow key={row.torrentId}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.createTime}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        // 这里下载逻辑你自己写
                        onClick={() => alert(`下载种子：${row.filename}`)}
                      >
                        下载
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(row.torrentId)}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    暂无资源
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
