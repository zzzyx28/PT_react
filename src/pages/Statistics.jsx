import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function Statistics() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState(() => { });

  const data = [
    ['日期', '流量峰值', '热门分类', '用户留存率'],
    ['2025-06-07', '12345', '新闻, 视频, 学习', '67%'],
    ['2025-06-06', '10876', '娱乐, 教育', '65%'],
  ];

  const handleOpenDialog = (content, onConfirm) => {
    setDialogContent(content);
    setDialogAction(() => () => {
      onConfirm();
      setOpenDialog(false);
    });
    setOpenDialog(true);
  };

  const exportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '数据统计.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = (type) => {
    if (type === '日报') {
      handleOpenDialog('确认生成日报？', () => console.log('日报生成完成'));
    } else if (type === '月报') {
      handleOpenDialog('确认生成月报？', () => console.log('月报生成完成'));
    } else if (type === '导出') {
      handleOpenDialog('确认导出 CSV 文件？', exportCsv);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        数据统计
      </Typography>

      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: 400 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleAction('日报')}
        >
          生成日报
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => handleAction('月报')}
        >
          生成月报
        </Button>
      </Stack>

      <Card sx={{ mt: 4, width: '100%', maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            数据概览（静态示例）
          </Typography>
          <Typography variant="body1">📈 流量峰值：12345</Typography>
          <Typography variant="body1">🔥 热门分类：新闻、视频、学习</Typography>
          <Typography variant="body1">👥 用户留存率：67%</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            📄 支持导出 <b>CSV</b> 格式数据，自定义时间范围
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleAction('导出')}
            sx={{ mt: 2 }}
            fullWidth
          >
            导出 CSV 文件
          </Button>
        </CardContent>
      </Card>

      {/* 通用弹窗（与 Users 页一致） */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
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
