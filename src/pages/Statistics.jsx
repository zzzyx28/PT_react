import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';

export default function Statistics() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState(() => {});
  const [logs, setLogs] = useState([]);

  const handleOpenDialog = (content, onConfirm) => {
    setDialogContent(content);
    setDialogAction(() => () => onConfirm());
    setOpenDialog(true);
  };

  const exportCsv = () => {
    if (!logs.length) {
      alert('没有日志数据可导出');
      return;
    }
    const header = Object.keys(logs[0]).join(',');
    const rows = logs.map(log =>
      Object.values(log)
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '数据统计.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = (type) => {
    const limit = type === '日报' ? 10 : 20;
    if (type === '日报' || type === '月报') {
      handleOpenDialog(`确认生成${type}？`, async () => {
        try {
          const res = await axios.get('http://localhost:8080/api/logs/latest', {
            params: { limit },
          });
          setLogs(res.data || []);
          alert(`${type}生成成功`);
          setOpenDialog(false);
        } catch (error) {
          console.error(`获取${type}失败`, error);
          alert(`获取${type}失败，请检查后台服务`);
          setOpenDialog(false);
        }
      });
    } else if (type === '导出') {
      handleOpenDialog('确认导出 CSV 文件？', () => {
        exportCsv();
        setOpenDialog(false);
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <Typography variant="h4" gutterBottom>
        数据统计
      </Typography>

      {/* 操作按钮 */}
      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
        <Button fullWidth variant="contained" color="primary" onClick={() => handleAction('日报')}>
          生成日报
        </Button>
        <Button fullWidth variant="contained" color="secondary" onClick={() => handleAction('月报')}>
          生成月报
        </Button>
        <Button fullWidth variant="outlined" color="success" onClick={() => handleAction('导出')}>
          导出 CSV
        </Button>
      </Stack>

      {/* 日志表格 */}
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Typography variant="h6" gutterBottom>
          日志数据概览
        </Typography>
        {logs.length === 0 ? (
          <Typography color="text.secondary">
            暂无日志数据，请生成日报或月报获取最新日志。
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 500,
              overflow: 'auto',
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell>方法</TableCell>
                  <TableCell>路径</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>耗时</TableCell>
                  <TableCell>请求体</TableCell>
                  <TableCell>响应体</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.timestamp || ''}</TableCell>
                    <TableCell>{log.method}</TableCell>
                    <TableCell>{log.path}</TableCell>
                    <TableCell>{log.status}</TableCell>
                    <TableCell>{log.duration ? `${log.duration}ms` : '未知'}</TableCell>
                    <TableCell>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{log.requestBody || '无'}</pre>
                    </TableCell>
                    <TableCell>
                      <pre
                        style={{
                          whiteSpace: 'pre-wrap',
                          margin: 0,
                          maxHeight: '100px',
                          overflow: 'auto',
                        }}
                      >
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(log.responseBody), null, 2);
                          } catch {
                            return log.responseBody || '无';
                          }
                        })()}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* 弹窗确认 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>{dialogContent}</DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#fff', bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
          >
            否
          </Button>
          <Button
            onClick={dialogAction}
            sx={{ color: '#fff', bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
          >
            是
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
