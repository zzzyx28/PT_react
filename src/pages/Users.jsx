import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// 初始用户数据
const initialUsers = [
  { id: 1, username: "Alice", torrents: 5, level: 1, banned: false },
  { id: 2, username: "Bob", torrents: 3, level: 2, banned: false },
  { id: 3, username: "Charlie", torrents: 7, level: 3, banned: false }
];

// 初始邀请码数据
const initialInvites = [
  { code: "AB12CD34", status: "未使用", userId: 1 },
  { code: "EF56GH78", status: "已使用", userId: 2 }
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [invites, setInvites] = useState(initialInvites);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogAction, setDialogAction] = useState(() => { });
  const [editingLevels, setEditingLevels] = useState({});

  const handleOpenDialog = (content, onConfirm) => {
    setDialogContent(content);
    setDialogAction(() => () => {
      onConfirm();
      setOpenDialog(false);
    });
    setOpenDialog(true);
  };

  const handleBan = (id) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, banned: true } : user
      )
    );
  };

  const handleUnban = (id) => {
    const user = users.find(u => u.id === id);
    if (!user.banned) {
      handleOpenDialog("该用户未封禁，无需解禁", () => { });
      return;
    }
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, banned: false } : user
      )
    );
  };

  const handleLevelChange = (id, value) => {
    setEditingLevels(prev => ({ ...prev, [id]: value }));
  };

  const handleLevelConfirm = (id) => {
    const newLevel = parseInt(editingLevels[id]);
    if (!isNaN(newLevel)) {
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, level: newLevel } : user
        )
      );
      setEditingLevels(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const generateInviteCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInvites(prev => [...prev, { code, status: "未使用", userId: "-" }]);
  };

  return (
    <Box sx={{ p: 2, height: "calc(100vh - 64px)", width: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" gutterBottom>用户管理</Typography>

      {/* 用户表格区域 */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", mb: 2 }}>
        <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {["ID", "用户名", "种子数", "等级", "封禁状态", "管理"].map(col => (
                  <TableCell key={col} align="center" sx={{ border: "1px solid #ddd" }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{user.id}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{user.username}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{user.torrents}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    <TextField
                      value={editingLevels[user.id] ?? user.level}
                      onChange={(e) => handleLevelChange(user.id, e.target.value)}
                      type="number"
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Button
                      size="small"
                      sx={{ ml: 1, bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#115293" } }}
                      onClick={() => handleLevelConfirm(user.id)}
                    >
                      确定
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {user.banned ? "封禁" : "未封禁"}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    <Button
                      size="small"
                      onClick={() =>
                        handleOpenDialog("确认封禁该用户？", () => handleBan(user.id))
                      }
                      sx={{
                        mr: 1,
                        color: "#fff",
                        bgcolor: "#f44336", // 红色
                        "&:hover": { bgcolor: "#d32f2f" }
                      }}
                    >
                      封禁
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleOpenDialog("确认解禁该用户？", () => handleUnban(user.id))
                      }
                      sx={{
                        color: "#fff",
                        bgcolor: "#1976d2", // 蓝色
                        "&:hover": { bgcolor: "#115293" }
                      }}
                    >
                      解禁
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 邀请码表格区域 */}
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>邀请码管理</Typography>
          <IconButton onClick={generateInviteCode} color="primary">
            <AddIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>邀请码</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>状态</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>对应用户ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((invite, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.code}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.status}</TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{invite.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 通用弹窗 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#fff", bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } }}
          >
            否
          </Button>
          <Button
            onClick={dialogAction}
            sx={{ color: "#fff", bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
          >
            是
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
